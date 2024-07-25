// Elements
const startDateElement = document.getElementById("startDate")
const endDateElement = document.getElementById("endDate")
const goButtonElement = document.getElementById("goButton")
const todaysDate = new Date()
let startIsValid = false 
let endIsValid = false 

window.addEventListener("load", (event) => {
    var month = todaysDate.getMonth() + 1; 
    var day = todaysDate.getDate(); 
    var year = todaysDate.getFullYear(); 
    if (month < 10) {
        month = "0" + month; 
    }
    if (day < 10) {
        day = "0" + day;
    }

    const currDateOnPopup = document.querySelector('#endDate'); 
    currDateOnPopup.value = year + "-" + month + "-" + day; 
});

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
            return
        } 

        // If the dates are actual values (not left blank)
        if (startDateElement.value && endDateElement.value) {
            // Check if the start and end date is some time between or equal to the published date and today, and that end date is after or the same day as start
            console.log("Start Date: ", startDateElement.value); // Start Date:  2024-07-01
            console.log("End Date: ", endDateElement.value);
            
            var startDateArr = startDateElement.value.split('-') 
            var endDateArr = endDateElement.value.split('-')
            if (parseInt(startDateArr[0]) < 2005 || 
                parseInt(startDateArr[0]) > todaysDate.getFullYear() || 
                parseInt(endDateArr[0]) < 2005 || 
                parseInt(endDateArr[0]) > todaysDate.getFullYear() ||
                parseInt(startDateArr[1]) < 4 || 
                parseInt(startDateArr[1]) > (todaysDate.getMonth() + 1) || 
                parseInt(endDateArr[1]) < 4 || 
                parseInt(endDateArr[1]) > (todaysDate.getMonth() + 1) ||
                parseInt(startDateArr[2]) < 23 || 
                parseInt(startDateArr[2]) > todaysDate.getDate() || 
                parseInt(endDateArr[2]) < 23 || 
                parseInt(endDateArr[2]) > todaysDate.getDate()) { 
                    console.log("Invalid year") // TODO: Return error to user through html 
            }
            else {
                // Call API  
                return
            }


        } else {
            console.log("One or more dates are not valid");
        }
    });
}