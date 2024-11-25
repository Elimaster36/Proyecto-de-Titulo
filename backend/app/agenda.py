from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List
from app.dependencies import get_db
from app.models import Agenda, User,NoteOut
from firebase_admin import auth

router = APIRouter()

class NoteCreate(BaseModel):
    title: str
    content: str
    datetime: str  # Asegurarse de que sea una cadena en formato ISO 8601
    idToken: str

class NoteUpdate(BaseModel):
    title: str
    content: str
    datetime: str  # Asegurarse de que sea una cadena en formato ISO 8601

@router.post("/agenda/", response_model=NoteOut)
async def create_note(note: NoteCreate, db: Session = Depends(get_db)):
    try:
        decoded_token = auth.verify_id_token(note.idToken)
        firebase_id = decoded_token['uid']
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid Firebase ID token")

    db_user = db.query(User).filter(User.firebase_id == firebase_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    note_datetime = datetime.fromisoformat(note.datetime)  # Convertir a datetime

    db_note = Agenda(title=note.title, content=note.content, datetime=note_datetime, firebase_id=firebase_id, user=db_user)

    try:
        db.add(db_note)
        db.commit()
        db.refresh(db_note)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"DB Error: {str(e)}")

    return {"id": db_note.id, "title": db_note.title, "content": db_note.content, "datetime": db_note.datetime.isoformat()}

@router.get("/agenda/", response_model=List[NoteOut])
async def read_notes(idToken: str, db: Session = Depends(get_db)):
    try:
        decoded_token = auth.verify_id_token(idToken)
        firebase_id = decoded_token['uid']
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid Firebase ID token")

    db_notes = db.query(Agenda).filter(Agenda.firebase_id == firebase_id).all()
    return [{"id": note.id, "title": note.title, "content": note.content, "datetime": note.datetime.isoformat()} for note in db_notes]

@router.put("/agenda/{note_id}", response_model=NoteOut)
async def update_note(note_id: int, note: NoteUpdate, db: Session = Depends(get_db)):
    db_note = db.query(Agenda).filter(Agenda.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")

    note_datetime = datetime.fromisoformat(note.datetime)  # Convertir a datetime

    db_note.title = note.title
    db_note.content = note.content
    db_note.datetime = note_datetime

    try:
        db.commit()
        db.refresh(db_note)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"DB Error: {str(e)}")

    return {"id": db_note.id, "title": db_note.title, "content": db_note.content, "datetime": db_note.datetime.isoformat()}

@router.delete("/agenda/{note_id}")
async def delete_note(note_id: int, db: Session = Depends(get_db)):
    db_note = db.query(Agenda).filter(Agenda.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")

    try:
        db.delete(db_note)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"DB Error: {str(e)}")

    return {"message": "Note deleted successfully"}









