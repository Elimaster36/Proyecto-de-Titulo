from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text  # Importar text
from app.schemas import Location
from .dependencies import get_db
import logging

router = APIRouter()

# Configurar el logger
logger = logging.getLogger("uvicorn.error")

@router.post("/location")
async def post_location(location: Location, db: Session = Depends(get_db)):
    try:
        db.execute(text("""
            INSERT INTO locations (user_id, latitude, longitude, updated_at)
            VALUES (:user_id, :latitude, :longitude, CURRENT_TIMESTAMP)
            ON CONFLICT (user_id) DO UPDATE
            SET latitude = EXCLUDED.latitude,
                longitude = EXCLUDED.longitude,
                updated_at = EXCLUDED.updated_at
        """), {'user_id': location.user_id, 'latitude': location.latitude, 'longitude': location.longitude})
        db.commit()
        return {"status": "Location updated"}
    except Exception as e:
        db.rollback()
        logger.error(f"Error al actualizar la ubicación: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al actualizar la ubicación")

@router.get("/location/{user_id}")
async def get_location(user_id: str, db: Session = Depends(get_db)):
    try:
        result = db.execute(text("SELECT latitude, longitude FROM locations WHERE user_id = :user_id"), {'user_id': user_id})
        location = result.fetchone()
        if location:
            return {"latitude": location.latitude, "longitude": location.longitude}
        else:
            raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        logger.error(f"Error al obtener la ubicación: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al obtener la ubicación")
