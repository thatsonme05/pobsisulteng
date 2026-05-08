import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChampionshipService } from '../../services/championship.service';
import { ToastService } from '../../services/toast.service';
import { Championship } from '../../models';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-content">

      <!-- BANNER -->
      <div class="page-banner">
        <div class="container">
          <h1><span class="material-icons" style="font-size:1.6rem;vertical-align:middle;margin-right:8px">calendar_month</span>Kalender Kejuaraan</h1>
          <p>Jadwal dan informasi kompetisi biliar Sulawesi Tengah</p>
        </div>
      </div>

      <div class="container">

        <!-- TOOLBAR -->
        <div class="toolbar">
          <div class="filter-tabs">
            @for (tab of statusFilters; track tab.value) {
              <button class="filter-tab" [class.active]="activeFilter === tab.value" (click)="setFilter(tab.value)">
                {{ tab.label }}
                <span class="tab-count" [class]="tab.color">{{ getCount(tab.value) }}</span>
              </button>
            }
          </div>
          <button class="btn btn-primary" (click)="openModal()">
            <span class="material-icons">add</span> Tambah Event
          </button>
        </div>

        <!-- LOADING -->
        @if (loading()) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Memuat jadwal...</p>
          </div>
        }

        <!-- TIMELINE VIEW -->
        @if (!loading()) {
          <div class="timeline">
            @for (champ of filteredChampionships; track champ.id) {
              <div class="timeline-item">
                <div class="timeline-dot" [class]="getStatusClass(champ.status)"></div>
                <div class="timeline-card">
                  <div class="tc-header">
                    <div class="tc-status">
                      <span class="badge" [class]="getStatusBadge(champ.status)">
                        <span class="material-icons status-dot-icon">circle</span>
                        {{ champ.status }}
                      </span>
                    </div>
                    <div class="tc-actions">
                      <button class="btn btn-sm btn-secondary btn-icon" (click)="openModal(champ)" title="Edit">
                        <span class="material-icons" style="font-size:16px">edit</span>
                      </button>
                      <button class="btn btn-sm btn-danger btn-icon" (click)="confirmDelete(champ)" title="Hapus">
                        <span class="material-icons" style="font-size:16px">delete</span>
                      </button>
                    </div>
                  </div>

                  <h3 class="tc-title">{{ champ.title }}</h3>

                  <div class="tc-meta">
                    <div class="tc-meta-item">
                      <span class="material-icons">calendar_today</span>
                      {{ formatDateRange(champ.date_start, champ.date_end) }}
                    </div>
                    <div class="tc-meta-item">
                      <span class="material-icons">location_on</span>
                      {{ champ.location }}
                    </div>
                    <div class="tc-meta-item">
                      <span class="material-icons">category</span>
                      {{ champ.category }}
                    </div>
                    <div class="tc-meta-item">
                      <span class="material-icons">business</span>
                      {{ champ.organizer }}
                    </div>
                  </div>

                  @if (champ.description) {
                    <p class="tc-desc">{{ champ.description }}</p>
                  }

                  @if (champ.registration_deadline) {
                    <div class="tc-deadline">
                      <span class="material-icons">schedule</span>
                      Batas pendaftaran: {{ formatDate(champ.registration_deadline) }}
                    </div>
                  }

                  @if (champ.contact) {
                    <div class="tc-contact">
                      <span class="material-icons">phone</span>
                      Kontak: {{ champ.contact }}
                    </div>
                  }
                </div>
              </div>
            }

            @if (filteredChampionships.length === 0) {
              <div class="empty-state">
                <span class="material-icons">event_busy</span>
                <h3>Tidak Ada Kejuaraan</h3>
                <p>Belum ada kejuaraan dengan status ini.</p>
              </div>
            }
          </div>
        }

      </div>
    </div>

    <!-- MODAL -->
    @if (showModal()) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">{{ editingId ? 'Edit Kejuaraan' : 'Tambah Kejuaraan' }}</h3>
            <button class="modal-close" (click)="closeModal()">
              <span class="material-icons">close</span>
            </button>
          </div>
          <div class="modal-body">

            <div class="form-group">
              <label class="form-label">Nama Kejuaraan *</label>
              <input class="form-control" [(ngModel)]="form.title" placeholder="Contoh: Kejurprov Biliar 2024" />
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Tanggal Mulai *</label>
                <input class="form-control" type="date" [(ngModel)]="form.date_start" />
              </div>
              <div class="form-group">
                <label class="form-label">Tanggal Selesai *</label>
                <input class="form-control" type="date" [(ngModel)]="form.date_end" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Lokasi / Venue *</label>
              <input class="form-control" [(ngModel)]="form.location" placeholder="Nama gedung, kota" />
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Kategori *</label>
                <select class="form-control" [(ngModel)]="form.category">
                  <option value="">Pilih kategori</option>
                  <option value="Nasional">Nasional</option>
                  <option value="Provinsi">Provinsi</option>
                  <option value="Kabupaten/Kota">Kabupaten/Kota</option>
                  <option value="Antar Klub">Antar Klub</option>
                  <option value="Undangan">Undangan</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Status *</label>
                <select class="form-control" [(ngModel)]="form.status">
                  <option value="Akan Datang">Akan Datang</option>
                  <option value="Berlangsung">Berlangsung</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Penyelenggara</label>
              <input class="form-control" [(ngModel)]="form.organizer" placeholder="Nama organisasi/panitia" />
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Batas Pendaftaran</label>
                <input class="form-control" type="date" [(ngModel)]="form.registration_deadline" />
              </div>
              <div class="form-group">
                <label class="form-label">Kontak</label>
                <input class="form-control" [(ngModel)]="form.contact" placeholder="No. HP / email" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Deskripsi</label>
              <textarea class="form-control" [(ngModel)]="form.description" placeholder="Informasi tambahan tentang kejuaraan..." rows="3"></textarea>
            </div>

          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeModal()" [disabled]="saving()">Batal</button>
            <button class="btn btn-primary" (click)="save()" [disabled]="saving()">
              @if (saving()) {
                <span class="material-icons spin">autorenew</span> Menyimpan...
              } @else {
                <span class="material-icons">save</span> {{ editingId ? 'Simpan' : 'Tambah' }}
              }
            </button>
          </div>
        </div>
      </div>
    }

    <!-- DELETE CONFIRM -->
    @if (showDeleteConfirm()) {
      <div class="modal-overlay" (click)="showDeleteConfirm.set(false)">
        <div class="modal-box confirm-box" (click)="$event.stopPropagation()">
          <div class="confirm-icon"><span class="material-icons">warning</span></div>
          <h3>Hapus Kejuaraan?</h3>
          <p>Data kejuaraan <strong>{{ deletingItem?.title }}</strong> akan dihapus permanen.</p>
          <div class="confirm-actions">
            <button class="btn btn-secondary" (click)="showDeleteConfirm.set(false)">Batal</button>
            <button class="btn btn-danger" (click)="deleteItem()" [disabled]="saving()">
              {{ saving() ? 'Menghapus...' : 'Ya, Hapus' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .toolbar {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 24px;
    }
    @media (min-width: 640px) {
      .toolbar { flex-direction: row; align-items: center; justify-content: space-between; }
    }
    .filter-tabs {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .filter-tab {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: 20px;
      border: 2px solid var(--border);
      background: var(--white);
      font-size: 13px;
      font-weight: 600;
      color: var(--gray);
      cursor: pointer;
      transition: all var(--transition);
    }
    .filter-tab.active {
      background: var(--red);
      border-color: var(--red);
      color: var(--white);
    }
    .tab-count {
      background: rgba(0,0,0,0.1);
      border-radius: 10px;
      padding: 1px 8px;
      font-size: 12px;
    }
    .filter-tab.active .tab-count { background: rgba(255,255,255,0.25); }

    /* TIMELINE */
    .timeline { position: relative; padding-left: 24px; }
    .timeline::before {
      content: '';
      position: absolute;
      left: 8px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--border);
    }
    .timeline-item {
      position: relative;
      margin-bottom: 20px;
    }
    .timeline-dot {
      position: absolute;
      left: -24px;
      top: 20px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 3px solid var(--white);
      box-shadow: 0 0 0 2px var(--border);
    }
    .timeline-dot.upcoming { background: #2563eb; box-shadow: 0 0 0 2px #2563eb; }
    .timeline-dot.ongoing { background: #16a34a; box-shadow: 0 0 0 2px #16a34a; }
    .timeline-dot.done { background: var(--gray); box-shadow: 0 0 0 2px var(--gray); }
    .timeline-dot.cancelled { background: var(--red); box-shadow: 0 0 0 2px var(--red); }

    .timeline-card {
      background: var(--white);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
      padding: 18px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      transition: box-shadow var(--transition);
    }
    .timeline-card:hover { box-shadow: var(--shadow); }

    .tc-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .tc-actions { display: flex; gap: 6px; }
    .tc-title {
      font-family: var(--font-heading);
      font-size: 1.05rem;
      color: var(--dark);
      margin-bottom: 12px;
      line-height: 1.3;
    }
    .tc-meta {
      display: grid;
      grid-template-columns: 1fr;
      gap: 6px;
      margin-bottom: 12px;
    }
    @media (min-width: 480px) {
      .tc-meta { grid-template-columns: 1fr 1fr; }
    }
    .tc-meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: var(--gray);
    }
    .tc-meta-item .material-icons { font-size: 15px; color: var(--red); flex-shrink: 0; }
    .tc-desc { font-size: 13px; color: var(--gray); line-height: 1.5; margin-bottom: 10px; }
    .tc-deadline, .tc-contact {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: var(--gray);
      padding: 6px 10px;
      background: var(--gray-light);
      border-radius: 6px;
      margin-top: 8px;
    }
    .tc-deadline .material-icons, .tc-contact .material-icons { font-size: 15px; color: var(--red); }

    .status-dot-icon { font-size: 10px !important; }

    .confirm-box {
      padding: 32px 24px;
      text-align: center;
      max-width: 380px;
    }
    .confirm-icon .material-icons {
      font-size: 52px;
      color: #f59e0b;
      display: block;
      margin-bottom: 12px;
    }
    .confirm-box h3 { margin-bottom: 10px; }
    .confirm-box p { color: var(--gray); font-size: 14px; margin-bottom: 24px; }
    .confirm-actions { display: flex; gap: 10px; justify-content: center; }

    @keyframes spin { to { transform: rotate(360deg); } }
    .spin { display: inline-block; animation: spin 0.8s linear infinite; }
  `]
})
export class CalendarComponent implements OnInit {
  championships = signal<Championship[]>([]);
  loading = signal(true);
  saving = signal(false);
  showModal = signal(false);
  showDeleteConfirm = signal(false);
  activeFilter = '';
  editingId: string | null = null;
  deletingItem: Championship | null = null;

  form: Championship = this.emptyForm();

  statusFilters = [
    { label: 'Semua', value: '', color: '' },
    { label: 'Akan Datang', value: 'Akan Datang', color: 'blue' },
    { label: 'Berlangsung', value: 'Berlangsung', color: 'green' },
    { label: 'Selesai', value: 'Selesai', color: 'gray' },
    { label: 'Dibatalkan', value: 'Dibatalkan', color: 'red' }
  ];

  get filteredChampionships(): Championship[] {
    if (!this.activeFilter) return this.championships();
    return this.championships().filter(c => c.status === this.activeFilter);
  }

  constructor(
    private championshipService: ChampionshipService,
    private toast: ToastService
  ) {}

  ngOnInit() { this.load(); }

  emptyForm(): Championship {
    return {
      title: '', description: '', date_start: '', date_end: '',
      location: '', category: '', organizer: '',
      status: 'Akan Datang', registration_deadline: '', contact: ''
    };
  }

  async load() {
    this.loading.set(true);
    try {
      this.championships.set(await this.championshipService.getAll());
    } catch (e: any) {
      this.toast.error('Gagal memuat data: ' + e.message);
    } finally {
      this.loading.set(false);
    }
  }

  setFilter(val: string) { this.activeFilter = val; }

  getCount(status: string): number {
    if (!status) return this.championships().length;
    return this.championships().filter(c => c.status === status).length;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'Akan Datang': 'upcoming', 'Berlangsung': 'ongoing',
      'Selesai': 'done', 'Dibatalkan': 'cancelled'
    };
    return map[status] || '';
  }

  getStatusBadge(status: string): string {
    const map: Record<string, string> = {
      'Akan Datang': 'badge-blue', 'Berlangsung': 'badge-green',
      'Selesai': 'badge-gray', 'Dibatalkan': 'badge-red'
    };
    return map[status] || 'badge-gray';
  }

  openModal(item?: Championship) {
    this.form = item ? { ...item } : this.emptyForm();
    this.editingId = item?.id ?? null;
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingId = null;
  }

  async save() {
    if (!this.form.title || !this.form.date_start || !this.form.date_end || !this.form.location) {
      this.toast.error('Harap isi semua field wajib!');
      return;
    }
    this.saving.set(true);
    try {
      const payload = { ...this.form };
      delete payload.id;
      delete payload.created_at;

      if (this.editingId) {
        await this.championshipService.update(this.editingId, payload);
        this.toast.success('Kejuaraan berhasil diperbarui!');
      } else {
        await this.championshipService.create(payload);
        this.toast.success('Kejuaraan berhasil ditambahkan!');
      }
      this.closeModal();
      this.load();
    } catch (e: any) {
      this.toast.error('Gagal menyimpan: ' + e.message);
    } finally {
      this.saving.set(false);
    }
  }

  confirmDelete(item: Championship) {
    this.deletingItem = item;
    this.showDeleteConfirm.set(true);
  }

  async deleteItem() {
    if (!this.deletingItem?.id) return;
    this.saving.set(true);
    try {
      await this.championshipService.delete(this.deletingItem.id);
      this.toast.success('Kejuaraan berhasil dihapus!');
      this.showDeleteConfirm.set(false);
      this.load();
    } catch (e: any) {
      this.toast.error('Gagal menghapus: ' + e.message);
    } finally {
      this.saving.set(false);
    }
  }

  formatDate(date: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  formatDateRange(start: string, end: string): string {
    if (!start) return '-';
    const s = new Date(start);
    const e = new Date(end);
    if (start === end) return this.formatDate(start);
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return `${s.toLocaleDateString('id-ID', opts)} – ${e.toLocaleDateString('id-ID', opts)}`;
  }
}
