import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NewsService } from '../../services/news.service';
import { News } from '../../models';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.css']
})
export class NewsDetailComponent implements OnInit {
  news = signal<News | null>(null);
  loading = signal(true);

  get paragraphs(): string[] {
    return (this.news()?.content || '').split('\n').filter(p => p.trim());
  }

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.load(id);
  }

  async load(id: string) {
    this.loading.set(true);
    try {
      this.news.set(await this.newsService.getById(id));
    } catch {
      this.news.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  shareWhatsapp() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Baca berita POBSI Sulteng: ' + (this.news()?.title || ''));
    window.open('https://wa.me/?text=' + text + '%20' + url, '_blank');
  }

  copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Link berhasil disalin!');
    });
  }
}
