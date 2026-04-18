from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from datetime import datetime
from zoneinfo import ZoneInfo

# Import database connection
from database import client, db

app = FastAPI(title="Quick Messages API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB collection
collection = db.messages

# Function to get UTC instant time
def get_utc_time():
    return datetime.utcnow()

@app.get("/messages", response_model=List[dict])
async def get_messages():
    """
    Fetch all messages from MongoDB
    """
    messages = []

    cursor = collection.find().sort("createdAt", -1)

    async for document in cursor:
        created_at = document.get("createdAt")

        if isinstance(created_at, datetime):
            created_at = created_at.isoformat()

        messages.append({
            "id": str(document["_id"]),
            "text": document["text"],
            "createdAt": created_at
        })

    return messages


@app.post("/messages", response_model=dict)
async def create_message(message: dict):
    """
    Create new message
    """
    try:
        text = message.get("text", "").strip()

        if not text:
            raise HTTPException(status_code=400, detail="Message text cannot be empty")

        # Create message with UTC instant time
        message_doc = {
            "text": text,
        "createdAt": get_utc_time()
        }

        result = await collection.insert_one(message_doc)

        return {
            "id": str(result.inserted_id),
            "text": text,
            "createdAt": message_doc["createdAt"].isoformat()
        }

    except HTTPException:
        raise


@app.get("/")
async def health_check():
    return {
        "status": "ok",
        "message": "Quick Messages API is running",
        "server_time": get_utc_time().isoformat()
    }