from motor.motor_asyncio import AsyncIOMotorClient

uri = "mongodb+srv://Ankii:Ankit2003@cluster0.q0vucr9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = AsyncIOMotorClient(uri)

db = client["quickmessages"]
messages = db["messages"]