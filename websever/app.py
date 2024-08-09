from flask import Flask, request
from creds import API_KEY
import os 
import googleapiclient.discovery

# TODO: ADD LOTS OF ERROR CHECKING 

# Function that takes the video ID And returns all info 
def youtubeCaller(**data):
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
        videoId=videoID
    )
    response = request.execute()

    return response

# Application Factory. As far as ive seen, the biggest reason to do this is to 
# test the app better. 
def create_app(): 

    app = Flask(__name__) 

    # NOTE: Remove before deployment 
    app.config["DEBUG"] = True

    print("weourhere")

    # Can also do @app.route('/stores', methods=['GET'])
    @app.post("/search")
    def get_store():
        recieved_data = request.get_json()

        print(recieved_data)

        commentsList = youtubeCaller(**recieved_data)

        print("here")
        
        return {"message": commentsList}, 200
    
    return app

# Send request to youtube API 
# output data to txt file 