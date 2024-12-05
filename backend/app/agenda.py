from fastapi import APIRouter, Depends, HTTPException, Security
from sqlalchemy.orm import Session
from app.dependencies import get_current_user, get_db
from app.models import Agenda, User
from . import crud_agendas
from utils.notifications import schedule_notification
from . import schemas

router = APIRouter()


# Ejemplo en un endpoint para obtener todas las agendas del usuario autenticado
@router.get("/agendas/")
def read_agendas(db: Session = Depends(get_db)):
    return crud_agendas.get_agendas(db)

@router.post("/agendas/", response_model=schemas.AgendaInDBBase)
def create_agenda(
    agenda: schemas.AgendaCreate, 
    db: Session = Depends(get_db), 
    current_user: schemas.UserBase = Security(get_current_user)
):
    # Obtener el firebase_id del usuario autenticado
    firebase_id = current_user.firebase_id  # Obtén el firebase_id del usuario

    # Consultar el usuario a partir del firebase_id
    db_user = db.query(User).filter(User.firebase_id == firebase_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Crear la agenda asociada al usuario
    db_agenda = crud_agendas.create_agenda(
        db=db, 
        agenda=agenda,  # AgendaCreate ya tiene firebase_id
    )

    # Si la agenda tiene una notificación programada, ejecutamos la función
    if agenda.notification:
        schedule_notification(db_agenda)

    return db_agenda


@router.put("/agendas/{agenda_id}", response_model=schemas.AgendaInDBBase)
def update_agenda(
    agenda_id: int, 
    agenda: schemas.AgendaUpdate, 
    db: Session = Depends(get_db), 
    current_user: schemas.UserBase = Security(get_current_user)
):
    # Obtener el firebase_id del usuario autenticado
    firebase_id = current_user.firebase_id
    
    # Consultar el usuario a partir del firebase_id
    db_user = db.query(User).filter(User.firebase_id == firebase_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Obtener la agenda a actualizar y verificar que pertenece al usuario
    db_agenda = db.query(Agenda).filter(Agenda.id == agenda_id, Agenda.firebase_id == firebase_id).first()  # Cambiado de user_id a firebase_id
    if not db_agenda:
        raise HTTPException(status_code=404, detail="Agenda not found or unauthorized")
    
    # Actualizar los campos de la agenda con los datos proporcionados (ignorar campos no establecidos)
    for key, value in agenda.model_dump(exclude_unset=True).items():
        setattr(db_agenda, key, value)
    
    # Confirmar la actualización en la base de datos
    db.commit()
    db.refresh(db_agenda)
    
    # Si se quiere programar una notificación
    if agenda.notification:
        schedule_notification(db_agenda)  # Asegúrate de que esta función esté correctamente implementada
    
    return db_agenda


@router.delete("/agendas/{agenda_id}")
def delete_agenda(
    agenda_id: int, 
    db: Session = Depends(get_db), 
    current_user: schemas.UserBase = Security(get_current_user)
):
    # Obtener el firebase_id del usuario autenticado
    firebase_id = current_user.firebase_id
    
    # Llamar a la función del CRUD para eliminar la agenda
    db_agenda = crud_agendas.delete_agenda(db, agenda_id, firebase_id)
    
    # Si no se encuentra la agenda, el CRUD lanzará una HTTPException, no es necesario hacer otra verificación aquí.
    if not db_agenda:
        raise HTTPException(status_code=404, detail="Agenda not found or unauthorized")
    
    # Retornar un mensaje de éxito
    return {"detail": "Agenda deleted"}












