import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

uri = "mongodb+srv://Ankii:Ankit2003@cluster0.q0vucr9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

async def test():
    client = AsyncIOMotorClient(uri)
    print("Connected")

asyncio.run(test())