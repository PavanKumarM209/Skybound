from pymongo import MongoClient
from config import MONGO_URI, DEFAULT_DB, logger

db_connected = False
client = None
db = None

# MongoDB connection attempt
try:
    client = MongoClient(
        MONGO_URI, 
        serverSelectionTimeoutMS=5000,
        tlsAllowInvalidCertificates=True
    )
    # Ping database to confirm connectivity
    client.server_info()
    # Explicitly set the database
    db = client["skybound"]
    db_connected = True
    logger.info("Successfully connected to MongoDB Atlas.")
except Exception as e:
    logger.critical(f"FATAL: MongoDB not available. Enforcing MongoDB only mode: {e}")
    db_connected = False
    client = None
    db = None

# Initialize MongoDB if connected
def init_mongodb():
    if not db_connected or db is None:
        return
        
    try:
        # Seeding dojo_info
        if db["dojo_info"].count_documents({}) == 0:
            db["dojo_info"].insert_one(DEFAULT_DB["dojo_info"].copy())
            logger.info("Seeded MongoDB dojo_info.")
            
        # Seeding instructors
        if db["instructors"].count_documents({}) == 0:
            db["instructors"].insert_many([item.copy() for item in DEFAULT_DB["instructors"]])
            logger.info("Seeded MongoDB instructors.")
            
        # Seeding trustees
        if db["trustees"].count_documents({}) == 0:
            db["trustees"].insert_many([item.copy() for item in DEFAULT_DB["trustees"]])
            logger.info("Seeded MongoDB trustees.")
            
        # Seeding news
        if db["news"].count_documents({}) == 0:
            db["news"].insert_many([item.copy() for item in DEFAULT_DB["news"]])
            logger.info("Seeded MongoDB news.")
            
        # Seeding bookings
        if db["bookings"].count_documents({}) == 0:
            db["bookings"].insert_many([item.copy() for item in DEFAULT_DB["bookings"]])
            logger.info("Seeded MongoDB bookings.")
            
        # Seeding supporting_instructors
        if db["supporting_instructors"].count_documents({}) == 0:
            db["supporting_instructors"].insert_many([item.copy() for item in DEFAULT_DB["supporting_instructors"]])
            logger.info("Seeded MongoDB supporting_instructors.")

        # Ensure Users collection exists and has unique index on username
        if "users" not in db.list_collection_names():
            db.create_collection("users")
            db["users"].create_index("username", unique=True)
            logger.info("Created users collection with unique index on username.")
            
    except Exception as ex:
        logger.error(f"Error seeding MongoDB: {ex}")

# Trigger initialization
if db_connected:
    init_mongodb()
else:
    logger.error("Skipping MongoDB initialization due to connection failure.")
