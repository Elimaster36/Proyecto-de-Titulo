import { Component, OnInit } from '@angular/core';
import { NewsService } from './services/news.service';
@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.page.html',
  styleUrls: ['./noticias.page.scss'],
})
export class NoticiasPage implements OnInit {
  newsList: any[] = [];
  isLoading = false;

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.loadNews();
  }

  loadNews() {
    this.newsService.getNews().subscribe({
      next: (news) => {
        this.newsList = news; // Asignar las noticias al componente
      },
      error: (error) => {
        console.error('Error al cargar noticias:', error);
      },
    });
  }

  fetchAndStoreNews() {
    this.newsService.fetchAndStoreNews().subscribe({
      next: () => {
        console.log('Noticias actualizadas correctamente');
        this.loadNews(); // Recargar noticias después de actualizarlas
      },
      error: (error) => {
        console.error('Error al actualizar noticias:', error);
      },
    });
  }

  markAsRead(feedId: number) {
    this.newsService.markFeedAsRead(feedId).subscribe({
      next: () => {
        console.log(`Feed con ID ${feedId} marcado como leído.`);
        // Aquí puedes actualizar el estado local si es necesario
      },
      error: (err) => {
        console.error('Error al marcar el feed como leído:', err);
      },
    });
  }

  openLink(url: string) {
    window.open(url, '_blank');
  }
}
