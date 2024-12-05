import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Agenda } from 'src/app/models/agenda';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor() {}

  async scheduleNotification(note: Agenda) {
    const scheduledTime = new Date(note.datetime).getTime();
    const currentTime = new Date().getTime();

    // Solo programar la notificación si la fecha/hora es futura
    if (scheduledTime > currentTime) {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: note.id!, // Usamos el operador de no-nulo aquí
            title: 'Recordatorio de Agenda',
            body: note.content,
            schedule: { at: new Date(scheduledTime) },
            sound: 'default',
            attachments: [], // Establecemos attachments como un array vacío
            actionTypeId: '',
            extra: null,
          },
        ],
      });
    }
  }

  async cancelNotification(noteId: number) {
    await LocalNotifications.cancel({
      notifications: [{ id: noteId }],
    });
  }

  async requestPermissions() {
    const result = await LocalNotifications.requestPermissions();
    if (result.display === 'granted') {
      console.log('Permisos para notificaciones concedidos.');
    } else {
      console.log('Permisos para notificaciones denegados.');
    }
  }
}
