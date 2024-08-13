// Elements
const startDateElement = document.getElementById("startDate")
const endDateElement = document.getElementById("endDate")
const goButtonElement = document.getElementById("goButton")
const errorMessageElement = document.getElementById("error")
const todaysDate = new Date()
let startIsValid = false 
let endIsValid = false 

/**
 * Gets the current date to automatically apply it to the end date 
 */
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

/**
 * Gets the current tab's url 
 * Modeled from Youtube API docs 
 * @param callback runs the rest of the goButtonElement.onclick functon so that 
 * it runs only after a link is recieved. 
 */
function getCurrentTab(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        var activeTabUrl = activeTab.url;
        console.log(activeTabUrl);
        callback(activeTabUrl);
    });
}

/**
 * Takes a url and checks if its a youtube page and gets the videoID 
 * // Taken from https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url 
 * @param url url from the getCurrentTab function 
 * @returns false if not a youtube url, returns the videoID otherwise 
 */
function youtube_parser(url){
    var regExp = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]vi?=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    var match = String(url).match(regExp);
    return (match&&match[1].length==11)? match[1] : false;  //garanteed 11 characters in pos 1 of array 
}


goButtonElement.onclick = function() {

    errorMessageElement.textContent = "";
    errorMessageElement.classList.add('errorClear'); 

    getCurrentTab(function(currentUrl) {  // Callback needed since we have to get the url before

        // Get the videoID wth the URL 
        var videoID = youtube_parser(currentUrl)   
        if (videoID === false) {
            errorMessageElement.textContent ="Invalid link (move to the youtube page then open this extension)"; 
            errorMessageElement.classList.add('error');
            console.log("Invalid link")
            return
        } 

        // If the dates are actual values (not left blank)
        if (startDateElement.value && endDateElement.value) {
            // Check if the start and end date is some time between or equal to the published date and today, and that end date is after or the same day as start
            console.log("Start Date: ", startDateElement.value); // Start Date must be on or after 2005-04-23
            console.log("End Date: ", endDateElement.value);
            
            var startDateArr = startDateElement.value.split('-') 
            var endDateArr = endDateElement.value.split('-')

            // Check if the year is something valid 
            if (parseInt(startDateArr[0]) < 2005 || 
                parseInt(startDateArr[0]) > todaysDate.getFullYear() || 
                parseInt(endDateArr[0]) < 2005 || 
                parseInt(endDateArr[0]) > todaysDate.getFullYear()) {
                    errorMessageElement.textContent = "Invalid year(s) entered"; 
                    errorMessageElement.classList.add('error');
                    console.log("Invalid year")
                    return
            }
            // if the year of end date is more recent than start, give error 
            if (parseInt(endDateArr[0]) < parseInt(startDateArr[0])) {
                    errorMessageElement.textContent = "Invalid end date year entered"; 
                    errorMessageElement.classList.add('error');
                    console.log("Invalid year (end date)")
                    return
            }
            // If start year is current year, dont allow past current date and month 
            if (parseInt(startDateArr[0]) == todaysDate.getFullYear() ) {
                if (parseInt(startDateArr[1]) > (todaysDate.getMonth() + 1)) {
                        errorMessageElement.textContent = "Invalid start date entered"; 
                        errorMessageElement.classList.add('error');
                        console.log("Invalid start date")
                        return
                }       
                if (parseInt(startDateArr[1]) == (todaysDate.getMonth() + 1) && 
                    parseInt(startDateArr[2]) > todaysDate.getDate()) {
                        errorMessageElement.textContent = "Invalid start date entered"; 
                        errorMessageElement.classList.add('error');
                        console.log("Invalid start date")
                        return
                }
            }
            // If end year is current year, dont allow past current date and month 
            if (parseInt(endDateArr[0]) == todaysDate.getFullYear() ) {
                if (parseInt(endDateArr[1]) > (todaysDate.getMonth() + 1)) {
                        errorMessageElement.textContent = "Invalid end month entered"; 
                        errorMessageElement.classList.add('error');
                        console.log("Invalid end mo")
                        return
                }
                if (parseInt(endDateArr[1]) == (todaysDate.getMonth() + 1) && 
                    parseInt(endDateArr[2]) > todaysDate.getDate()) {
                        errorMessageElement.textContent = "Invalid end date entered"; 
                        errorMessageElement.classList.add('error');
                        console.log("Invalid end date")
                        return
                }
            }
            // If the years are the same, do not allow end to come before start  
            if (parseInt(endDateArr[0]) == parseInt(startDateArr[0])) {
                //If end month is before start month 
                if (parseInt(endDateArr[1]) < parseInt(startDateArr[1])) {
                    errorMessageElement.textContent = "Invalid end month entered"; 
                    errorMessageElement.classList.add('error');
                    console.log("Invalid end month")
                    return
                }
                // If monthts are the same, then end date must be after start date 
                if (parseInt(endDateArr[1]) == parseInt(startDateArr[1])) {
                   if (parseInt(endDateArr[2]) < parseInt(startDateArr[2])) {
                        errorMessageElement.textContent = "Invalid end date entered"; 
                        errorMessageElement.classList.add('error');
                        console.log("Invalid end date")
                        return
                   }
                }
            }

            //API Start 
            //TODO: Make this a green loading bar in the error place that ends when txt file is done 
            // Remember to JSON ify the data before sending it 

            // Define the API URL
            const apiUrl = 'http://127.0.0.1:5000/search';

            // Make a GET request
            const data = {
                videoIdentification: videoID,
                startingDate: startDateElement.value,
                endingDate: endDateElement.value
            };
            
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            };
            
            fetch(apiUrl, requestOptions)
                .then(response => {
                    if (!response.ok) {
                    throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(textData => {
                    const blob = new Blob([textData], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
        
                    chrome.downloads.download({
                        url: url,
                        filename: 'data.txt', // Specify the filename with .txt extension
                        conflictAction: 'uniquify' // Handle filename conflicts
                    }, (downloadId) => {
                        if (chrome.runtime.lastError) {
                            console.error('Download error:', chrome.runtime.lastError);
                        } else {
                            console.log('Download initiated with ID:', downloadId);
                        }
                    });
                })
                .catch(error => {
                    console.error('Error:', error);
                });


            return; 

        } else {
            errorMessageElement.textContent = "One or more dates are empty";
            errorMessageElement.classList.add('error');
            console.log("No date entered for one of the two") 
            return
        }
    });
}