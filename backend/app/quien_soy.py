import os
import logging
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.models import QuienSoy, User
from supabase import create_client, Client

# Configura las credenciales de Supabase
SUPABASE_URL = "https://vyzyrqihzoexrphxjvjj.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5enlycWloem9leHJwaHhqdmpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc0NjU5NTcsImV4cCI6MjA0MzA0MTk1N30.aNwDU5L-7orBrEKf1jobBxdTB8sgQd599VdHQdjV9iU"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

router = APIRouter()
logging.basicConfig(level=logging.INFO)

class QuienSoyCreate(BaseModel):
    user_firebase_id: str
    full_name: str
    age: int
    address: str

def upload_to_supabase(bucket_name, file_name, file_content):
    # Sube el archivo
    response = supabase.storage.from_(bucket_name).upload(file_name, file_content)
    
    # Verifica si hubo un error en la respuesta
    if isinstance(response, dict) and 'error' in response:
        raise Exception(f"Error uploading file: {response['error']}")

    # Construye la URL del archivo subido
    return f"{SUPABASE_URL}/storage/v1/object/public/{bucket_name}/{file_name}"

@router.post("/quien_soy", response_model=QuienSoyCreate)
async def create_quien_soy(
    user_firebase_id: str = Form(...),
    full_name: str = Form(...),
    age: int = Form(...),
    address: str = Form(...),
    file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    try:
        logging.info(f"Received data: user_firebase_id={user_firebase_id}, full_name={full_name}, age={age}, address={address}")
        logging.info(f"File received: {file.filename if file else 'No file'}")

        user = db.query(User).filter(User.firebase_id == user_firebase_id).first()
        if not user:
            logging.error(f"User with Firebase ID {user_firebase_id} not found")
            raise HTTPException(status_code=404, detail="User not found")

        photo_url = None
        if file:
            file_content = await file.read()
            photo_url = upload_to_supabase('user-images', file.filename, file_content)

        new_quien_soy = QuienSoy(
            user_firebase_id=user_firebase_id,
            full_name=full_name,
            age=age,
            address=address,
            photo=photo_url
        )

        db.add(new_quien_soy)
        db.commit()
        db.refresh(new_quien_soy)
        logging.info(f"User info for Firebase ID {user_firebase_id} saved successfully")
        return new_quien_soy

    except HTTPException as e:
        logging.error(f"HTTPException: {str(e)}")
        raise e
    except Exception as e:
        logging.error(f"Unexpected Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {str(e)}")

@router.get("/quien_soy/{firebase_id}")
async def get_quien_soy(firebase_id: str, db: Session = Depends(get_db)):
    quien_soy = db.query(QuienSoy).filter(QuienSoy.user_firebase_id == firebase_id).first()
    if not quien_soy:
        raise HTTPException(status_code=404, detail="User info not found")

    quien_soy_data = {
        "id": quien_soy.id,
        "full_name": quien_soy.full_name,
        "age": quien_soy.age,
        "address": quien_soy.address,
        "photo": quien_soy.photo if quien_soy.photo else None
    }
    return quien_soy_data

def upload_to_supabase(bucket_name, file_name, file_content):
    # Sube el nuevo archivo
    response = supabase.storage.from_(bucket_name).upload(file_name, file_content)
    
    # Verifica si hubo un error en la respuesta
    if isinstance(response, dict) and 'error' in response:
        raise Exception(f"Error uploading file: {response['error']}")

    # Construye la URL del archivo subido
    return f"{SUPABASE_URL}/storage/v1/object/public/{bucket_name}/{file_name}"

@router.put("/quien_soy/{user_firebase_id}", response_model=QuienSoyCreate)
async def update_quien_soy(
    user_firebase_id: str,
    full_name: str = Form(None),
    age: int = Form(None),
    address: str = Form(None),
    file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    try:
        logging.info(f"Received data for update: user_firebase_id={user_firebase_id}, full_name={full_name}, age={age}, address={address}")
        user_info = db.query(QuienSoy).filter(QuienSoy.user_firebase_id == user_firebase_id).first()
        if not user_info:
            logging.error(f"User with Firebase ID {user_firebase_id} not found")
            raise HTTPException(status_code=404, detail="User not found")
        
        if full_name:
            user_info.full_name = full_name
        if age:
            user_info.age = age
        if address:
            user_info.address = address
        
        # Mantener la URL de la foto existente si no hay una nueva
        photo_url = user_info.photo
        
        if file:
            # Elimina la imagen existente si hay una nueva imagen y una imagen existente
            if photo_url:
                file_name = photo_url.split('/')[-1]
                response_delete = supabase.storage.from_('user-images').remove([file_name])
                if isinstance(response_delete, list) and len(response_delete) > 0 and response_delete[0].get('error'):
                    logging.error(f"Error deleting file: {response_delete[0]['error']}")
                    raise Exception(f"Error deleting file: {response_delete[0]['error']}")
            # Subir la nueva imagen
            file_content = await file.read()
            response_upload = supabase.storage.from_('user-images').upload(file.filename, file_content)
            if hasattr(response_upload, 'error') and response_upload.error:
                logging.error(f"Error uploading file: {response_upload.error}")
                raise Exception(f"Error uploading file: {response_upload.error}")
            photo_url = f"{SUPABASE_URL}/storage/v1/object/public/user-images/{file.filename}"
        
        user_info.photo = photo_url
        
        db.commit()
        db.refresh(user_info)
        logging.info(f"User info for Firebase ID {user_firebase_id} updated successfully")
        return user_info

    except HTTPException as e:
        logging.error(f"HTTPException: {str(e)}")
        raise e
    except Exception as e:
        logging.error(f"Unexpected Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {str(e)}")








