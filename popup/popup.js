// Elements
const startDateElement = document.getElementById("startDate")
const endDateElement = document.getElementById("endDate")
const goButtonElement = document.getElementById("goButton")
let startIsValid = false 
let endIsValid = false 

async function getCurrentTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // since only one tab should be active and in the current window at once
        // the return variable should only have one entry
        var activeTab = tabs[0];
        var activeTabId = activeTab.url
        console.log(activeTabId)
    });
}

goButtonElement.onclick = function() {

    getCurrentTab(); 

    if (startDateElement.value && endDateElement.value) {
        console.log("Start Date: ", startDateElement.value)
        console.log("End Date: ", endDateElement.value)
        console.log("Fetching data and outputting it")
    }
    else {
        console.log("One or more dates are not valid")
    }    
}
