# CommentSortingChromeExt
 
## Reasons for dropping
Due to limitations with both the youtube API and online server hosting, I decided not to upload the app to a server (I don't want to go over the limit, which is very easy to do on popular videos) 
Essentailly, the youtube api requires you to search through every commment till you reach the desired date, 100 comments at a time. If I had resources, it wouldn't be too bad, but for a free 
implementation that I wanted, you are only able to do 1 million comments a day, which any malicious user could fill up in a handful of requests. In addition, I ran into an issue where
constantly using the api led to a block from Google's side, meaing that I had to wait 20-30 minutes to use the youtube api again. All in all, a lesson learned to better reasearch the 
project before committing to it.
I am also dropping this project since I feel like I am unable to learn more about databse interaction with it. from the start, I had no interest in storing the results of the api calls,
moreso now that I know of the large amounts of data assocaited with it. Im just a poor guy with a laptop. 


## Directions

How to Use:
This is why the app must run locally and you will need your own api key from google (free) 
1. Get API key by navigating to https://developers.google.com/youtube/v3/getting-started and follow the instructions
2. Download the repo, and drag and drop the extension into Chrome browser 
   See this: https://www.youtube.com/watch?v=oswjtLwCUqg
3. Run the app.py file locally by first going into the folder containing requirements.txt
   Then, do pip install -r requirements.txt 
   Create a folder called creds.py and add: API_KEY = 'KEY_HERE'
   After that, do flask run app 
4. On chrome, first naviagate to the youtube video you want to pull comments from
   Then, enter the date range, and hit submit

Again, I dont feel comfortable opening up an api key that is very limited to the public so I did not host it, and my dockerfile ends up similarly useless since 
a user will need to add their own creds.py file now 


