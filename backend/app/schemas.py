from pydantic import BaseModel
from datetime import datetime as time
from typing import Optional

class AgendaBase(BaseModel):
    title: Optional[str]
    content: str
    datetime: time
    notification: bool = False

class AgendaCreate(AgendaBase):
    firebase_id: str  # Cambiado de user_id a firebase_id (como string)

class AgendaUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    datetime: Optional[time] = None  # Esto indica que puede ser un objeto datetime o None
    notification: Optional[bool] = None

class AgendaInDBBase(AgendaBase):
    id: int
    firebase_id: str  # Mantenemos firebase_id como string

    class Config:
        from_attributes = True  

class Agenda(AgendaInDBBase):
    pass

class UserBase(BaseModel):
    firebase_id: str
    # Otros atributos que necesites

    class Config:
        from_attributes = True  

class News(BaseModel):
    title: Optional[str]  # Puede que falten algunos datos, por lo que es mejor usar `Optional`
    description: Optional[str]
    link: Optional[str]
    pubDate: Optional[str]  # Asegúrate de que este formato coincida con la API
    source_id: Optional[str]

    class Config:
        from_attributes = True