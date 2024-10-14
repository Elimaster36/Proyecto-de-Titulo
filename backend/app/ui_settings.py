from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client

SUPABASE_URL = "https://vyzyrqihzoexrphxjvjj.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5enlycWloem9leHJwaHhqdmpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc0NjU5NTcsImV4cCI6MjA0MzA0MTk1N30.aNwDU5L-7orBrEKf1jobBxdTB8sgQd599VdHQdjV9iU"
supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI()

class Preferences(BaseModel):
    fontSize: int
    buttonSize: int

# Obtener preferencias de usuario
@app.get("/api/preferences/{firebase_uid}")
async def get_preferences(firebase_uid: str):
    response = supabase_client.from_("preferences").select("*").eq("firebase_uid", firebase_uid).execute()
    
    if response.data:
        return response.data[0]  # Retornar las preferencias del usuario
    else:
        raise HTTPException(status_code=404, detail="Preferencias no encontradas")

# Guardar o actualizar preferencias de usuario
@app.post("/api/preferences/{firebase_uid}")
async def save_preferences(firebase_uid: str, preferences: Preferences):
    # Primero intenta obtener las preferencias actuales
    existing_prefs = supabase_client.from_("preferences").select("*").eq("firebase_uid", firebase_uid).execute()
    
    if existing_prefs.data:
        # Si existen, actualiza
        supabase_client.from_("preferences").update({
            "fontSize": preferences.fontSize,
            "buttonSize": preferences.buttonSize
        }).eq("firebase_uid", firebase_uid).execute()
    else:
        # Si no existen, inserta nuevas
        supabase_client.from_("preferences").insert({
            "firebase_uid": firebase_uid,
            "fontSize": preferences.fontSize,
            "buttonSize": preferences.buttonSize
        }).execute()

    return {"message": "Preferencias guardadas exitosamente"}

