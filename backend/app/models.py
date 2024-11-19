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
    quien_soy = relationship('QuienSoy', back_populates='user')

class QuienSoy(Base):
    __tablename__ = 'quien_soy'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_firebase_id = Column(String, ForeignKey('users.firebase_id'), nullable=False)
    full_name = Column(String, nullable=False)
    photo = Column(String, nullable=True)  # Cambiado a String para almacenar la cadena base64
    age = Column(Integer, nullable=False)
    address = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    user = relationship('User', back_populates='quien_soy')


