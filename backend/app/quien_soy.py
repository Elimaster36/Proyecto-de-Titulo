from datetime import datetime as dt
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.models import QuienSoy
from app.dependencies import get_db
from firebase_admin import auth

router = APIRouter()

# Schema para crear un nuevo registro en QuienSoy
class QuienSoyCreate(BaseModel):
    name: str
    age: int
    address: str
    photo_url: Optional[str] = None  # Foto opcional al principio

    class Config:
        from_attributes = True

# Schema para actualizar un registro en QuienSoy
class QuienSoyUpdate(BaseModel):
    nombre_completo: Optional[str]
    edad: Optional[int]
    direccion: Optional[str]
    foto: Optional[dt]  # Campo opcional, puede estar vacío

# Schema para devolver la información de QuienSoy
class QuienSoyResponse(BaseModel):
    id: int
    user_id: int
    name: str
    age: int
    address: str
    photo_url: Optional[str] = None  # Foto opcional al principio
    created_at: dt
    updated_at: dt

    class Config:
        from_attributes = True

def get_user_id(request: Request) -> str:
    # Obtener el token JWT de los encabezados
    token = request.headers.get("Authorization")
    if not token:
        raise HTTPException(status_code=401, detail="Authorization token is missing")
    
    # Eliminar el prefijo 'Bearer' del token
    token = token.replace("Bearer ", "")
    
    try:
        # Verificar el token con Firebase Admin SDK
        decoded_token = auth.verify_id_token(token)
        return decoded_token['uid']  # Retorna el 'uid' del usuario, que es el firebase_id
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

@router.post("/user-info/")
async def create_user_info(user_info: QuienSoyCreate, db: Session = Depends(get_db), user_id: str = Depends(get_user_id)):
    # Crear la nueva entrada en la tabla Quien_Soy
    db_user_info = QuienSoy(
        user_id= user_id,  
        name=user_info.name,
        age=user_info.age,
        address=user_info.address,
        photo_url=user_info.photo_url,
        created_at=dt.now(),  # Aseguramos que se guarde la fecha actual
        updated_at=dt.now()   # Aseguramos que se guarde la fecha actual
    )
    
    db.add(db_user_info)
    db.commit()
    db.refresh(db_user_info)
    
    return QuienSoyResponse.model_validate(db_user_info)

@router.get("/user-info/{user_id}")
async def get_user_info(user_id: int, db: Session = Depends(get_db)):
    db_user_info = db.query(QuienSoy).filter(QuienSoy.user_id == user_id).first()
    
    if db_user_info is None:
        raise HTTPException(status_code=404, detail="User info not found")
    
    return QuienSoyResponse.model_validate(db_user_info)

@router.put("/user-info/{user_id}")
async def update_user_info(user_id: int, user_info: QuienSoyCreate, db: Session = Depends(get_db)):
    db_user_info = db.query(QuienSoy).filter(QuienSoy.user_id == user_id).first()
    
    if db_user_info is None:
        raise HTTPException(status_code=404, detail="User info not found")
    
    db_user_info.name = user_info.name
    db_user_info.age = user_info.age
    db_user_info.address = user_info.address
    db_user_info.photo_url = user_info.photo_url
    db_user_info.updated_at = dt.now()  # Actualizamos la fecha de actualización
    
    db.commit()
    db.refresh(db_user_info)
    
    return QuienSoyResponse.model_validate(db_user_info)
