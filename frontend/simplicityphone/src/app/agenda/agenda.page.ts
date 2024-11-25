import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Agenda } from '../models/agenda';
import { AgendaService } from './services/agenda.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage implements OnInit {
  isModalOpen = false;
  notes: Agenda[] = [];
  newNote: Agenda = {
    title: '',
    content: '',
    datetime: '',
  };

  constructor(
    private agendaService: AgendaService,
    private authService: AuthService // Inyecta tu AuthService
  ) {}

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
}
