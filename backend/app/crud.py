from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.models import UISettings

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

# Crear configuración de interfaz
def create_ui_settings(db: Session, user_id: str, settings: UISettingsCreate):
    db_settings = UISettings(
        user_id=user_id,
        font_size=settings.font_size,
        button_height=settings.button_height,
        icon_size=settings.icon_size
    )
    db.add(db_settings)
    db.commit()
    db.refresh(db_settings)
    return db_settings

# Obtener configuración de interfaz de un usuario
def get_ui_settings_by_user_id(db: Session, user_id: str):
    return db.query(UISettings).filter(UISettings.user_id == user_id).first()

# Actualizar configuración de interfaz
def update_ui_settings(db: Session, user_id: str, settings: UISettingsUpdate):
    db_settings = db.query(UISettings).filter(UISettings.user_id == user_id).first()
    if db_settings:
        db_settings.font_size = settings.font_size
        db_settings.button_height = settings.button_height
        db_settings.icon_size = settings.icon_size
        db.commit()
        db.refresh(db_settings)
        return db_settings
    return None