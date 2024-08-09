from flask import Flask, request
from creds import API_KEY
import os 
import googleapiclient.discovery

# TODO: ADD LOTS OF ERROR CHECKING 

# Function that takes the video ID And returns all info 
def youtubeCaller(nextPageToken, **data):
    nextPageToken = nextPageToken
    videoID = data["videoIdentification"]
    start = data["startingDate"]
    end = data["endingDate"]

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


def create_response_dict(commentsList): 

    

    return 


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

        # commentsToReturn = create_response_dict(commentsList)
 
        # while True:
        #     if commentsList["nextPageToken"]: #if it exists
        #         commentsList = youtubeCaller(nextPageToken=commentsList["nextPageToken"], **recieved_data) # send the next page token 
        #     else:
        #         break
        
        return {"message": comments}, 200
    
    return app