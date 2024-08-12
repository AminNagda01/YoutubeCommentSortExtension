from flask import Flask, request
from creds import API_KEY
import os 
import googleapiclient.discovery

# TODO: ADD LOTS OF ERROR CHECKING 

# Function that takes the video ID And returns all info 
def youtubeCaller(nextPageToken, **data):
    nextPageToken = nextPageToken
    videoID = data["videoIdentification"]

    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

    api_service_name = "youtube"
    api_version = "v3"
    DEVELOPER_KEY = API_KEY
    
    youtube = googleapiclient.discovery.build(
        api_service_name, api_version, developerKey = DEVELOPER_KEY)
    

    request = youtube.commentThreads().list(
        part="snippet,replies",
        maxResults=100,
        videoId=videoID,  
        pageToken=nextPageToken
    )
    
    response = request.execute()

    return response


def create_output(commentsList, comments: list):

    for indexOfComment in commentsList["items"]:
                dictionaryOfCommnets = {
                    "Comment": indexOfComment["snippet"]["topLevelComment"]["snippet"]["textDisplay"], 
                    "Posted": indexOfComment["snippet"]["topLevelComment"]["snippet"]['publishedAt'],
                    "Author": indexOfComment["snippet"]["topLevelComment"]["snippet"]["authorDisplayName"],
                }

                if indexOfComment["snippet"]["totalReplyCount"] > 0: 
                    for indexOfReply in indexOfComment["replies"]["comments"]: 
                        dictionaryOfCommnets["Replies"] = {
                            "Comment": indexOfReply["snippet"]["textDisplay"],
                            "Posted": indexOfReply["snippet"]["publishedAt"],
                            "Author": indexOfReply["snippet"]["authorDisplayName"]
                        }
                    
                comments.append(dictionaryOfCommnets)
    
    return comments

# Application Factory. As far as ive seen, the biggest reason to do this is to 
# test the app better. 
def create_app(): 

    app = Flask(__name__) 

    # NOTE: Remove before deployment 
    app.config["DEBUG"] = True

    # Can also do @app.route('/stores', methods=['GET'])
    @app.post("/search")
    def get_store():
        recieved_data = request.get_json()
        commentsList = youtubeCaller(nextPageToken="", **recieved_data) # First send blank

        comments = []

        start = recieved_data["startingDate"]
        startYear = int(start[:4])
        startMonth = int(start[5:7])
        startDay = int(start[8:10])

        end = recieved_data["endingDate"]
        endYear = int(end[:4])
        endMonth = int(end[5:7])
        endDay = int(end[8:10])

        create_output(commentsList, comments) # inital call (add error check for no comments)  

        # Start Date:  2024-01-12
        # End Date:  2024-04-12

        while True:
            if "nextPageToken" not in commentsList:
                break
            else:
                lastDateInResponse = str(commentsList["items"][99]["snippet"]["topLevelComment"]["snippet"]['publishedAt']) # Ex: 2024-07-13T08:05:25Z
                lastDateYear = int(lastDateInResponse[:4])
                lastDateMonth = int(lastDateInResponse[5:7])
                lastDateDay = int(lastDateInResponse[8:10])

                if endYear < lastDateYear: #TODO: This assumes dates are error corrected before here. do that first 
                    comments.clear()
                    commentsList = youtubeCaller(nextPageToken=commentsList["nextPageToken"], **recieved_data)
                
                # There could be years between comments. so we need to check if the years are the same when checking months and dates
                elif startYear == lastDateYear and startYear == endYear:
                    if endYear == lastDateYear and endMonth < lastDateMonth:
                        comments.clear()
                        commentsList = youtubeCaller(nextPageToken=commentsList["nextPageToken"], **recieved_data)
                    elif endYear == lastDateYear and endMonth == lastDateMonth and endDay < lastDateDay:
                        comments.clear()
                        commentsList = youtubeCaller(nextPageToken=commentsList["nextPageToken"], **recieved_data)
                    else:
                        if startYear == lastDateYear and startMonth < lastDateMonth:
                            create_output(commentsList, comments)
                            commentsList = youtubeCaller(nextPageToken=commentsList["nextPageToken"], **recieved_data)      
                        elif startYear == lastDateYear and startMonth == lastDateMonth and startDay <= lastDateDay:
                            create_output(commentsList, comments)
                            commentsList = youtubeCaller(nextPageToken=commentsList["nextPageToken"], **recieved_data)
                        else: 
                            break
                        

                # assuming years are different
                else:
                    # Get to the end date (to start adding to comments)
                    if endYear == lastDateYear and endMonth < lastDateMonth:
                        comments.clear()
                        commentsList = youtubeCaller(nextPageToken=commentsList["nextPageToken"], **recieved_data)
                    elif endYear == lastDateYear and endMonth == lastDateMonth and endDay < lastDateDay:
                        comments.clear()
                        commentsList = youtubeCaller(nextPageToken=commentsList["nextPageToken"], **recieved_data)
                    # Get to the start date 
                    else:
                        if startYear < lastDateYear:
                            create_output(commentsList, comments)
                            commentsList = youtubeCaller(nextPageToken=commentsList["nextPageToken"], **recieved_data)
                        elif startYear == lastDateYear and startMonth < lastDateMonth:
                            create_output(commentsList, comments)
                            commentsList = youtubeCaller(nextPageToken=commentsList["nextPageToken"], **recieved_data)
                        elif startYear == lastDateYear and startMonth == lastDateMonth and startDay <= lastDateDay:
                            create_output(commentsList, comments)
                            commentsList = youtubeCaller(nextPageToken=commentsList["nextPageToken"], **recieved_data)
                        else: 
                            break
        
        create_output(commentsList, comments)
        
        return {"message": comments}, 200
    
    return app

# TODO: 
# While loop to get more than 100 comments > DONE 
# Either return the text or html file itself, or make changes in popup.js to do so 
# Error handling (add response and abort and marshmellow schemas) 
# Documentation (swagger OpenAPI and your own documentation)
# Clean up the code into proper sections if possible > TODO BADLY MY EYES 
# Test speed on large video. If long, optimize 
# Create readme to document usage instructions
    # Note limits of implementation
    # Note what you learned: 
        # I learned that I should read the API i plan to use before making a project, the fact that i only had 1,000,000 blindsighted me really hard 
        # Another thing along with that, define a scope before starting. trying to build up as you go is a pain 
        # Keep it simple when needed. no need to add blueprints here cause its only one request 
# Add testing?? 


# Notes: 
    # to check if tag is in json object, do if "nextPageToken" not in commentsList:, not if commentsList["nextPageToken"] not in commentsList: (kinda obvious now lol)