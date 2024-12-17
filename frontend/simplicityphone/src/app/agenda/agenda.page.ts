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
import { firstValueFrom, switchMap, catchError, of } from 'rxjs';

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
    this.authService.getUser().pipe(
      switchMap((user) => {
        if (user) {
          return this.agendaService.getNotes();
        } else {
          return of([]); // Si no hay usuario, retorna un array vacío
        }
      }),
      catchError((error) => {
        console.error('Error al cargar notas:', error);
        this.presentToast('Error al cargar notas.');
        return of([]); // En caso de error, retorna un array vacío
      })
    ).subscribe({
      next: (notes: Agenda[]) => {
        this.notes = notes; // Establecer las notas para el usuario actual
      },
      complete: () => {
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
          this.agendaService.createNote(noteToSend).subscribe({
            next: async (note) => {
              this.notes.push(note);
              this.closeAddNoteModal();

              if (note.notification && note.id !== undefined) {
                await this.notificationsService.scheduleNotification(note);
              }

              this.presentToast('Nota guardada con éxito.');
            },
            error: (error) => {
              console.error('Error al guardar nota:', error);
              this.presentToast('Error al guardar nota.');
            }
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
    this.authService.getUser().pipe(
      switchMap((user) => {
        if (user && this.selectedNote.id !== undefined) {
          const noteToUpdate = { ...this.selectedNote, firebase_id: user.uid };
          return this.agendaService.updateNote(noteToUpdate, this.selectedNote.id);
        } else {
          console.error('Usuario no autenticado o ID de la nota no válido.');
          return of(null); // Retorna un observable nulo si no hay usuario o la nota no tiene ID
        }
      }),
      catchError((error) => {
        console.error('Error al actualizar nota:', error);
        this.presentToast('Error al actualizar nota.');
        return of(null); // En caso de error, retorna un observable nulo
      })
    ).subscribe({
      next: async (updatedNote) => {
        if (updatedNote) {
          const index = this.notes.findIndex((n) => n.id === updatedNote.id);
          if (index !== -1) {
            this.notes[index] = updatedNote;
          }
          this.closeEditNoteModal();

          if (updatedNote.id !== undefined) {
            await this.notificationsService.cancelNotification(updatedNote.id);
          }

          if (updatedNote.notification && updatedNote.id !== undefined) {
            await this.notificationsService.scheduleNotification(updatedNote);
          }

          this.presentToast('Nota actualizada con éxito.');
        }
      }
    });
  }

  confirmDelete() {
    this.alertController.create({
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
    }).then((alert) => alert.present());
  }

  deleteNote() {
    this.authService.getUser().pipe(
      switchMap((user) => {
        if (this.selectedNote.id !== undefined) {
          return this.agendaService.deleteNote(this.selectedNote.id);
        } else {
          return of(null); // Si no hay ID de la nota, retorna un observable nulo
        }
      }),
      catchError((error) => {
        console.error('Error al eliminar nota:', error);
        this.presentToast('Error al eliminar nota.');
        return of(null); // En caso de error, retorna un observable nulo
      })
    ).subscribe({
      next: () => {
        this.notes = this.notes.filter((note) => note.id !== this.selectedNote.id);
        this.closeEditNoteModal();
        this.presentToast('Nota eliminada con éxito.');
      }
    });
  }

  presentToast(message: string) {
    this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    }).then((toast) => toast.present());
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Por favor espera...',
    });
    await loading.present();
    return loading; // Asegúrate de retornar el loading
  }

  trackById(index: number, note: Agenda): number {
    return note.id !== undefined ? note.id : index;
  }
}
