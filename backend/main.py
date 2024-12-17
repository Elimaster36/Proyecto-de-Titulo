from fastapi import Depends, FastAPI, HTTPException
from starlette.middleware.cors import CORSMiddleware
from app.dependencies import get_db
from app import agenda, users, quien_soy, news, models, feed, location
from sqlalchemy.orm import Session
from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/user-id/")
def get_user_id(firebase_id: str, db: Session = Depends(get_db)):
    """
    Endpoint para obtener el ID de la base de datos basado en el firebase_id.
    """
    user = db.query(models.User).filter(models.User.firebase_id == firebase_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return {"user_id": user.id}

# Registrar las rutas
app.include_router(users.router, prefix="/api/v1")
app.include_router(quien_soy.router, prefix="/api/v1")
app.include_router(agenda.router, prefix="/api/v1")
app.include_router(news.router, prefix= "/api/v1")
app.include_router(feed.router, prefix="/api/v1")
app.include_router(location.router, prefix="/api/v1")

# Configuración de CORS para permitir las solicitudes desde tu frontend
origins = [
    "http://localhost:8100",  # URL de tu aplicación Angular
]

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todas las fuentes, ajusta según tus necesidades
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)



