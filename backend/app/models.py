from datetime import datetime, timezone
from sqlalchemy import TIMESTAMP, Boolean, Column, Date, Float,Integer, String, DateTime, ForeignKey, Text, text
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
    agendas = relationship("Agenda", back_populates="user")
    feeds = relationship("Feed", back_populates="user") # Relación con Feed
    ubicacion = relationship("Ubicacion", back_populates="user")

class QuienSoy(Base):
    __tablename__ = 'quien_soy'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_firebase_id = Column(String, ForeignKey('users.firebase_id'), nullable=False)
    full_name = Column(String, nullable=False)
    photo = Column(String, nullable=True)
    age = Column(Integer, nullable=False)
    address = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    user = relationship('User', back_populates='quien_soy')

class Agenda(Base):
    __tablename__ = "agendas"
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, index=True, nullable=True)
    content = Column(String, nullable=False)
    datetime = Column(DateTime, nullable=False)  # Esto indica la fecha y hora de la agenda
    firebase_id = Column(String, ForeignKey('users.firebase_id'), nullable=False)  # Relación con Firebase ID
    notification = Column(Boolean, default=False)  # Propiedad de notificación
    user = relationship("User", back_populates="agendas")  # Relación bidireccional con User


class Noticia(Base):
    __tablename__ = "noticias"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    url = Column(String(255), nullable=False, unique=True)
    source_id = Column(String(100), nullable=True)
    pub_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc), nullable=False)
    feeds = relationship("Feed", back_populates="noticia")

# Asegúrate de importar Base desde tu configuración actual

class Feed(Base):
    __tablename__ = "feeds"

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(String, ForeignKey("users.firebase_id"), nullable=False)
    noticia_id = Column(Integer, ForeignKey("noticias.id"), nullable=False)
    fecha_vista = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)
    creado_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)
    usuario = relationship("User", back_populates="feeds")
    noticia = relationship("Noticia", back_populates="feeds")

class Ubicacion(Base):
    __tablename__ = 'locations'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    updated_at = Column(TIMESTAMP, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    usuario = relationship("User", back_populates="locations")






