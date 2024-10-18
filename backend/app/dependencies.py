from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session, Session
from app.models import Base  # Ajusta según tu estructura de directorios

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


# Aquí agregas tus rutas


