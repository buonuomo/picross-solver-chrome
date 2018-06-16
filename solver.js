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
// NOTE: only to be called on empty puzzle
function countRowsCols() {
    // First check to make sure that the puzzle is completely empty
    var puzzle = JSON.parse(localStorage['picross.state']);
    if (puzzle.reduce((acc,row) => acc + row.reduce((acc,x) => acc + Math.abs(x), 0), 0) !== 0) return;
    // goes through each row using the summing method
    for (let i = 0; i < ydim; i++) {
        let rowSum = hintsX[i].reduce((acc,x) => acc + x, 0) + hintsX[i].length - 1;
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
                    
// Finds the index of the first empty block or blue block not bounded by a grey
function firstFree(row, start) {
    row = row.map(x => Math.abs(x));
    if (start === undefined) start = 0;
    if (start === row.length) return row.length;
    if (row[start] === 0) return start;
    if (row[start] === 1) return firstFree(row, start+1);
    let i = start;
    while (i < row.length && row[i] === 2) i++;
    if (i === row.length) return row.length;
    if (row[i] === 0) return start;
    if (row[i] === 1) return firstFree(row, i+1);
}

// finds the number of complete blue segments before a certain index in a row
// xy is either 'X' or 'Y'
// TODO: defer storage retrieval of hint row to calling funcion
function hintsBefore(i,xy) {
    let hintRow = JSON.parse(localStorage['picross.hints'+xy])[i];
    for (var j = 0; hintRow[j] < 0; j++);
    return j;
}

function hintsBeforeRev(i,xy) {
    let hintRow = JSON.parse(localStorage['picross.hints'+xy])[i];
    for (var j = hintRow.length-1; hintRow[j] < 0; j--);
    return j;
}


// when a blue is near an edge‚ fill in based on length of first/last block in
// row
function nearEdges() {
    var puzzle = JSON.parse(localStorage['picross.state']);
    for (let i = 0; i < ydim; i++) {
        let ffi = firstFree(puzzle[i]);
        //console.log("ffi:"+ffi);
        let hbi = hintsBefore(i,'X');
        //console.log("hbi: "+hbi);
        let firstBlue = puzzle[i].findIndex((x,i) => i >= ffi && Math.abs(x) === 2);
        //console.log("fb: "+firstBlue);
        if (firstBlue !== -1) {
            // When it's one too short
            if ((firstBlue - ffi) - hintsX[i][hbi] === 0) clickBox(i,ffi,1);
            // If the first segment is longer than the first blue
            if (hintsX[i][hbi] - (firstBlue - ffi) > 1) {
                for (let j = 1; j < hintsX[i][hbi] - (firstBlue - ffi); j++) {
                    clickBox(i,firstBlue+j,0);
                }
            }
            //console.log(firstBlue+','+ffi+','+hintsX[i][hbi]);
            //console.log(i);
            if (firstBlue === ffi && hbi < hintsX[i].length && firstBlue+hintsX[i][hbi] < xdim) clickBox(i,firstBlue+hintsX[i][hbi],1);
        }
        //let hxl = hintsX[i].length - 1;
        let revRow = puzzle[i].reduce((acc,x) => (_ => acc)(acc.unshift(x)), []);
        let rffi = firstFree(revRow);
        //console.log("rffi: "+rffi);
        let rhbi = hintsBeforeRev(i,'X');
        //console.log("rhbi: "+rhbi);
        let lastBlue = revRow.findIndex((x,i) => i >= rffi && Math.abs(x) === 2);
        //console.log("lb: "+lastBlue);
        if (lastBlue !== -1) {
            if ((lastBlue - rffi) - hintsX[i][rhbi] === 0) clickBox(i,xdim-rffi-1,1);
            if (hintsX[i][rhbi] - (lastBlue - rffi) > 1) {
                for (let j = 1; j < hintsX[i][rhbi] - (lastBlue - rffi); j++) {
                    clickBox(i,xdim-lastBlue-j-1,0);
                }
            }
            //console.log(lastBlue+','+r
            //console.log(i);
            //console.log(lastBlue+','+rhbi+','+(ydim-lastBlue-hintsY[i][rhbi]-1));
            if (lastBlue === rffi && rhbi < hintsX[i].length && xdim-lastBlue-hintsX[i][rhbi]-1 >= 0) clickBox(i,xdim-lastBlue-hintsX[i][rhbi]-1,1);
        }
    }
    // transpose the matrix so that we can get columns
    var puzzleT = puzzle[0].map((col, i) => puzzle.map(row => row[i]));
    for (let i = 0; i < xdim; i++) {
        let ffi = firstFree(puzzleT[i]);
        //console.log("ffi:"+ffi);
        let hbi = hintsBefore(i,'Y');
        //console.log("hbi: "+hbi);
        let firstBlue = puzzleT[i].findIndex((x,i) => i >= ffi && Math.abs(x) === 2);
        //console.log("fb: "+firstBlue);
        if (firstBlue !== -1) {
            if ((firstBlue - ffi) - hintsY[i][hbi] === 0) clickBox(ffi,i,1);
            if (hintsY[i][hbi] - (firstBlue - ffi) > 1) {
                for (let j = 1; j < hintsY[i][hbi] - (firstBlue - ffi); j++) {
                    clickBox(firstBlue+j,i,0);
                }
            }
            //console.log(i)
            if (firstBlue === ffi && hbi < hintsY[i].length && firstBlue+hintsY[i][hbi] < ydim) clickBox(firstBlue+hintsY[i][hbi],i,1);
        }
        let revRow = puzzleT[i].reduce((acc,x) => (_ => acc)(acc.unshift(x)), []);
        let rffi = firstFree(revRow);
        //console.log("rffi: "+rffi);
        let rhbi = hintsBeforeRev(i,'Y');
        //console.log("rhbi: "+rhbi);
        let lastBlue = revRow.findIndex((x,i) => i >= rffi && Math.abs(x) === 2);
        //console.log("lb: "+lastBlue);
        if (lastBlue !== -1) {
            if ((lastBlue - rffi) - hintsY[i][rhbi] === 0) clickBox(ydim-rffi-1,i,1);
            if (hintsY[i][rhbi] - (lastBlue - rffi) > 1) {
                for (let j = 1; j < hintsY[i][rhbi] - (lastBlue - rffi); j++) {
                    clickBox(ydim-lastBlue-j-1,i,0);
                }
            }
            //console.log(i);
            //console.log(lastBlue+','+rhbi+','+(ydim-lastBlue-hintsY[i][rhbi]-1));
            if (lastBlue === rffi && rhbi < hintsY[i].length && ydim-lastBlue-hintsY[i][rhbi]-1 >= 0) clickBox(ydim-lastBlue-hintsY[i][rhbi]-1,i,1);
        }
    }
    return;
}

/*
function edges() {
    var puzzle = JSON.parse(localStorage['picross.state']);
    for (let i = 0; i < ydim; i++) {
        let first = firstFree(puzzle[i]);
        if (puzzle[i][first] === 2) {}
    }

}
*/

// Code that gets executed when solver is loaded
console.log(settings);

// If the cheat option is selected, confirm first
if (settings.cheat) {
    var conf = confirm("Are you sure you want to be a CHEATER??");
    if (conf) cheat();
}

// Simply do the counting strategy once if selected
if (settings.sums) countRowsCols();

// Repeatedly do edges until it doesnt make a difference
if (settings.edges) {
    var newState = localStorage['picross.state'];
    var oldState = "";
    while (oldState !== newState) {
        oldState = newState;
        nearEdges();
        newState = localStorage['picross.state'];
    }
}

