from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.crud import create_ui_settings, get_ui_settings_by_user_id, update_ui_settings
from firebase_admin import auth
from passlib.context import CryptContext

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UISettingsCreate(BaseModel):
    font_size: int
    button_height: int
    icon_size: int

class UISettingsUpdate(BaseModel):
    font_size: int
    button_height: int
    icon_size: int

class UISettingsResponse(BaseModel):
    user_id: str
    font_size: int
    button_height: int
    icon_size: int

    class Config:
        from_attributes = True

async def get_firebase_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    return authorization[7:]  # Elimina 'Bearer ' para obtener el token real

# Ruta para crear configuración
@router.post("/settings", response_model=UISettingsResponse)
def create_settings(settings: UISettingsCreate, db: Session = Depends(get_db), token: str = Depends(get_firebase_token)):
    user_id = get_user_id_from_token(token)
    db_settings = get_ui_settings_by_user_id(db, user_id)
    if db_settings:
        raise HTTPException(status_code=400, detail="Settings for user already exist")
    return create_ui_settings(db, user_id, settings)

# Ruta para obtener configuración por usuario
@router.get("/settings", response_model=UISettingsResponse)
def read_settings(db: Session = Depends(get_db), token: str = Depends(get_firebase_token)):
    user_id = get_user_id_from_token(token)
    settings = get_ui_settings_by_user_id(db, user_id)
    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")
    return settings

# Ruta para actualizar configuración
@router.put("/settings", response_model=UISettingsResponse)
def update_settings(settings: UISettingsUpdate, db: Session = Depends(get_db), token: str = Depends(get_firebase_token)):
    user_id = get_user_id_from_token(token)
    db_settings = update_ui_settings(db, user_id, settings)
    if not db_settings:
        raise HTTPException(status_code=404, detail="Settings not found")
    return db_settings

# Función auxiliar para obtener el UID de Firebase del token
def get_user_id_from_token(token: str):
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token['uid']
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid Firebase token")
    



