import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Agenda } from '../models/agenda';
import { AgendaService } from './services/agenda.service';
import { AlertController } from '@ionic/angular';

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
  };
  selectedNote: Agenda = {
    id: undefined, // Aseguramos que tenga un id
    title: '',
    content: '',
    datetime: '',
  };
  minDate: string; // Variable para almacenar la fecha mínima

  constructor(
    private alertController: AlertController,
    private agendaService: AgendaService,
    private authService: AuthService // Inyecta tu AuthService
  ) {
    // Establecer la fecha mínima solo con la fecha actual
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
  }

  async loadNotes() {
    try {
      const user = await this.authService.getUser();
      if (user) {
        const idToken = await user.getIdToken();
        this.agendaService.getNotes(idToken).subscribe((notes: Agenda[]) => {
          this.notes = notes;
        });
      }
    } catch (error) {
      console.error('Error al cargar notas:', error);
    }
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
    };
  }

  async saveNote() {
    try {
      const user = await this.authService.getUser();
      if (user) {
        const idToken = await user.getIdToken();
        const noteToSend = { ...this.newNote, idToken }; // Añadir idToken al objeto
        this.agendaService.saveNote(noteToSend).subscribe((note) => {
          this.notes.push(note);
          this.closeAddNoteModal();
        });
      }
    } catch (error) {
      console.error('Error al guardar nota:', error);
    }
  }

  openEditNoteModal(note: Agenda) {
    this.selectedNote = { ...note }; // Aseguramos que el objeto tenga id
    this.isEditModalOpen = true;
  }

  closeEditNoteModal() {
    this.isEditModalOpen = false;
    this.selectedNote = {
      id: undefined, // Aseguramos que tenga un id
      title: '',
      content: '',
      datetime: '',
    };
  }

  async updateNote() {
    try {
      const user = await this.authService.getUser();
      if (user) {
        const idToken = await user.getIdToken();
        const noteToUpdate = { ...this.selectedNote, idToken }; // Añadir idToken al objeto
        if (noteToUpdate.id !== undefined) {
          // Verificar que id no sea undefined
          this.agendaService
            .updateNote(noteToUpdate, noteToUpdate.id)
            .subscribe((updatedNote) => {
              const index = this.notes.findIndex(
                (n) => n.id === updatedNote.id
              );
              if (index !== -1) {
                this.notes[index] = updatedNote;
              }
              this.closeEditNoteModal();
            });
        } else {
          console.error('Error: noteToUpdate.id es undefined');
        }
      }
    } catch (error) {
      console.error('Error al actualizar nota:', error);
    }
  }

  async confirmDelete() {
    const alert = await this.alertController.create({
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
    });

    await alert.present();
  }

  async deleteNote() {
    try {
      if (this.selectedNote.id !== undefined) {
        // Verificar que id no sea undefined
        this.agendaService.deleteNote(this.selectedNote.id).subscribe(() => {
          this.notes = this.notes.filter(
            (note) => note.id !== this.selectedNote.id
          );
          this.closeEditNoteModal();
        });
      } else {
        console.error('Error: selectedNote.id es undefined');
      }
    } catch (error) {
      console.error('Error al eliminar nota:', error);
    }
  }
}
