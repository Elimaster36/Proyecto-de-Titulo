from fastapi import APIRouter, Depends, HTTPException
import firebase_admin
from sqlalchemy.orm import Session
from app.dependencies import get_db  # Función para obtener la sesión de la base de datos
from app.models import User, Quien_Soy  # Modelo que acabamos de crear
from pydantic import BaseModel
from passlib.context import CryptContext
from firebase_admin import credentials

router = APIRouter()


class UserInfoCreate(BaseModel):
    age: int
    address: str

@router.post("/user-info")
def create_user_info(user_info: UserInfoCreate, db: Session = Depends(get_db)):
    user_info_db = Quien_Soy(age=user_info.age, address=user_info.address)
    db.add(user_info_db)
    db.commit()
    db.refresh(user_info_db)
    return {"message": "Información guardada correctamente", "user_info": user_info_db}

class UserInfoResponse(BaseModel):
    age: int
    address: str

@router.get("/user-info/{user_id}")
def get_user_info(user_id: int, db: Session = Depends(get_db)):
    # Realizamos una consulta para obtener tanto el nombre como la información de la tabla 'user_info'
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Verificamos si el usuario tiene información adicional (edad y dirección)
    user_info = user.user_info  # Esto es posible gracias a la relación 'user_info' en el modelo User

    return {
        "name": user.name,
        "age": user_info.age if user_info else None,
        "address": user_info.address if user_info else None
    }