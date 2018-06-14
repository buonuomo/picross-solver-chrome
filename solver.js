// We retrieve the puzzle hints from local storage
var hintsX = JSON.parse(localStorage['picross.hintsX']),
    hintsY = JSON.parse(localStorage['picross.hintsY']),
    ydim = hintsX.length,
    xdim = hintsY.length;

// The DOM object for the puzzle table
var puzzleHTML = document.getElementById("puzzle").firstChild.firstChild;

// Clicks the box at (x,y): lr is 0 for left click, 1 for right click
function clickBox(x, y, lr) {
    var box = document.getElementById("puzzle").firstChild.firstChild.childNodes[x+1].childNodes[y+1]
    //console.log(box);
    var down = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        view: window,
        button: lr ? 2 : 0,
        buttons: lr ? 2 : 1,
        type: "mousedown",
        isTrusted: true
    });
    //console.log(down);
    var up = new MouseEvent("mouseup", {
        bubbles: true,
        cancelable: true,
        view: window,
        button: lr ? 2 : 0,
        buttons: lr ? 2 : 1,
        type: "mouseup",
        isTrusted: true
    });
    box.dispatchEvent(down);
    box.dispatchEvent(up);
    return;
}

// straight up looks up solution and fills it in. THIS IS SIMPLY CHEATING
function cheat() {
    var solution = JSON.parse(localStorage['picross.solution']);
    for (let i = 0; i < solution.length; i++) {
        for (let j = 0; j < solution[i].length; j++) {
            if (solution[i][j] == 2) clickBox(i,j,0);
        }
    }
    return;
}

// strategy that finds the "sums" of each row and col and fills in cells
// that must be right
function countRowsCols() {
    // goes through each row using the summing method
    for (let i = 0; i < ydim; i++) {
        let rowSum = hintsX[i].reduce((acc,x) => acc+x, 0) + hintsX[i].length - 1;
        let error = xdim - rowSum;
        let pos = error;
        for (let j = 0; j < hintsX[i].length; j++) {
            for (let k = 0; k < hintsX[i][j]; k++, pos++) {
                if (hintsX[i][j] - error - k > 0) clickBox(i,pos,0);
            }
            pos++;
        }
    }
    // does the same thing for each column
    for (let i = 0; i < xdim; i++) {
        let colSum = hintsY[i].reduce((acc,x) => acc+x, 0) + hintsY[i].length - 1;
        let error = ydim - colSum;
        let pos = error;
        for (let j = 0; j < hintsY[i].length; j++) {
            for (let k = 0; k < hintsY[i][j]; k++, pos++) {
                if (hintsY[i][j] - error - k > 0) clickBox(pos,i,0);
            }
            pos++;
        }
    }
    return;
}
                    
function edges() {
    var puzzle = JSON.parse(localStorage['picross.state']);
    for (let i = 0; i < ydim; i++) {
        let firstBlue = puzzle[i].findIndex(x => Math.abs(x) === 2);
        if (firstBlue !== -1) {
            // When it's one too short
            if (firstBlue - hintsX[i][0] === 0) clickBox(i,0,1);
            // If the first segment is longer than the first blue
            if (hintsX[i][0] - firstBlue > 1) {
                for (let j = 1; j < hintsX[i][0] - firstBlue; j++) {
                    clickBox(i,firstBlue+j,0);
                }
            }
        }
        let hxl = hintsX[i].length - 1;
        let lastBlue = puzzle[i].reduce((acc,x) => (_ => acc)(acc.unshift(x)), []).findIndex(x => Math.abs(x) === 2);
        if (lastBlue !== -1) {
            if (lastBlue - hintsX[i][hxl] === 0) clickBox(i,xdim-1,1);
            if (hintsX[i][hxl] - lastBlue > 1) {
                for (let j = 1; j < hintsX[i][hxl] - lastBlue; j++) {
                    clickBox(i,xdim-lastBlue-j-1,0);
                }
            }
        }
    }
    var puzzleT = puzzle[0].map((col, i) => puzzle.map(row => row[i]));
    for (let i = 0; i < xdim; i++) {
        let firstBlue = puzzleT[i].findIndex(x => Math.abs(x) === 2);
        if (firstBlue !== -1) {
            if (firstBlue - hintsY[i][0] === 0) clickBox(0,i,1);
            if (hintsY[i][0] - firstBlue > 1) {
                for (let j = 1; j < hintsY[i][0] - firstBlue; j++) {
                    clickBox(firstBlue+j,i,0);
                }
            }
        }
        let hyl = hintsY[i].length - 1;
        let lastBlue = puzzleT[i].reduce((acc,x) => (_ => acc)(acc.unshift(x)), []).findIndex(x => Math.abs(x) === 2);
        if (lastBlue !== -1) {
            if (lastBlue - hintsY[i][hyl] === 0) clickBox(ydim-1,i,1);
            if (hintsY[i][hyl] - lastBlue > 1) {
                for (let j = 1; j < hintsY[i][hyl] - lastBlue; j++) {
                    clickBox(ydim-lastBlue-j-1,i,0);
                }
            }
        }
    }
    return;
}

countRowsCols();
edges();

            

