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

class NewsBase(BaseModel):
    title: str
    description: Optional[str]
    url: str
    source_id: Optional[str]
    pub_date: Optional[time]

    class Config:
        from_attributes = True

class NewsCreate(NewsBase):
    pass

class News(NewsBase):
    id: int
    created_at: time
    updated_at: time

class FeedBase(BaseModel):
    usuario_id: str
    noticia_id: int
    fecha_vista: Optional[time] = None

    class Config:
        from_attributes = True

class FeedCreate(FeedBase):
    pass

class Feed(FeedBase):
    id: int
    creado_at: time
    noticia: News  # Relación con el esquema de Noticia

class Location(BaseModel):
    user_id: str
    latitude: float
    longitude: float
    updated_at: Optional[str] = None

    class Config:
        from_atributtes = True
