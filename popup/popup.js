// Elements
const startDateElement = document.getElementById("startDate")
const endDateElement = document.getElementById("endDate")
const goButtonElement = document.getElementById("goButton")
let startIsValid = false 
let endIsValid = false 

function getDateFromHtml() {
    console.log(document.body);
}
  
if (document.readyState !== "loading") {
    getDateFromHtml();
} else {
    // Loading hasn't finished yet
    document.addEventListener("DOMContentLoaded", getDateFromHtml);
}

// Modeled from Youtube API docs 
function getCurrentTab(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        var activeTabUrl = activeTab.url;
        console.log(activeTabUrl);
        callback(activeTabUrl);
    });
}

// Taken from https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url 
function youtube_parser(url){
    var regExp = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]vi?=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    var match = String(url).match(regExp);
    return (match&&match[1].length==11)? match[1] : false;  //garanteed 11 characters in pos 1 of array 
}

goButtonElement.onclick = function() {
    
    getCurrentTab(function(currentUrl) {  // Callback needed since we have to get the url before

        // Get the videoID wth the URL 
        var videoID = youtube_parser(currentUrl)   
        if (videoID === false) {
            console.log("Invalid link (move to the youtube page then open this extension)")
            return //TODO: Test this 
        } 

        // If the dates are actual values (not left blank)
        if (startDateElement.value && endDateElement.value) {
            // Check if the start and end date is some time between or equal to the published date and today, and that end date is after or the same day as start
            console.log("Start Date: ", startDateElement.value);
            console.log("End Date: ", endDateElement.value);
            console.log("Fetching data and outputting it");
        } else {
            console.log("One or more dates are not valid");
        }
    });
}