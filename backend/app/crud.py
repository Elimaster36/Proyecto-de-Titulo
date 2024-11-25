from sqlalchemy.orm import Session
from . import models
from pydantic import BaseModel
from datetime import date
from pydantic import BaseModel
from datetime import date

class AgendaBase(BaseModel):
    date: date
    notes: str

class AgendaCreate(AgendaBase):
    user_firebase_id: str

class AgendaUpdate(AgendaBase):
    pass

class Agenda(AgendaBase):
    id: int
    user_firebase_id: str

    class Config:
        from_attributes = True

def get_agenda_by_date_and_user(db: Session, date: str, user_firebase_id: str):
    return db.query(models.Agenda).filter(
        models.Agenda.date == date,
        models.Agenda.user_firebase_id == user_firebase_id
    ).first()

def create_or_update_agenda(db: Session, agenda_data: AgendaCreate):
    existing_agenda = get_agenda_by_date_and_user(db, agenda_data.date, agenda_data.user_firebase_id)
    if existing_agenda:
        existing_agenda.notes = agenda_data.notes
        db.commit()
        db.refresh(existing_agenda)
        return existing_agenda
    else:
        new_agenda = models.Agenda(**agenda_data.model_dump())
        db.add(new_agenda)
        db.commit()
        db.refresh(new_agenda)
        return new_agenda

def get_agenda_by_user(db: Session, user_firebase_id: str):
    return db.query(models.Agenda).filter(models.Agenda.user_firebase_id == user_firebase_id).all()

def update_agenda(db: Session, agenda_id: int, agenda_data: AgendaUpdate):
    db_agenda = db.query(models.Agenda).filter(models.Agenda.id == agenda_id).first()
    if db_agenda:
        db_agenda.notes = agenda_data.notes
        db.commit()
        db.refresh(db_agenda)
        return db_agenda
    return None

def delete_agenda(db: Session, agenda_id: int):
    db_agenda = db.query(models.Agenda).filter(models.Agenda.id == agenda_id).first()
    if db_agenda:
        db.delete(db_agenda)
        db.commit()
    return db_agenda







