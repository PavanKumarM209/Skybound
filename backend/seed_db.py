import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/skybound")

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client['skybound']

# Insert 5 instructors
instructors = [
    {
        "name": "Sensei Rajesh Kumar",
        "rank": "Black Belt 3rd Dan",
        "role": "Head Coach",
        "location": "New Delhi, Delhi",
        "phone": "+91 98765 43210",
        "email": "rajesh@skyboundkarate.in",
        "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"
    },
    {
        "name": "Sensei Priya Sharma",
        "rank": "Black Belt 2nd Dan",
        "role": "Kata Specialist",
        "location": "Budh Vihar, Delhi",
        "phone": "+91 98764 32109",
        "email": "priya@skyboundkarate.in",
        "image_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop"
    },
    {
        "name": "Sensei Arjun Singh",
        "rank": "Black Belt 2nd Dan",
        "role": "Kumite Coach",
        "location": "Rohini, Delhi",
        "phone": "+91 98763 21098",
        "email": "arjun@skyboundkarate.in",
        "image_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop"
    },
    {
        "name": "Sensei Deepika Patel",
        "rank": "Black Belt 1st Dan",
        "role": "Assistant Coach",
        "location": "Pitampura, Delhi",
        "phone": "+91 98762 10987",
        "email": "deepika@skyboundkarate.in",
        "image_url": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=400&auto=format&fit=crop"
    },
    {
        "name": "Sensei Amar Verma",
        "rank": "Black Belt 1st Dan",
        "role": "Training Instructor",
        "location": "Dwarka, Delhi",
        "phone": "+91 98761 09876",
        "email": "amar@skyboundkarate.in",
        "image_url": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=400&auto=format&fit=crop"
    }
]

# Clear existing instructors and insert new ones
try:
    db.instructors.delete_many({})
    result = db.instructors.insert_many(instructors)
    print(f"✅ Successfully inserted {len(result.inserted_ids)} instructors into MongoDB!")
    print(f"Instructor IDs: {result.inserted_ids}")
except Exception as e:
    print(f"❌ Error inserting instructors: {e}")
finally:
    client.close()
