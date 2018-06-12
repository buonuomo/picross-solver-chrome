/* Listener for click on the icon */

// Registers the extension to only show up on the picross page
chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {urlContains: "http://liouh.com/picross"},
            })
            ],
                actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

// Listens for click on the icon
chrome.pageAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(null, {file: "picross.js"})
});
