from fastapi import HTTPException, status
from grpc import Status
import pytest
from sqlalchemy.orm import Session
from .models import Agenda
from .schemas import AgendaCreate, AgendaUpdate


def get_agendas(db: Session):
    agendas = db.query(Agenda).all()
    return agendas

def get_user_agendas(db: Session, firebase_id: str):
    return db.query(Agenda).filter(Agenda.firebase_id == firebase_id).all()

def create_agenda(db: Session,agenda: AgendaCreate):
    # Crear una nueva agenda asociada al usuario mediante firebase_id
    db_agenda = Agenda(
        title=agenda.title,
        content=agenda.content,
        datetime=agenda.datetime,
        notification=agenda.notification,
        firebase_id=agenda.firebase_id  # Aquí usamos firebase_id que viene del esquema AgendaCreate
    )
    db.add(db_agenda)
    db.commit()
    db.refresh(db_agenda)
    return db_agenda


def update_agenda(db: Session, agenda_id: int, firebase_id: str, agenda: AgendaUpdate):
    # Consultar la agenda a actualizar, asegurándose de que pertenece al usuario
    db_agenda = db.query(Agenda).filter(Agenda.id == agenda_id, Agenda.firebase_id == firebase_id).first()
    
    # Si no se encuentra la agenda, lanzar una excepción
    if not db_agenda:
        raise HTTPException(
            status_code=Status.HTTP_404_NOT_FOUND,
            detail="Agenda not found or unauthorized"
        )
    
    # Actualizar los campos de la agenda con los datos proporcionados
    for key, value in agenda.model_dump(exclude_unset=True).items():
        setattr(db_agenda, key, value)
    
    # Confirmar los cambios y refrescar la instancia de la agenda
    db.commit()
    db.refresh(db_agenda)
    
    return db_agenda

def delete_agenda(db: Session, agenda_id: int, firebase_id: str):
    # Consultar la agenda a eliminar, asegurándose de que pertenece al usuario
    db_agenda = db.query(Agenda).filter(Agenda.id == agenda_id, Agenda.firebase_id == firebase_id).first()
    
    # Si no se encuentra la agenda o no pertenece al usuario, lanzar una excepción
    if not db_agenda:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agenda not found or unauthorized")
    
    # Eliminar la agenda
    db.delete(db_agenda)
    db.commit()
    
    return db_agenda












