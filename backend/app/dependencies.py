from fastapi import Depends, HTTPException, Request
from firebase_admin import auth
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.models import Base, User  # Ajusta según tu estructura de directorios
import os
from b2sdk.v1 import InMemoryAccountInfo, B2Api

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:Postgre_SQL_2003@localhost/postgres"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

# Dependencia para obtener la sesión de base de datos 
def get_db(): 
    db = SessionLocal() 
    try: 
        yield db 
    finally: 
        db.close()

def get_current_user(request: Request, db: Session = Depends(get_db)):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    try:
        token = auth_header.split(" ")[1]
    except IndexError:
        raise HTTPException(status_code=401, detail="Bearer token malformed")

    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token["uid"]
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = db.query(User).filter(User.firebase_id == uid).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user



# Configura las credenciales
os.environ["B2_APPLICATION_KEY_ID"] = "004edf826f9a45b0000000001"
os.environ["B2_APPLICATION_KEY"] = "K004OdFotsaguPWEhVrRVloATC4he10"

def get_b2_api():
    info = InMemoryAccountInfo()
    b2_api = B2Api(info)
    b2_api.authorize_account("production", os.environ["B2_APPLICATION_KEY_ID"], os.environ["B2_APPLICATION_KEY"])
    return b2_api





