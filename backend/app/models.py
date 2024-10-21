from sqlalchemy import Column, Integer, String, TIMESTAMP, func
from sqlalchemy.orm import relationship
from app.dependencies import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    firebase_id = Column(String, unique=True, nullable=False)
    created_at = Column(String, default="CURRENT_TIMESTAMP")

class UISettings(Base):
    __tablename__ = "ui_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, nullable=False)
    font_size = Column(String, default="16px")
    button_height = Column(String, default="40px")
    icon_size = Column(String, default="24px")
    created_at = Column(TIMESTAMP, default=func.now())
