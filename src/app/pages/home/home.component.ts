import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SiteSettingsService, HeroSlide } from '../../services/site-settings.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <div class="home-page">

      <!-- ══════════════════════════════════════════════
           HERO SECTION — foto bisa diedit via CRUD
           ══════════════════════════════════════════════ -->
      <section class="hero-section">
        <!-- Background image (foto slide aktif) -->
        <div class="hero-bg" [style.backgroundImage]="heroBg"></div>
        <div class="hero-overlay"></div>

        <!-- Edit hero button (floating) -->
        <button class="hero-edit-btn" (click)="openHeroManager()" title="Kelola foto hero">
          <span class="material-icons">photo_camera</span>
          <span>Atur Foto</span>
        </button>

        <!-- Slide dots (jika > 1 slide) -->
        @if (heroSlides().length > 1) {
          <div class="hero-dots">
            @for (s of heroSlides(); track s.id; let i = $index) {
              <button class="hero-dot" [class.active]="i === activeSlide" (click)="setSlide(i)"></button>
            }
          </div>
        }

        <!-- Hero content -->
        <div class="hero-content">
          <div class="hero-logo-wrap">
            <img src="assets/images/logo.jpeg" alt="POBSI" class="hero-logo" />
            <div class="hero-logo-ring"></div>
          </div>

          <div class="hero-text">
            @if (activeHeroSlide) {
              <h1 class="hero-title">{{ activeHeroSlide.title }}</h1>
              <p class="hero-subtitle">{{ activeHeroSlide.subtitle }}</p>
            } @else {
              <h1 class="hero-title">POBSI <span>Sulawesi Tengah</span></h1>
              <p class="hero-subtitle">Persatuan Olahraga Biliar Seluruh Indonesia<br>Pengurus Provinsi Sulawesi Tengah</p>
            }
          </div>

          <div class="hero-actions">
            <a routerLink="/berita" class="btn-hero-primary">
              <span class="material-icons">article</span> Berita Terkini
            </a>
            <a routerLink="/kalender" class="btn-hero-outline">
              <span class="material-icons">event</span> Kalender Kejuaraan
            </a>
          </div>
        </div>

        <!-- Wave bottom -->
        <div class="hero-wave">
          <svg viewBox="0 0 1440 72" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,36 C240,72 480,0 720,36 C960,72 1200,0 1440,36 L1440,72 L0,72 Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════
           STATS BAR
           ══════════════════════════════════════════════ -->
      <section class="stats-section">
        <div class="container">
          <div class="stats-grid">
            @for (s of stats; track s.label) {
              <div class="stat-card">
                <div class="stat-icon-wrap">
                  <span class="material-icons">{{ s.icon }}</span>
                </div>
                <div class="stat-body">
                  <div class="stat-value">{{ s.value }}</div>
                  <div class="stat-label">{{ s.label }}</div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════
           ABOUT / PROFIL
           ══════════════════════════════════════════════ -->
      <section class="about-section">
        <div class="container">
          <div class="about-wrap">

            <div class="about-img-side">
              <div class="about-img-frame">
                <img src="assets/images/logo.jpeg" alt="POBSI Sulteng" />
              </div>
              <div class="about-badge-year">
                <span class="badge-year-num">2024</span>
                <span class="badge-year-txt">Aktif & Berprestasi</span>
              </div>
              <div class="about-accent-dot dot-1"></div>
              <div class="about-accent-dot dot-2"></div>
            </div>

            <div class="about-text-side">
              <div class="section-eyebrow">Tentang Kami</div>
              <h2 class="section-heading">POBSI <span>Sulawesi Tengah</span></h2>
              <div class="heading-line"></div>
              <p class="about-lead">
                Persatuan Olahraga Biliar Seluruh Indonesia (POBSI) Provinsi Sulawesi Tengah adalah
                organisasi resmi yang bertugas membina dan mengembangkan olahraga biliar di wilayah Sulawesi Tengah.
              </p>
              <p class="about-body">
                Berdiri sebagai bagian dari POBSI Nasional, kami berkomitmen untuk mencetak atlet-atlet
                berprestasi, menyelenggarakan kejuaraan berkualitas, dan memajukan olahraga biliar
                di tingkat lokal maupun nasional.
              </p>
              <div class="about-highlights">
                @for (h of highlights; track h.title) {
                  <div class="highlight-item">
                    <div class="highlight-icon">
                      <span class="material-icons">{{ h.icon }}</span>
                    </div>
                    <div class="highlight-text">
                      <strong>{{ h.title }}</strong>
                      <p>{{ h.desc }}</p>
                    </div>
                  </div>
                }
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════
           QUICK ACCESS MENU
           ══════════════════════════════════════════════ -->
      <section class="menu-section">
        <div class="container">
          <div class="section-center">
            <div class="section-eyebrow">Fitur</div>
            <h2 class="section-heading">Akses <span>Cepat</span></h2>
            <div class="heading-line center"></div>
          </div>

          <div class="menu-grid">
            @for (m of menus; track m.route) {
              <a [routerLink]="m.route" class="menu-card">
                <div class="menu-card-icon-wrap" [style.background]="m.gradient">
                  <span class="material-icons">{{ m.icon }}</span>
                </div>
                <div class="menu-card-body">
                  <h3>{{ m.title }}</h3>
                  <p>{{ m.desc }}</p>
                </div>
                <div class="menu-card-footer">
                  <span class="menu-link-text">Buka</span>
                  <span class="material-icons">arrow_forward</span>
                </div>
              </a>
            }
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════
           CONTACT STRIP
           ══════════════════════════════════════════════ -->
      <section class="contact-strip">
        <div class="container">
          <div class="contact-strip-inner">
            <div class="contact-strip-text">
              <h3>Ada pertanyaan? Hubungi kami</h3>
              <p>Tim POBSI Sulawesi Tengah siap membantu Anda</p>
            </div>
            <div class="contact-strip-items">
              <div class="contact-chip">
                <span class="material-icons">location_on</span> Palu, Sulawesi Tengah
              </div>
              <div class="contact-chip">
                <span class="material-icons">email</span> pobsi.sulteng&#64;gmail.com
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>

    <!-- ══════════════════════════════════════════════
         MODAL: KELOLA FOTO HERO
         ══════════════════════════════════════════════ -->
    @if (showHeroManager()) {
      <div class="modal-overlay" (click)="closeHeroManager()">
        <div class="modal-box modal-wide" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div>
              <h3 class="modal-title">Kelola Foto Hero / Banner</h3>
              <p style="font-size:13px;color:var(--gray);margin-top:2px">Foto yang ditampilkan di halaman utama</p>
            </div>
            <button class="modal-close" (click)="closeHeroManager()">
              <span class="material-icons">close</span>
            </button>
          </div>

          <div class="modal-body">
            <!-- Existing slides list -->
            @if (heroSlides().length > 0) {
              <div class="slides-list">
                @for (slide of heroSlides(); track slide.id; let i = $index) {
                  <div class="slide-item" [class.active-slide]="i === activeSlide">
                    <div class="slide-thumb">
                      @if (slide.photo_url) {
                        <img [src]="slide.photo_url" [alt]="slide.title" />
                      } @else {
                        <div class="slide-thumb-empty">
                          <span class="material-icons">image</span>
                        </div>
                      }
                      @if (i === activeSlide) {
                        <div class="slide-active-badge">Aktif</div>
                      }
                    </div>
                    <div class="slide-info">
                      <strong>{{ slide.title || 'Tanpa judul' }}</strong>
                      <span>{{ slide.subtitle || '-' }}</span>
                      <div class="slide-badge-row">
                        <span class="badge" [class]="slide.is_active ? 'badge-green' : 'badge-gray'">
                          {{ slide.is_active ? 'Aktif' : 'Non-aktif' }}
                        </span>
                        <span class="badge badge-gray">Urutan: {{ slide.sort_order }}</span>
                      </div>
                    </div>
                    <div class="slide-actions">
                      <button class="btn btn-sm btn-secondary btn-icon" (click)="editSlide(slide)" title="Edit">
                        <span class="material-icons" style="font-size:16px">edit</span>
                      </button>
                      <button class="btn btn-sm btn-danger btn-icon" (click)="deleteSlide(slide)" title="Hapus">
                        <span class="material-icons" style="font-size:16px">delete</span>
                      </button>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="empty-state" style="padding:30px">
                <span class="material-icons">photo_library</span>
                <p>Belum ada foto hero. Tambahkan foto pertama!</p>
              </div>
            }

            <div class="slide-form-divider">
              <span>{{ editingSlideId ? 'Edit Slide' : '+ Tambah Slide Baru' }}</span>
            </div>

            <!-- FORM: Add/Edit slide -->
            <div class="slide-form">
              <!-- Photo upload -->
              <div class="form-group">
                <label class="form-label">Foto Background *</label>
                @if (slidePhotoPreview) {
                  <div class="slide-preview-wrap">
                    <img [src]="slidePhotoPreview" alt="Preview" class="slide-preview-img" />
                    <button class="remove-slide-photo" (click)="removeSlidePhoto()">
                      <span class="material-icons">close</span>
                    </button>
                  </div>
                } @else {
                  <label class="image-upload-area" for="slidePhoto" style="cursor:pointer">
                    <span class="material-icons">add_photo_alternate</span>
                    <span style="font-size:14px;color:var(--gray)">Klik untuk upload foto hero</span>
                    <span style="font-size:12px;color:#aaa">JPG, PNG — Resolusi landscape (1920×1080 ideal)</span>
                  </label>
                }
                <input type="file" id="slidePhoto" accept="image/*" (change)="onSlidePhotoChange($event)" style="display:none" />
              </div>

              <div class="grid-2">
                <div class="form-group">
                  <label class="form-label">Judul (opsional)</label>
                  <input class="form-control" [(ngModel)]="slideForm.title" placeholder="Judul hero" />
                </div>
                <div class="form-group">
                  <label class="form-label">Urutan</label>
                  <input class="form-control" type="number" [(ngModel)]="slideForm.sort_order" min="1" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Subtitle (opsional)</label>
                <input class="form-control" [(ngModel)]="slideForm.subtitle" placeholder="Teks kecil di bawah judul" />
              </div>

              <div class="form-group">
                <label class="form-label toggle-label">
                  <input type="checkbox" [(ngModel)]="slideForm.is_active" style="width:auto;margin-right:8px;accent-color:var(--red)" />
                  Tampilkan slide ini
                </label>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            @if (editingSlideId) {
              <button class="btn btn-secondary" (click)="cancelEditSlide()">Batal Edit</button>
            }
            <button class="btn btn-secondary" (click)="closeHeroManager()">Tutup</button>
            <button class="btn btn-primary" (click)="saveSlide()" [disabled]="savingSlide()">
              @if (savingSlide()) {
                <span class="material-icons spin">autorenew</span> Menyimpan...
              } @else {
                <span class="material-icons">{{ editingSlideId ? 'save' : 'add_photo_alternate' }}</span>
                {{ editingSlideId ? 'Simpan Perubahan' : 'Tambah Foto' }}
              }
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .home-page { padding-top: var(--navbar-height); }

    /* ─── HERO ─────────────────────────────────── */
    .hero-section {
      position: relative;
      min-height: 92vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background: #1a0005;
    }
    .hero-bg {
      position: absolute; inset: 0;
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      transition: background-image 0.6s ease;
    }
    .hero-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(
        160deg,
        rgba(150, 0, 20, 0.82) 0%,
        rgba(100, 0, 10, 0.75) 40%,
        rgba(0, 0, 0, 0.65) 100%
      );
    }
    .hero-edit-btn {
      position: absolute;
      top: 16px; right: 16px;
      display: flex; align-items: center; gap: 6px;
      background: rgba(0,0,0,0.45);
      color: rgba(255,255,255,0.85);
      border: 1px solid rgba(255,255,255,0.25);
      border-radius: 20px;
      padding: 7px 14px;
      font-size: 13px; font-weight: 600;
      cursor: pointer;
      backdrop-filter: blur(6px);
      transition: all 0.2s;
      z-index: 10;
    }
    .hero-edit-btn:hover { background: var(--red); color: #fff; border-color: var(--red); }
    .hero-edit-btn .material-icons { font-size: 18px; }

    .hero-dots {
      position: absolute;
      bottom: 80px;
      display: flex; gap: 8px; z-index: 10;
    }
    .hero-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: rgba(255,255,255,0.4);
      border: none; cursor: pointer;
      transition: all 0.2s;
    }
    .hero-dot.active { background: var(--yellow); width: 22px; border-radius: 4px; }

    .hero-content {
      position: relative;
      z-index: 5;
      text-align: center;
      padding: 40px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }
    .hero-logo-wrap {
      position: relative;
      display: inline-block;
    }
    .hero-logo {
      width: 120px; height: 120px;
      border-radius: 50%; object-fit: cover;
      border: 4px solid var(--yellow);
      box-shadow: 0 0 0 8px rgba(255,215,0,0.15), 0 12px 40px rgba(0,0,0,0.4);
    }
    @media (min-width: 640px) {
      .hero-logo { width: 150px; height: 150px; }
    }
    .hero-logo-ring {
      position: absolute; inset: -12px;
      border-radius: 50%;
      border: 2px dashed rgba(255,215,0,0.35);
      animation: rotateRing 25s linear infinite;
    }
    @keyframes rotateRing { to { transform: rotate(360deg); } }

    .hero-text { max-width: 640px; }
    .hero-title {
      font-family: var(--font-heading);
      font-size: clamp(2rem, 8vw, 3.8rem);
      color: #fff; font-weight: 700;
      line-height: 1.05; margin-bottom: 12px;
      text-shadow: 0 2px 12px rgba(0,0,0,0.4);
    }
    .hero-title span { color: var(--yellow); }
    .hero-subtitle {
      font-size: clamp(14px, 3vw, 17px);
      color: rgba(255,255,255,0.78);
      line-height: 1.65;
    }
    .hero-actions {
      display: flex; gap: 12px; flex-wrap: wrap;
      justify-content: center;
    }
    .btn-hero-primary {
      display: inline-flex; align-items: center; gap: 8px;
      background: var(--yellow); color: #1a1a1a;
      font-family: var(--font-heading); font-weight: 700;
      font-size: 15px; padding: 13px 26px;
      border-radius: 10px;
      letter-spacing: 0.3px;
      transition: all 0.2s;
      box-shadow: 0 4px 16px rgba(255,215,0,0.3);
    }
    .btn-hero-primary:hover { background: #e6c200; transform: translateY(-2px); }
    .btn-hero-outline {
      display: inline-flex; align-items: center; gap: 8px;
      background: transparent;
      color: rgba(255,255,255,0.9);
      border: 2px solid rgba(255,255,255,0.45);
      font-family: var(--font-heading); font-weight: 600;
      font-size: 15px; padding: 13px 26px;
      border-radius: 10px; transition: all 0.2s;
    }
    .btn-hero-outline:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.8); }
    .hero-wave {
      position: absolute; bottom: 0; left: 0; right: 0; line-height: 0;
    }
    .hero-wave svg { display: block; width: 100%; height: 48px; }

    /* ─── STATS ─────────────────────────────────── */
    .stats-section { background: #f9fafb; padding: 36px 0 40px; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
    }
    @media (min-width: 640px) {
      .stats-grid { grid-template-columns: repeat(4, 1fr); }
    }
    .stat-card {
      background: #fff;
      border-radius: 14px;
      border: 1px solid #e5e7eb;
      padding: 20px 16px;
      display: flex;
      align-items: center;
      gap: 14px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      transition: all 0.2s;
    }
    .stat-card:hover { box-shadow: 0 6px 20px rgba(196,30,58,0.1); transform: translateY(-2px); }
    .stat-icon-wrap {
      width: 48px; height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--red), var(--red-dark));
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .stat-icon-wrap .material-icons { color: #fff; font-size: 22px; }
    .stat-value {
      font-family: var(--font-heading);
      font-size: 1.6rem; font-weight: 700; color: var(--dark);
      line-height: 1;
    }
    .stat-label { font-size: 12px; color: var(--gray); margin-top: 3px; }

    /* ─── ABOUT ─────────────────────────────────── */
    .about-section { padding: 72px 0; background: #fff; }
    .about-wrap {
      display: grid;
      grid-template-columns: 1fr;
      gap: 48px; align-items: center;
    }
    @media (min-width: 768px) {
      .about-wrap { grid-template-columns: 1fr 1.2fr; }
    }

    /* Image side */
    .about-img-side {
      position: relative;
      display: flex;
      justify-content: center;
      padding: 20px;
    }
    .about-img-frame {
      width: 260px; height: 260px;
      border-radius: 50%;
      overflow: hidden;
      border: 6px solid var(--red);
      box-shadow: 0 16px 48px rgba(196,30,58,0.2);
      position: relative; z-index: 2;
    }
    @media (min-width: 640px) {
      .about-img-frame { width: 300px; height: 300px; }
    }
    .about-img-frame img { width: 100%; height: 100%; object-fit: cover; }
    .about-badge-year {
      position: absolute;
      bottom: 20px; right: 0;
      background: var(--yellow);
      border-radius: 12px;
      padding: 12px 18px;
      text-align: center;
      z-index: 3;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }
    .badge-year-num {
      display: block;
      font-family: var(--font-heading);
      font-size: 1.4rem; font-weight: 800; color: #1a1a1a;
      line-height: 1;
    }
    .badge-year-txt { font-size: 10px; font-weight: 700; color: #3a3a00; text-transform: uppercase; letter-spacing: 0.5px; }
    .about-accent-dot {
      position: absolute;
      border-radius: 50%;
      background: rgba(196,30,58,0.12);
    }
    .dot-1 { width: 60px; height: 60px; top: 0; left: 20px; }
    .dot-2 { width: 32px; height: 32px; bottom: 60px; left: 30px; background: rgba(255,215,0,0.25); }

    /* Text side */
    .section-eyebrow {
      font-size: 12px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 2px;
      color: var(--red); margin-bottom: 8px;
    }
    .section-heading {
      font-family: var(--font-heading);
      font-size: clamp(1.6rem, 4vw, 2.2rem);
      color: var(--dark); margin-bottom: 10px;
    }
    .section-heading span { color: var(--red); }
    .heading-line {
      width: 48px; height: 4px;
      background: linear-gradient(90deg, var(--red), var(--yellow));
      border-radius: 2px; margin-bottom: 22px;
    }
    .heading-line.center { margin: 0 auto 28px; }
    .section-center { text-align: center; margin-bottom: 32px; }

    .about-lead {
      font-size: 16px; color: #374151; line-height: 1.75;
      margin-bottom: 14px; font-weight: 500;
    }
    .about-body { font-size: 15px; color: var(--gray); line-height: 1.7; margin-bottom: 28px; }

    .about-highlights { display: flex; flex-direction: column; gap: 16px; }
    .highlight-item { display: flex; gap: 14px; align-items: flex-start; }
    .highlight-icon {
      width: 40px; height: 40px; border-radius: 10px;
      background: rgba(196,30,58,0.08);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .highlight-icon .material-icons { color: var(--red); font-size: 20px; }
    .highlight-text strong { display: block; font-size: 15px; margin-bottom: 3px; }
    .highlight-text p { font-size: 13px; color: var(--gray); margin: 0; line-height: 1.5; }

    /* ─── MENU SECTION ──────────────────────────── */
    .menu-section { padding: 64px 0; background: #f9fafb; }
    .menu-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }
    @media (min-width: 480px) { .menu-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 900px) { .menu-grid { grid-template-columns: repeat(4, 1fr); } }

    .menu-card {
      background: #fff;
      border-radius: 16px;
      border: 1.5px solid #e5e7eb;
      text-decoration: none; color: var(--dark);
      transition: all 0.22s;
      display: flex; flex-direction: column;
      overflow: hidden;
    }
    .menu-card:hover {
      border-color: var(--red);
      box-shadow: 0 8px 28px rgba(196,30,58,0.12);
      transform: translateY(-4px);
    }
    .menu-card-icon-wrap {
      height: 72px;
      display: flex; align-items: center; justify-content: center;
    }
    .menu-card-icon-wrap .material-icons { color: #fff; font-size: 30px; }
    .menu-card-body {
      padding: 18px 18px 12px;
      flex: 1;
    }
    .menu-card-body h3 {
      font-family: var(--font-heading);
      font-size: 1rem; margin-bottom: 6px;
    }
    .menu-card-body p { font-size: 13px; color: var(--gray); line-height: 1.5; }
    .menu-card-footer {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 18px 16px;
      font-size: 13px; font-weight: 700; color: var(--red);
    }
    .menu-card-footer .material-icons { font-size: 18px; transition: transform 0.2s; }
    .menu-card:hover .menu-card-footer .material-icons { transform: translateX(4px); }

    /* ─── CONTACT STRIP ─────────────────────────── */
    .contact-strip {
      background: linear-gradient(135deg, var(--dark), var(--dark-2));
      padding: 40px 0;
    }
    .contact-strip-inner {
      display: flex; flex-direction: column; gap: 20px;
    }
    @media (min-width: 640px) {
      .contact-strip-inner { flex-direction: row; align-items: center; justify-content: space-between; }
    }
    .contact-strip-text h3 {
      font-family: var(--font-heading);
      font-size: 1.25rem; color: var(--yellow); margin-bottom: 4px;
    }
    .contact-strip-text p { font-size: 14px; color: rgba(255,255,255,0.55); }
    .contact-strip-items { display: flex; flex-wrap: wrap; gap: 10px; }
    .contact-chip {
      display: flex; align-items: center; gap: 8px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.12);
      color: rgba(255,255,255,0.8);
      padding: 10px 16px; border-radius: 10px; font-size: 13px;
    }
    .contact-chip .material-icons { font-size: 18px; color: var(--yellow); }

    /* ─── HERO MANAGER MODAL ─────────────────────── */
    @media (min-width: 640px) { .modal-wide { max-width: 680px; } }
    .slides-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
    .slide-item {
      display: flex; align-items: center; gap: 12px;
      padding: 12px;
      border: 2px solid var(--border);
      border-radius: var(--radius);
      background: var(--gray-light);
      transition: border-color 0.2s;
    }
    .slide-item.active-slide { border-color: var(--red); background: rgba(196,30,58,0.04); }
    .slide-thumb {
      position: relative;
      width: 80px; height: 52px;
      border-radius: 8px; overflow: hidden;
      flex-shrink: 0; background: #ddd;
    }
    .slide-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .slide-thumb-empty {
      width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      color: #aaa;
    }
    .slide-thumb-empty .material-icons { font-size: 22px; }
    .slide-active-badge {
      position: absolute; top: 4px; left: 4px;
      background: var(--red); color: #fff;
      font-size: 9px; font-weight: 700;
      padding: 2px 6px; border-radius: 4px;
    }
    .slide-info { flex: 1; min-width: 0; }
    .slide-info strong { display: block; font-size: 14px; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .slide-info span { display: block; font-size: 12px; color: var(--gray); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .slide-badge-row { display: flex; gap: 6px; margin-top: 6px; }
    .slide-actions { display: flex; gap: 6px; flex-shrink: 0; }
    .slide-form-divider {
      text-align: center; position: relative;
      margin: 20px 0 16px;
    }
    .slide-form-divider::before {
      content: ''; position: absolute;
      top: 50%; left: 0; right: 0;
      height: 1px; background: var(--border);
    }
    .slide-form-divider span {
      position: relative;
      background: #fff;
      padding: 0 12px;
      font-size: 13px; font-weight: 700; color: var(--gray);
    }
    .slide-form { background: var(--gray-light); border-radius: var(--radius); padding: 18px; }
    .slide-preview-wrap {
      position: relative; width: 100%;
    }
    .slide-preview-img {
      width: 100%; height: 180px; object-fit: cover;
      border-radius: var(--radius); display: block;
    }
    .remove-slide-photo {
      position: absolute; top: 8px; right: 8px;
      background: rgba(0,0,0,0.6); color: #fff;
      border: none; border-radius: 50%;
      width: 28px; height: 28px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-size: 16px;
    }
    .remove-slide-photo .material-icons { font-size: 16px; }

    .toggle-label { display: flex; align-items: center; cursor: pointer; font-size: 14px; font-weight: 600; }

    @keyframes spin { to { transform: rotate(360deg); } }
    .spin { display: inline-block; animation: spin 0.8s linear infinite; }
  `]
})
export class HomeComponent implements OnInit {
  heroSlides = signal<HeroSlide[]>([]);
  showHeroManager = signal(false);
  savingSlide = signal(false);
  activeSlide = 0;
  editingSlideId: string | null = null;
  slidePhotoFile: File | null = null;
  slidePhotoPreview: string | null = null;

  slideForm: HeroSlide = this.emptySlideForm();

  get heroBg(): string {
    const slide = this.heroSlides().find((s, i) => i === this.activeSlide && s.photo_url);
    return slide?.photo_url ? `url(${slide.photo_url})` : 'linear-gradient(135deg, #8b0000, #1a0005)';
  }

  get activeHeroSlide(): HeroSlide | null {
    return this.heroSlides()[this.activeSlide] ?? null;
  }

  stats = [
    { icon: 'people',         value: '150+', label: 'Atlet Terdaftar' },
    { icon: 'emoji_events',   value: '25+',  label: 'Kejuaraan' },
    { icon: 'business',       value: '12',   label: 'Klub Aktif' },
    { icon: 'star',           value: '8',    label: 'Prestasi Nasional' },
  ];

  highlights = [
    { icon: 'sports',         title: 'Pembinaan Atlet', desc: 'Program latihan terstruktur untuk melahirkan atlet biliar berprestasi tingkat nasional.' },
    { icon: 'emoji_events',   title: 'Kejuaraan Rutin', desc: 'Menyelenggarakan kompetisi berkualitas mulai tingkat kota hingga provinsi.' },
    { icon: 'handshake',      title: 'Solidaritas',     desc: 'Mempererat hubungan antar klub dan atlet seluruh Sulawesi Tengah.' },
  ];

  menus = [
    { route: '/organisasi', icon: 'account_tree', title: 'Struktur Organisasi',   desc: 'Susunan pengurus POBSI Sulawesi Tengah.',       gradient: 'linear-gradient(135deg, #7c3aed, #5b21b6)' },
    { route: '/atlet',      icon: 'people',       title: 'Data Atlet',             desc: 'Kelola data lengkap seluruh atlet biliar.',     gradient: 'linear-gradient(135deg, #c41e3a, #9e1830)' },
    { route: '/kalender',   icon: 'calendar_month',title: 'Kalender Kejuaraan',   desc: 'Jadwal dan info kompetisi yang akan datang.',   gradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)' },
    { route: '/berita',     icon: 'article',      title: 'Berita & Informasi',    desc: 'Berita terkini dan pengumuman POBSI Sulteng.',  gradient: 'linear-gradient(135deg, #16a34a, #15803d)' },
  ];

  private slideTimer: any;

  constructor(
    private siteSettings: SiteSettingsService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadSlides();
    this.startAutoSlide();
  }

  async loadSlides() {
    try {
      const slides = await this.siteSettings.getSlides();
      this.heroSlides.set(slides.filter(s => s.is_active));
    } catch {}
  }

  startAutoSlide() {
    this.slideTimer = setInterval(() => {
      if (this.heroSlides().length > 1) {
        this.activeSlide = (this.activeSlide + 1) % this.heroSlides().length;
      }
    }, 5000);
  }

  setSlide(i: number) { this.activeSlide = i; }

  emptySlideForm(): HeroSlide {
    return { title: '', subtitle: '', sort_order: 1, is_active: true };
  }

  openHeroManager() {
    this.loadAllSlides();
    this.showHeroManager.set(true);
  }

  async loadAllSlides() {
    try {
      this.heroSlides.set(await this.siteSettings.getSlides());
    } catch {}
  }

  closeHeroManager() {
    this.showHeroManager.set(false);
    this.cancelEditSlide();
    this.loadSlides();
  }

  editSlide(slide: HeroSlide) {
    this.editingSlideId = slide.id ?? null;
    this.slideForm = { ...slide };
    this.slidePhotoPreview = slide.photo_url ?? null;
    this.slidePhotoFile = null;
  }

  cancelEditSlide() {
    this.editingSlideId = null;
    this.slideForm = this.emptySlideForm();
    this.slidePhotoPreview = null;
    this.slidePhotoFile = null;
  }

  onSlidePhotoChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.slidePhotoFile = file;
    const reader = new FileReader();
    reader.onload = e => this.slidePhotoPreview = e.target?.result as string;
    reader.readAsDataURL(file);
  }

  removeSlidePhoto() {
    this.slidePhotoFile = null;
    this.slidePhotoPreview = null;
    this.slideForm.photo_url = undefined;
  }

  async saveSlide() {
    this.savingSlide.set(true);
    try {
      const payload = { ...this.slideForm };
      delete payload.id;
      delete payload.created_at;

      if (this.editingSlideId) {
        await this.siteSettings.updateSlide(this.editingSlideId, payload, this.slidePhotoFile ?? undefined);
        this.toast.success('Slide berhasil diperbarui!');
      } else {
        await this.siteSettings.createSlide(payload, this.slidePhotoFile ?? undefined);
        this.toast.success('Foto hero berhasil ditambahkan!');
      }
      this.cancelEditSlide();
      this.loadAllSlides();
    } catch (e: any) {
      this.toast.error('Gagal menyimpan: ' + e.message);
    } finally {
      this.savingSlide.set(false);
    }
  }

  async deleteSlide(slide: HeroSlide) {
    if (!confirm(`Hapus slide "${slide.title || 'ini'}"?`)) return;
    try {
      await this.siteSettings.deleteSlide(slide.id!);
      this.toast.success('Slide dihapus!');
      this.loadAllSlides();
    } catch (e: any) {
      this.toast.error('Gagal menghapus: ' + e.message);
    }
  }
}
