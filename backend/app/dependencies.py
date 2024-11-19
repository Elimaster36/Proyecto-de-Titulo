from fastapi import Depends, HTTPException, Request
from firebase_admin import auth
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session, Session
from app.models import Base, User  # Ajusta según tu estructura de directorios

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:Postgre_SQL_2003@localhost/postgres"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(request: Request, db: Session = Depends(get_db)):
    # Obtener el token de Firebase del encabezado Authorization
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    token = auth_header.split(" ")[1]  # "Bearer <token>"
    try:
        # Verificar el token y obtener el UID del usuario
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token["uid"]  # Aquí obtienes el UID de Firebase
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    # Buscar el usuario en la base de datos por su UID
    user = db.query(User).filter(User.firebase_id == uid).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user



