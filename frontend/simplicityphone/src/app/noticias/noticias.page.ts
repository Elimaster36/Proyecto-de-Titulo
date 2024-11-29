import { Component, OnInit } from '@angular/core';
import { News } from '../models/news';
import { NewsService } from './services/news.service';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.page.html',
  styleUrls: ['./noticias.page.scss'],
})
export class NoticiasPage implements OnInit {
  news: News[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.fetchNews();
  }

  fetchNews() {
    this.newsService.getNews().subscribe({
      next: (data) => {
        this.news = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage =
          'Error al cargar las noticias. Intenta de nuevo más tarde.';
        this.isLoading = false;
      },
      complete: () => {
        console.log('Noticias cargadas exitosamente');
      },
    });
  }

  openLink(url: string) {
    window.open(url, '_blank');
  }
}
