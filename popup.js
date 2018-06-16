//var page = chrome.extension.getBackgroundPage();
//console.log(page.hoho);

// Add listener to submit button so it executes solver when clicked
document.getElementById("go").addEventListener("click",callSolver);

// Calls solver.js with the correct options set beforehand
function callSolver() {
    let settings = {
        sums: document.getElementById("row-sum").checked,
        edges: document.getElementById("edges").checked,
        cheat: document.getElementById("cheat").checked
    };
    chrome.tabs.executeScript({code: "var settings = " + JSON.stringify(settings)}, function() {
        chrome.tabs.executeScript({file: "solver.js"});
    });
}

