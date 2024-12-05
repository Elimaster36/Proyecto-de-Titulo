import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Agenda } from '../models/agenda';
import { AgendaService } from './services/agenda.service';
import {
  AlertController,
  ToastController,
  LoadingController,
} from '@ionic/angular';
import { NotificationsService } from './services/notifications.service';
import { firstValueFrom, switchMap } from 'rxjs';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage implements OnInit {
  isModalOpen = false;
  isEditModalOpen = false;
  notes: Agenda[] = [];
  newNote: Agenda = {
    title: '',
    content: '',
    datetime: '',
    notification: false, // Añadimos la propiedad notification
  };
  selectedNote: Agenda = {
    id: undefined,
    title: '',
    content: '',
    datetime: '',
    notification: false, // Añadimos la propiedad notification
  };
  minDate: string;

  constructor(
    private alertController: AlertController,
    private agendaService: AgendaService,
    private authService: AuthService,
    private notificationsService: NotificationsService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
    const today = new Date();
    this.minDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    )
      .toISOString()
      .split('T')[0];
  }

  ngOnInit() {
    this.loadNotes();
    this.notificationsService.requestPermissions(); // Solicitar permisos al iniciar
  }

  loadNotes() {
    // Suscribirse al observable devuelto por getUser() y usar switchMap para obtener las notas
    this.authService
      .getUser()
      .pipe(
        switchMap((user) => {
          if (user) {
            return this.agendaService.getNotes(); // Devuelve el observable de notas filtradas por firebase_id
          } else {
            return []; // Si no hay usuario, retorna un array vacío
          }
        })
      )
      .subscribe({
        next: (notes: Agenda[]) => {
          this.notes = notes; // Establecer las notas para el usuario actual
        },
        error: (error) => {
          console.error('Error al cargar notas:', error);
        },
        complete: () => {
          // Opcional: lógica a ejecutar una vez que la carga de notas termine
          console.log('Carga de notas completada');
        },
      });
  }

  openAddNoteModal() {
    this.isModalOpen = true;
  }

  closeAddNoteModal() {
    this.isModalOpen = false;
    this.newNote = {
      title: '',
      content: '',
      datetime: '',
      notification: false,
    };
  }

  saveNote() {
    this.presentLoading().then(async (loading) => {
      try {
        const user = await firstValueFrom(this.authService.getUser());
        if (user) {
          const noteToSend = { ...this.newNote, firebase_id: user.uid }; // Añadir firebase_id
          this.agendaService.createNote(noteToSend).subscribe(async (note) => {
            this.notes.push(note);
            this.closeAddNoteModal();

            // Programar notificación si está activada
            if (note.notification && note.id !== undefined) {
              await this.notificationsService.scheduleNotification(note);
            }

            this.presentToast('Nota guardada con éxito.');
          });
        }
      } catch (error) {
        console.error('Error al guardar nota:', error);
        this.presentToast('Error al guardar nota.');
      } finally {
        loading.dismiss();
      }
    });
  }

  openEditNoteModal(note: Agenda) {
    this.selectedNote = { ...note };
    this.isEditModalOpen = true;
  }

  closeEditNoteModal() {
    this.isEditModalOpen = false;
    this.selectedNote = {
      id: undefined,
      title: '',
      content: '',
      datetime: '',
      notification: false,
    };
  }

  updateNote() {
    this.authService
      .getUser()
      .pipe(
        switchMap((user) => {
          if (user && this.selectedNote.id !== undefined) {
            const noteToUpdate = {
              ...this.selectedNote,
              firebase_id: user.uid, // Añadir firebase_id
            };

            // Asegurarse de que id es un número antes de llamar a updateNote
            if (typeof this.selectedNote.id === 'number') {
              return this.agendaService.updateNote(
                noteToUpdate,
                this.selectedNote.id
              );
            } else {
              console.error('ID de la nota no es válido.');
              return []; // Retorna un array vacío si el ID no es válido
            }
          } else {
            return []; // Si no hay usuario o la nota no tiene ID, retorna un array vacío
          }
        })
      )
      .subscribe({
        next: async (updatedNote) => {
          const index = this.notes.findIndex((n) => n.id === updatedNote.id);
          if (index !== -1) {
            this.notes[index] = updatedNote;
          }
          this.closeEditNoteModal();

          // Cancelar notificación previa si existe
          if (updatedNote.id !== undefined) {
            await this.notificationsService.cancelNotification(updatedNote.id);
          }

          // Programar nueva notificación si está activada
          if (updatedNote.notification && updatedNote.id !== undefined) {
            await this.notificationsService.scheduleNotification(updatedNote);
          }

          this.presentToast('Nota actualizada con éxito.');
        },
        error: (error) => {
          console.error('Error al actualizar nota:', error);
          this.presentToast('Error al actualizar nota.');
        },
      });
  }

  confirmDelete() {
    this.alertController
      .create({
        header: 'Confirmar Eliminación',
        message: '¿Estás seguro de que quieres eliminar esta nota?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Aceptar',
            handler: () => this.deleteNote(),
          },
        ],
      })
      .then((alert) => alert.present());
  }

  deleteNote() {
    this.authService
      .getUser()
      .pipe(
        switchMap((user) => {
          if (this.selectedNote.id !== undefined) {
            return this.agendaService.deleteNote(this.selectedNote.id);
          } else {
            return []; // Si no hay ID de la nota, retorna un array vacío
          }
        })
      )
      .subscribe({
        next: () => {
          this.notes = this.notes.filter(
            (note) => note.id !== this.selectedNote.id
          );
          this.closeEditNoteModal();

          // Mostrar mensaje de éxito
          this.presentToast('Nota eliminada con éxito.');
        },
        error: (error) => {
          console.error('Error al eliminar nota:', error);
          this.presentToast('Error al eliminar nota.');
        },
        complete: () => {
          // Opcional: Puedes agregar alguna lógica al completar la eliminación si es necesario
          console.log('Eliminación de nota completada');
        },
      });
  }

  presentToast(message: string) {
    this.toastController
      .create({
        message,
        duration: 2000,
        position: 'bottom',
      })
      .then((toast) => toast.present());
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Por favor espera...',
      duration: 2000,
    });
    await loading.present();
    return loading; // Asegúrate de retornar el loading
  }

  trackById(index: number, note: Agenda): number {
    if (note.id !== undefined) {
      return note.id;
    } else {
      console.warn(`Nota sin ID detectada en el índice ${index}`);
      return index;
    }
  }
}
