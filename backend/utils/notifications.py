import schedule
from datetime import datetime
from app.models import Agenda
from firebase_admin import messaging

def schedule_notification(agenda: Agenda):
    scheduled_time = agenda.datetime

    if scheduled_time > datetime.now():
        # Usar schedule para programar la notificación
        schedule.every().day.at(scheduled_time.strftime("%H:%M")).do(send_notification, agenda)

def send_notification(agenda: Agenda):
    message = messaging.Message(
        notification=messaging.Notification(
            title='Recordatorio de Agenda',
            body=agenda.content,
        ),
        token=agenda.firebase_id
    )

    response = messaging.send(message)
    print(f"Notificación enviada para la agenda: {agenda.title}, respuesta: {response}")

