import logging
import os
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from app.dependencies import get_db
from passlib.context import CryptContext
from app.models import User
import firebase_admin
from firebase_admin import auth, credentials

router = APIRouter()

# Obtener el contenido del archivo desde la variable de entorno 
firebase_key_content = os.getenv('FIREBASE_KEY') 
# Crear un archivo temporal con el contenido de la clave 
with open('/etc/secrets/firebase-key.json', 'w') as f: 
    f.write(firebase_key_content) 
    secret_file_path = '/etc/secrets/firebase-key.json'

cred = credentials.Certificate(secret_file_path)
firebase_admin.initialize_app(cred)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configura el logger
logging.basicConfig(level=logging.INFO)

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    idToken: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    idToken: str

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

@router.post("/register")
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        decoded_token = auth.verify_id_token(user.idToken)
        firebase_id = decoded_token['uid']
    except Exception as e:
        logging.error(f"Token Error: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid Firebase ID token")

    hashed_password = pwd_context.hash(user.password)
    db_user = User(name=user.name, email=user.email, password=hashed_password, firebase_id=firebase_id)

    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    except Exception as e:
        logging.error(f"DB Error: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"DB Error: {str(e)}")

    return {"message": "User created successfully", "db_user": db_user}

@router.post("/login")
async def login_user(user: UserLogin, db: Session = Depends(get_db)):
    try:
        decoded_token = auth.verify_id_token(user.idToken)
        firebase_id = decoded_token['uid']
    except Exception as e:
        logging.error(f"Token Error: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid Firebase ID token")

    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    db_user.firebase_id = firebase_id
    db.commit()

    return {"message": "User logged in", "user_id": db_user.id, "email": db_user.email}



