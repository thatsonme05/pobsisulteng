import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AthleteService } from '../../services/athlete.service';
import { ToastService } from '../../services/toast.service';
import { Athlete } from '../../models';

@Component({
  selector: 'app-athletes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-content">

      <!-- BANNER -->
      <div class="page-banner">
        <div class="container">
          <h1><span class="material-icons" style="font-size:1.6rem;vertical-align:middle;margin-right:8px">people</span>Data Atlet</h1>
          <p>Kelola data atlet biliar POBSI Sulawesi Tengah</p>
        </div>
      </div>

      <div class="container">

        <!-- TOOLBAR -->
        <div class="toolbar">
          <div class="search-box">
            <span class="material-icons">search</span>
            <input type="text" placeholder="Cari nama atlet..." [(ngModel)]="searchQuery" (ngModelChange)="onSearch()" />
          </div>
          <div class="toolbar-right">
            <select class="form-control filter-select" [(ngModel)]="filterGender" (ngModelChange)="loadAthletes()">
              <option value="">Semua Gender</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
            <button class="btn btn-primary" (click)="openModal()">
              <span class="material-icons">add</span> Tambah Atlet
            </button>
          </div>
        </div>

        <!-- STATS BAR -->
        <div class="stats-bar">
          <div class="stat-pill">
            <span class="material-icons">people</span>
            Total: <strong>{{ athletes().length }}</strong>
          </div>
          <div class="stat-pill green">
            <span class="material-icons">check_circle</span>
            Aktif: <strong>{{ activeCount }}</strong>
          </div>
        </div>

        <!-- LOADING -->
        @if (loading()) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Memuat data atlet...</p>
          </div>
        }

        <!-- TABLE (desktop) -->
        @if (!loading() && athletes().length > 0) {
          <div class="table-responsive desktop-table">
            <table class="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Foto</th>
                  <th>Nama</th>
                  <th>NIK</th>
                  <th>Tempat/Tgl Lahir</th>
                  <th>Gender</th>
                  <th>Kategori</th>
                  <th>Klub</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                @for (a of athletes(); track a.id; let i = $index) {
                  <tr>
                    <td>{{ i + 1 }}</td>
                    <td>
                      @if (a.photo_url) {
                        <img [src]="a.photo_url" class="avatar" [alt]="a.name" />
                      } @else {
                        <div class="avatar-placeholder">{{ a.name[0] }}</div>
                      }
                    </td>
                    <td><strong>{{ a.name }}</strong></td>
                    <td><span class="mono">{{ a.nik }}</span></td>
                    <td>{{ a.birth_place }}, {{ formatDate(a.birth_date) }}</td>
                    <td>
                      <span class="badge" [class]="a.gender === 'Laki-laki' ? 'badge-blue' : 'badge-red'">
                        {{ a.gender }}
                      </span>
                    </td>
                    <td>{{ a.category }}</td>
                    <td>{{ a.club }}</td>
                    <td>
                      <span class="badge" [class]="a.status === 'Aktif' ? 'badge-green' : 'badge-gray'">
                        {{ a.status }}
                      </span>
                    </td>
                    <td>
                      <div class="action-btns">
                        <button class="btn btn-sm btn-secondary btn-icon" (click)="openModal(a)" title="Edit">
                          <span class="material-icons" style="font-size:16px">edit</span>
                        </button>
                        <button class="btn btn-sm btn-danger btn-icon" (click)="confirmDelete(a)" title="Hapus">
                          <span class="material-icons" style="font-size:16px">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- CARDS (mobile) -->
          <div class="athletes-cards mobile-cards">
            @for (a of athletes(); track a.id) {
              <div class="athlete-card">
                <div class="athlete-card-header">
                  @if (a.photo_url) {
                    <img [src]="a.photo_url" class="athlete-photo" [alt]="a.name" />
                  } @else {
                    <div class="athlete-photo-placeholder">{{ a.name[0] }}</div>
                  }
                  <div class="athlete-info">
                    <h4>{{ a.name }}</h4>
                    <p class="mono small">NIK: {{ a.nik }}</p>
                    <div class="athlete-badges">
                      <span class="badge badge-sm" [class]="a.gender === 'Laki-laki' ? 'badge-blue' : 'badge-red'">{{ a.gender }}</span>
                      <span class="badge badge-sm" [class]="a.status === 'Aktif' ? 'badge-green' : 'badge-gray'">{{ a.status }}</span>
                    </div>
                  </div>
                  <div class="athlete-card-actions">
                    <button class="btn btn-sm btn-secondary btn-icon" (click)="openModal(a)">
                      <span class="material-icons" style="font-size:16px">edit</span>
                    </button>
                    <button class="btn btn-sm btn-danger btn-icon" (click)="confirmDelete(a)">
                      <span class="material-icons" style="font-size:16px">delete</span>
                    </button>
                  </div>
                </div>
                <div class="athlete-card-body">
                  <div class="info-row"><span class="material-icons">cake</span> {{ a.birth_place }}, {{ formatDate(a.birth_date) }}</div>
                  <div class="info-row"><span class="material-icons">sports</span> {{ a.category }}</div>
                  <div class="info-row"><span class="material-icons">groups</span> {{ a.club }}</div>
                  <div class="info-row"><span class="material-icons">phone</span> {{ a.phone }}</div>
                </div>
              </div>
            }
          </div>
        }

        <!-- EMPTY -->
        @if (!loading() && athletes().length === 0) {
          <div class="empty-state">
            <span class="material-icons">person_off</span>
            <h3>Belum Ada Data Atlet</h3>
            <p>Tambahkan data atlet pertama dengan menekan tombol di atas.</p>
          </div>
        }

      </div>
    </div>

    <!-- MODAL -->
    @if (showModal()) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">{{ editingId ? 'Edit Atlet' : 'Tambah Atlet Baru' }}</h3>
            <button class="modal-close" (click)="closeModal()">
              <span class="material-icons">close</span>
            </button>
          </div>
          <div class="modal-body">

            <!-- Photo Upload -->
            <div class="form-group">
              <label class="form-label">Foto Atlet</label>
              <div class="photo-upload-wrap">
                @if (photoPreview) {
                  <div class="photo-preview-circle">
                    <img [src]="photoPreview" alt="Preview" />
                    <button class="remove-photo" (click)="removePhoto()">
                      <span class="material-icons">close</span>
                    </button>
                  </div>
                } @else {
                  <label class="photo-upload-btn" for="photoInput">
                    <span class="material-icons">add_a_photo</span>
                    <span>Upload Foto</span>
                  </label>
                }
                <input type="file" id="photoInput" accept="image/*" (change)="onPhotoChange($event)" style="display:none" />
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Nama Lengkap *</label>
                <input class="form-control" [(ngModel)]="form.name" placeholder="Nama lengkap" />
              </div>
              <div class="form-group">
                <label class="form-label">NIK *</label>
                <input class="form-control" [(ngModel)]="form.nik" placeholder="16 digit NIK" maxlength="16" />
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Tempat Lahir *</label>
                <input class="form-control" [(ngModel)]="form.birth_place" placeholder="Kota/kabupaten" />
              </div>
              <div class="form-group">
                <label class="form-label">Tanggal Lahir *</label>
                <input class="form-control" type="date" [(ngModel)]="form.birth_date" />
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Jenis Kelamin *</label>
                <select class="form-control" [(ngModel)]="form.gender">
                  <option value="">Pilih gender</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Kategori *</label>
                <select class="form-control" [(ngModel)]="form.category">
                  <option value="">Pilih kategori</option>
                  <option value="Senior Putra">Senior Putra</option>
                  <option value="Senior Putri">Senior Putri</option>
                  <option value="Junior Putra">Junior Putra</option>
                  <option value="Junior Putri">Junior Putri</option>
                  <option value="Veteran">Veteran</option>
                </select>
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Klub *</label>
                <input class="form-control" [(ngModel)]="form.club" placeholder="Nama klub" />
              </div>
              <div class="form-group">
                <label class="form-label">No. Telepon</label>
                <input class="form-control" [(ngModel)]="form.phone" placeholder="08xx-xxxx-xxxx" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Alamat</label>
              <textarea class="form-control" [(ngModel)]="form.address" placeholder="Alamat lengkap" rows="2"></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Status *</label>
              <select class="form-control" [(ngModel)]="form.status">
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
              </select>
            </div>

          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeModal()" [disabled]="saving()">Batal</button>
            <button class="btn btn-primary" (click)="save()" [disabled]="saving()">
              @if (saving()) {
                <span class="material-icons spin">autorenew</span> Menyimpan...
              } @else {
                <span class="material-icons">save</span> {{ editingId ? 'Simpan Perubahan' : 'Tambah Atlet' }}
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
          <div class="confirm-icon">
            <span class="material-icons">warning</span>
          </div>
          <h3>Hapus Atlet?</h3>
          <p>Data atlet <strong>{{ deletingAthlete?.name }}</strong> akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.</p>
          <div class="confirm-actions">
            <button class="btn btn-secondary" (click)="showDeleteConfirm.set(false)">Batal</button>
            <button class="btn btn-danger" (click)="deleteAthlete()" [disabled]="saving()">
              @if (saving()) { Menghapus... } @else { Ya, Hapus }
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
      margin-bottom: 16px;
    }
    @media (min-width: 640px) {
      .toolbar { flex-direction: row; align-items: center; }
    }
    .toolbar-right {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    .filter-select {
      min-width: 140px;
      padding: 11px 36px 11px 12px;
      font-size: 14px;
    }
    .stats-bar {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .stat-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(196,30,58,0.08);
      color: var(--red);
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
    }
    .stat-pill.green { background: #dcfce7; color: #16a34a; }
    .stat-pill .material-icons { font-size: 16px; }
    .action-btns { display: flex; gap: 6px; }
    .mono { font-family: monospace; font-size: 13px; }
    .small { font-size: 12px; }

    /* Desktop table / mobile cards toggle */
    .desktop-table { display: none; }
    .mobile-cards { display: flex; flex-direction: column; gap: 12px; }
    @media (min-width: 768px) {
      .desktop-table { display: block; }
      .mobile-cards { display: none; }
    }

    /* ATHLETE CARD (mobile) */
    .athlete-card {
      background: var(--white);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .athlete-card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border-bottom: 1px solid var(--border);
    }
    .athlete-photo {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
      border: 2px solid var(--red);
    }
    .athlete-photo-placeholder {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--red), var(--yellow));
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-family: var(--font-heading);
      font-size: 1.4rem;
      font-weight: 700;
      flex-shrink: 0;
    }
    .athlete-info { flex: 1; min-width: 0; }
    .athlete-info h4 { font-size: 15px; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .athlete-badges { display: flex; gap: 6px; margin-top: 6px; flex-wrap: wrap; }
    .badge-sm { font-size: 11px; padding: 2px 8px; }
    .athlete-card-actions { display: flex; flex-direction: column; gap: 6px; }
    .athlete-card-body {
      padding: 12px 16px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .info-row {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: var(--gray);
    }
    .info-row .material-icons { font-size: 16px; color: var(--red); }

    /* PHOTO UPLOAD */
    .photo-upload-wrap { display: flex; align-items: center; gap: 16px; }
    .photo-upload-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 16px 24px;
      border: 2px dashed var(--border);
      border-radius: var(--radius);
      cursor: pointer;
      color: var(--gray);
      font-size: 13px;
      transition: all var(--transition);
    }
    .photo-upload-btn:hover { border-color: var(--red); color: var(--red); }
    .photo-upload-btn .material-icons { font-size: 28px; }
    .photo-preview-circle {
      position: relative;
      width: 80px;
      height: 80px;
    }
    .photo-preview-circle img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid var(--red);
    }
    .remove-photo {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: var(--red);
      color: white;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 12px;
    }
    .remove-photo .material-icons { font-size: 14px; }

    /* CONFIRM DIALOG */
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
export class AthletesComponent implements OnInit {
  athletes = signal<Athlete[]>([]);
  loading = signal(true);
  saving = signal(false);
  showModal = signal(false);
  showDeleteConfirm = signal(false);
  searchQuery = '';
  filterGender = '';
  editingId: string | null = null;
  deletingAthlete: Athlete | null = null;
  photoFile: File | null = null;
  photoPreview: string | null = null;

  form: Athlete = this.emptyForm();

  get activeCount() {
    return this.athletes().filter(a => a.status === 'Aktif').length;
  }

  constructor(
    private athleteService: AthleteService,
    private toast: ToastService
  ) {}

  ngOnInit() { this.loadAthletes(); }

  emptyForm(): Athlete {
    return {
      name: '', nik: '', birth_date: '', birth_place: '',
      gender: 'Laki-laki', category: '', club: '',
      address: '', phone: '', status: 'Aktif'
    };
  }

  async loadAthletes() {
    this.loading.set(true);
    try {
      let data = await this.athleteService.getAll(this.searchQuery);
      if (this.filterGender) {
        data = data.filter(a => a.gender === this.filterGender);
      }
      this.athletes.set(data);
    } catch (e: any) {
      this.toast.error('Gagal memuat data: ' + e.message);
    } finally {
      this.loading.set(false);
    }
  }

  onSearch() {
    clearTimeout((this as any)._searchTimer);
    (this as any)._searchTimer = setTimeout(() => this.loadAthletes(), 400);
  }

  openModal(athlete?: Athlete) {
    this.form = athlete ? { ...athlete } : this.emptyForm();
    this.editingId = athlete?.id ?? null;
    this.photoPreview = athlete?.photo_url ?? null;
    this.photoFile = null;
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingId = null;
    this.photoFile = null;
    this.photoPreview = null;
  }

  onPhotoChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.photoFile = file;
    const reader = new FileReader();
    reader.onload = e => this.photoPreview = e.target?.result as string;
    reader.readAsDataURL(file);
  }

  removePhoto() {
    this.photoFile = null;
    this.photoPreview = null;
    this.form.photo_url = undefined;
  }

  async save() {
    if (!this.form.name || !this.form.nik || !this.form.birth_date || !this.form.club) {
      this.toast.error('Harap isi semua field wajib!');
      return;
    }
    this.saving.set(true);
    try {
      const payload = { ...this.form };
      delete payload.id;
      delete payload.created_at;

      if (this.editingId) {
        await this.athleteService.update(this.editingId, payload, this.photoFile ?? undefined);
        this.toast.success('Data atlet berhasil diperbarui!');
      } else {
        await this.athleteService.create(payload, this.photoFile ?? undefined);
        this.toast.success('Atlet baru berhasil ditambahkan!');
      }
      this.closeModal();
      this.loadAthletes();
    } catch (e: any) {
      this.toast.error('Gagal menyimpan: ' + e.message);
    } finally {
      this.saving.set(false);
    }
  }

  confirmDelete(a: Athlete) {
    this.deletingAthlete = a;
    this.showDeleteConfirm.set(true);
  }

  async deleteAthlete() {
    if (!this.deletingAthlete?.id) return;
    this.saving.set(true);
    try {
      await this.athleteService.delete(this.deletingAthlete.id);
      this.toast.success('Atlet berhasil dihapus!');
      this.showDeleteConfirm.set(false);
      this.loadAthletes();
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
}
