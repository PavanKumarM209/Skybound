import os
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("skybound")

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/skybound")
JWT_SECRET = os.getenv("JWT_SECRET", "skybound-super-secret-key-change-in-production")
JWT_EXPIRY_HOURS = 24

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER", "")

JSON_DB_PATH = os.path.join(os.path.dirname(__file__), "db.json")

DEFAULT_DB = {
    "dojo_info": {
        "name": "Sky Bound Martial Arts Academy",
        "phone": "+91 85100 00838",
        "email": "contact@skyboundkarate.in",
        "address": "X-1/32, Daal Mill Road, Budh Vihar, Phase-1, New Delhi-110086, India",
        "map_embed": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3498.4239857905183!2d77.098485!3d28.736785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d068593a201c1%3A0xe54fb7a28e932ec3!2sBudh%20Vihar%20Phase%20I%2C%20Budh%20Vihar%2C%20Delhi%2C%20110086!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
        "affiliations": [
            {"name": "Shotokon Karate-Do Sports Federation"},
            {"name": "Martial Arts Games Federation of India (MGFI)"},
            {"name": "Karate India Organisation (KIO)"},
            {"name": "Delhi Olympic Association"}
        ]
    },
    "trustees": [
        {
            "_id": "tr_1",
            "name": "Renshi Umapathi S S",
            "role": "Founder, President & Chief Coach",
            "image_url": "/umapathi_ss.png"
        },
        {
            "_id": "tr_2",
            "name": "Nethravathi M B",
            "role": "Founder / Treasurer",
            "image_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop"
        },
        {
            "_id": "tr_3",
            "name": "Somashekhar S S",
            "role": "Trustee",
            "image_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop"
        }
    ],
    "instructors": [
        {
            "_id": "inst_1",
            "name": "Sensei Rajesh Kumar",
            "rank": "Black Belt 3rd Dan",
            "role": "Head Coach",
            "location": "New Delhi, Delhi",
            "phone": "+91 98765 43210",
            "email": "rajesh@skyboundkarate.in",
            "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"
        },
        {
            "_id": "inst_2",
            "name": "Sensei Priya Sharma",
            "rank": "Black Belt 2nd Dan",
            "role": "Kata Specialist",
            "location": "Budh Vihar, Delhi",
            "phone": "+91 98764 32109",
            "email": "priya@skyboundkarate.in",
            "image_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop"
        },
        {
            "_id": "inst_3",
            "name": "Sensei Arjun Singh",
            "rank": "Black Belt 2nd Dan",
            "role": "Kumite Coach",
            "location": "Rohini, Delhi",
            "phone": "+91 98763 21098",
            "email": "arjun@skyboundkarate.in",
            "image_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop"
        },
        {
            "_id": "inst_4",
            "name": "Sensei Deepika Patel",
            "rank": "Black Belt 1st Dan",
            "role": "Assistant Coach",
            "location": "Pitampura, Delhi",
            "phone": "+91 98762 10987",
            "email": "deepika@skyboundkarate.in",
            "image_url": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=400&auto=format&fit=crop"
        },
        {
            "_id": "inst_5",
            "name": "Sensei Amar Verma",
            "rank": "Black Belt 1st Dan",
            "role": "Training Instructor",
            "location": "Dwarka, Delhi",
            "phone": "+91 98761 09876",
            "email": "amar@skyboundkarate.in",
            "image_url": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=400&auto=format&fit=crop"
        }
    ],
    "news": [
        {
            "_id": "news_1",
            "title": "6th Royal Challenges Cup 2022",
            "organizer": "TRADI",
            "date": "2022-10-15",
            "description": "Annual championship attracting teams from multiple states. Focus on Kumite and Kata categories.",
            "image_url": "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&auto=format&fit=crop"
        },
        {
            "_id": "news_2",
            "title": "KSKAI ALL INDIA KARATE CHAMPIONSHIP 2022",
            "organizer": "KSKAI",
            "date": "2022-12-05",
            "description": "Elite tournament for brown and black belts to qualify for national selections.",
            "image_url": "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=600&auto=format&fit=crop"
        }
    ],
    "bookings": [
        {
            "_id": "book_1",
            "student_name": "Aarav Sharma",
            "student_age": 8,
            "phone": "+91 99999 88888",
            "program": "Regular Training",
            "date": "2026-06-10",
            "status": "Pending"
        },
        {
            "_id": "book_2",
            "student_name": "Pooja Patel",
            "student_age": 12,
            "phone": "+91 98888 77777",
            "program": "Belt Grading",
            "date": "2026-06-12",
            "status": "Confirmed"
        }
    ],
    "supporting_instructors": [
        {
            "_id": "supp_1",
            "name": "Sempai Pallavi",
            "rank": "Black Belt 1st Dan",
            "role": "Supporting Instructor",
            "location": "Bangalore, Karnataka",
            "phone": "+91 99999 11111",
            "email": "pallavi@example.com",
            "image_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop"
        },
        {
            "_id": "supp_2",
            "name": "Sempai Yashaswini M",
            "rank": "Black Belt 1st Dan",
            "role": "Supporting Instructor",
            "location": "Bangalore, Karnataka",
            "phone": "+91 99999 22222",
            "email": "yashaswini@example.com",
            "image_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop"
        },
        {
            "_id": "supp_3",
            "name": "Sempai Shravya S Hegde",
            "rank": "Black Belt 1st Dan",
            "role": "Supporting Instructor",
            "location": "Bangalore, Karnataka",
            "phone": "+91 99999 33333",
            "email": "shravya@example.com",
            "image_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop"
        },
        {
            "_id": "supp_4",
            "name": "Sempai Trisha",
            "rank": "Black Belt 1st Dan",
            "role": "Supporting Instructor",
            "location": "Bangalore, Karnataka",
            "phone": "+91 99999 44444",
            "email": "trisha@example.com",
            "image_url": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=300&auto=format&fit=crop"
        },
        {
            "_id": "supp_5",
            "name": "Sempai Phanindra Achari V",
            "rank": "Black Belt 1st Dan",
            "role": "Supporting Instructor",
            "location": "Bangalore, Karnataka",
            "phone": "+91 99999 55555",
            "email": "phanindra@example.com",
            "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop"
        }
    ]
}
