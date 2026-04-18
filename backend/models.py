from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class MessageCreate(BaseModel):
    """Model for creating a new message"""
    text: str = Field(..., min_length=1, max_length=500)


class MessageResponse(BaseModel):
    """Model for message response"""
    id: str
    text: str
    createdAt: str
