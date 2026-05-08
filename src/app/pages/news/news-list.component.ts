import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NewsService } from '../../services/news.service';
import { ToastService } from '../../services/toast.service';
import { News } from '../../models';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css']
})
export class NewsListComponent implements OnInit {
  newsList   = signal<News[]>([]);
  loading    = signal(true);
  saving     = signal(false);
  showModal  = signal(false);
  showDeleteConfirm = signal(false);

  searchQuery    = '';
  filterCategory = '';
  editingId: string | null  = null;
  deletingItem: News | null = null;
  photoFile: File | null    = null;
  photoPreview: string | null = null;

  form: News = this.emptyForm();

  // Gunakan getter biasa (Angular 17 tidak support @let di template)
  get filteredNews(): News[] {
    let list = this.newsList();
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q)
      );
    }
    if (this.filterCategory) {
      list = list.filter(n => n.category === this.filterCategory);
    }
    return list;
  }

  get featuredNews(): News | null {
    return this.filteredNews[0] ?? null;
  }

  get otherNews(): News[] {
    return this.filteredNews.slice(1);
  }

  constructor(
    private newsService: NewsService,
    private toast: ToastService
  ) {}

  ngOnInit() { this.load(); }

  emptyForm(): News {
    return {
      title: '', content: '', summary: '',
      author: '', category: 'Umum', published: true
    };
  }

  async load() {
    this.loading.set(true);
    try { this.newsList.set(await this.newsService.getAll()); }
    catch (e: any) { this.toast.error('Gagal memuat: ' + e.message); }
    finally { this.loading.set(false); }
  }

  openModal(news?: News) {
    this.form        = news ? { ...news } : this.emptyForm();
    this.editingId   = news?.id ?? null;
    this.photoPreview = news?.photo_url ?? null;
    this.photoFile   = null;
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingId   = null;
    this.photoFile   = null;
    this.photoPreview = null;
  }

  onPhotoChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.photoFile = file;
    const reader  = new FileReader();
    reader.onload = e => this.photoPreview = e.target?.result as string;
    reader.readAsDataURL(file);
  }

  removePhoto() {
    this.photoFile    = null;
    this.photoPreview = null;
    this.form.photo_url = undefined;
  }

  async save() {
    if (!this.form.title || !this.form.content || !this.form.summary || !this.form.author) {
      this.toast.error('Harap isi semua field wajib!');
      return;
    }
    this.saving.set(true);
    try {
      const payload = { ...this.form };
      delete payload.id;
      delete payload.created_at;
      delete payload.updated_at;

      if (this.editingId) {
        await this.newsService.update(this.editingId, payload, this.photoFile ?? undefined);
        this.toast.success('Berita berhasil diperbarui!');
      } else {
        await this.newsService.create(payload, this.photoFile ?? undefined);
        this.toast.success('Berita berhasil diterbitkan!');
      }
      this.closeModal();
      this.load();
    } catch (e: any) { this.toast.error('Gagal menyimpan: ' + e.message); }
    finally { this.saving.set(false); }
  }

  async togglePublish(news: News) {
    try {
      await this.newsService.togglePublish(news.id!, !news.published);
      this.toast.success(news.published ? 'Dijadikan draft' : 'Berita dipublikasikan!');
      this.load();
    } catch (e: any) { this.toast.error('Gagal: ' + e.message); }
  }

  confirmDelete(item: News) {
    this.deletingItem = item;
    this.showDeleteConfirm.set(true);
  }

  async deleteItem() {
    if (!this.deletingItem?.id) return;
    this.saving.set(true);
    try {
      await this.newsService.delete(this.deletingItem.id);
      this.toast.success('Berita berhasil dihapus!');
      this.showDeleteConfirm.set(false);
      this.load();
    } catch (e: any) { this.toast.error('Gagal menghapus: ' + e.message); }
    finally { this.saving.set(false); }
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  }
}
