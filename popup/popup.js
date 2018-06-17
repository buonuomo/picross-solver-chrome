//var page = chrome.extension.getBackgroundPage();
//console.log(page.hoho);

// Add listener to submit button so it executes solver when clicked
document.getElementById("go").addEventListener("click",callSolver);

// Calls solver.js with the correct options set beforehand
function callSolver() {
    // Make the button permanently blue after clicked
    document.getElementById("go").parentElement.classList.add("clicked");
    // Retrieve settings from option checkboxes
    let settings = {
        sums: document.getElementById("row-sum").checked,
        edges: document.getElementById("edges").checked,
        cheat: document.getElementById("cheat").checked
    };
    // Call the solver script with the settings, then close the popup
    chrome.tabs.executeScript({code: "var settings = " + JSON.stringify(settings)}, function() {
        chrome.tabs.executeScript({file: "solver.js"}, function() {
            window.close()
        });
    });
}

