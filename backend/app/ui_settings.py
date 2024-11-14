'''
from fastapi import FastAPI, Depends, HTTPException, Request
from pydantic import BaseModel
import firebase_admin
from firebase_admin import auth, credentials
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# Inicializa Firebase Admin SDK
cred = credentials.Certificate("backend/app/firebase-key.json")
firebase_admin.initialize_app(cred)

# Configura PostgreSQL con SQLAlchemy
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:Postgre_SQL_2003@localhost/postgres"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

app = FastAPI()

class Preferences(Base):
    __tablename__ = "preferences"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(255), index=True, unique=True, nullable=False)
    button_size = Column(Integer, default=12)
    text_size = Column(Integer, default=14)
    image_size = Column(Integer, default=16)

Base.metadata.create_all(bind=engine)

class PreferenceUpdate(BaseModel):
    button_size: int
    text_size: int
    image_size: int

def verify_token(request: Request):
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            raise HTTPException(status_code=401, detail="Authorization header missing")
        token = auth_header.split("Bearer ")[1]
        decoded_token = auth.verify_id_token(token)
        print(f"Token decodificado: {decoded_token}")
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token inválido: {e}")

@app.post("/login")
def login_user(request: Request, db: Session = Depends(SessionLocal)):
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            raise HTTPException(status_code=401, detail="Authorization header missing")
        token = auth_header.split("Bearer ")[1]
        decoded_token = auth.verify_id_token(token)
        user_id = decoded_token["uid"]
        user_email = decoded_token.get("email", "")
        
        # Verificar si el usuario ya existe en la tabla preferences
        preferences = db.query(Preferences).filter(Preferences.user_id == user_id).first()
        if not preferences:
            # Crear una nueva entrada para el usuario si no existe
            preferences = Preferences(user_id=user_id)
            db.add(preferences)
            db.commit()
            print(f"New user preferences created for {user_id}")
        else:
            print(f"User {user_id} already has preferences in the database")
        
        return {"message": "User logged in", "user_id": user_id, "email": user_email}
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token inválido: {e}")


@app.get("/preferences/{user_id}")
def get_preferences(user_id: str, token: dict = Depends(verify_token), db: Session = Depends(SessionLocal)):
    preferences = db.query(Preferences).filter(Preferences.user_id == user_id).first()
    if not preferences:
        raise HTTPException(status_code=404, detail="Preferences not found")
    return preferences

@app.put("/preferences/{user_id}")
def update_preferences(user_id: str, pref: PreferenceUpdate, token: dict = Depends(verify_token), db: Session = Depends(SessionLocal)):
    if user_id != token["uid"]:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    preferences = db.query(Preferences).filter(Preferences.user_id == user_id).first()
    if not preferences:
        preferences = Preferences(user_id=user_id)
        db.add(preferences)
    
    preferences.button_size = pref.button_size
    preferences.text_size = pref.text_size
    preferences.image_size = pref.image_size
    db.commit()
    print("Preferences updated successfully")
    return {"message": "Preferences updated"}
'''