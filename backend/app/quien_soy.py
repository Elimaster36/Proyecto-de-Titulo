import logging
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.models import QuienSoy, User
import imghdr
import base64

router = APIRouter()

# Configura el logger
logging.basicConfig(level=logging.INFO)

class QuienSoyCreate(BaseModel):
    user_firebase_id: str
    full_name: str
    age: int
    address: str

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

        photo_data = None
        if file:
            photo_data = await file.read()
            mime_type = imghdr.what(None, photo_data)
            if mime_type:
                base64_photo = base64.b64encode(photo_data).decode('utf-8')
                photo_data = f"data:image/{mime_type};base64,{base64_photo}"

        new_quien_soy = QuienSoy(
            user_firebase_id=user_firebase_id,
            full_name=full_name,
            age=age,
            address=address,
            photo=photo_data
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
        "photo": quien_soy.photo if quien_soy.photo else None  # Dejar la foto tal como está, ya que debería incluir el tipo MIME y la codificación base64
    }
    return quien_soy_data



