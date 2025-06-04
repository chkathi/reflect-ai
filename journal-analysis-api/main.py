from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from datetime import datetime

app = FastAPI(title="Journal Analysis API")

# Simplified model with only the fields we need
class JournalEntry(BaseModel):
    summary: str
    text: str
    createdAt: str
    user_id: str

class AppwriteResponse(BaseModel):
    documents: List[JournalEntry]

# Storage for synced journal entries
journal_entries = []

@app.post("/sync", response_model=dict)
async def sync_journal_data(appwrite_data: AppwriteResponse):
    """
    Receive journal entries from Appwrite and store them.
    Only processes the essential fields: summary, text, createdAt, and user_id
    """
    global journal_entries
    journal_entries = [entry.dict() for entry in appwrite_data.documents]
    
    return {
        "message": f"Successfully synced {len(journal_entries)} journal entries",
        "entry_count": len(journal_entries)
    }

@app.get("/sync/status")
async def get_sync_status():
    """
    Get the current sync status and basic statistics about stored entries
    """
    return {
        "total_entries": len(journal_entries),
        "last_sync": datetime.now().isoformat(),
        "storage_status": "in_memory"
    } 