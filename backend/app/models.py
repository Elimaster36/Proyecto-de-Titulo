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
    user_info = relationship('UserInfo', back_populates='user', uselist=False)

class Quien_Soy(Base):
    __tablename__ = 'user_info'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))  # Relaciona con la tabla de usuarios
    age = Column(Integer)
    address = Column(String)
    # Relación con el modelo 'User' si ya lo tienes, ajusta el nombre de la tabla si es necesario
    user = relationship('User', back_populates='user_info')
