from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    firebase_id = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    # Agrega la relación con 'user_info'
    user_info = relationship('quien_soy', back_populates='users', uselist=False)

class QuienSoy(Base):
    __tablename__ = 'quien_soy'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    userd_id = Column(Integer, ForeignKey('users.id'), nullable=False)  # Relación con el ID de Firebase
    full_name = Column(String, nullable=False)
    photo_url = Column(String, nullable=True)  # URL a la foto almacenada en Firebase Cloud Storage
    age = Column(Integer, nullable=False)
    address = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    # Relación opcional para acceder al usuario si es necesario
    user = relationship('users', back_populates='quien_soy')
