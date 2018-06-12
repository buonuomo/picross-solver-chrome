var puzzleHTML = document.getElementById("puzzle").firstChild.firstChild;
var puzzle = [];
var cols = [];
var rows = [];

function readPuzzle() {
    
    // initialize the array
    for (let i = 1; i < puzzleHTML.childNodes.length; i++) {
        puzzle.push([]);
    }

    // fill the global 2d array with the status of squares
    for (let i of  puzzleHTML.childNodes) {
        for (let j of i.childNodes) {
            let parse = j.className.split(" ");
            if (parse[0] === "cell") {
                let x = Number(j.getAttribute("data-x"));
                let y = Number(j.getAttribute("data-y"));
                if (parse[1] === "s0") puzzle[x][y] = 0;
                if (parse[1] === "s1") puzzle[x][y] = 1;
                if (parse[1] === "s2") puzzle[x][y] = 2;
            } else {
                if (parse[1] === "left") {
                    rowNums = j.innerHTML.split(/[^0-9]+/).filter(x => x != "").map(x => Number(x));
                    console.log(rowNums);
                }
                if (parse[1] === "top") {
                    colNums = j.innerHTML.split(/[^0-9]+/).filter(x => x != "").map(x => Number(x));
                    console.log(colNums);
                }
            }
        }
    }
}


readPuzzle();
