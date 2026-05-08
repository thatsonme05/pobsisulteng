import { Component, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from './services/toast.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <!-- ═══════════════════════════════════════ NAVBAR ═══ -->
    <nav class="navbar" [class.scrolled]="scrolled">
      <div class="navbar-inner">

        <!-- Brand -->
        <a routerLink="/" class="navbar-brand" (click)="closeMenu()">
          <img src="assets/images/logo.jpeg" alt="POBSI" class="nav-logo" />
          <div class="nav-brand-text">
            <span class="nav-brand-main">POBSI</span>
            <span class="nav-brand-sub">Sulawesi Tengah</span>
          </div>
        </a>

        <!-- Desktop menu -->
        <div class="nav-links">
          @for (item of navItems; track item.route) {
            <a [routerLink]="item.route"
               routerLinkActive="active"
               [routerLinkActiveOptions]="{exact: item.route === '/'}"
               class="nav-link">
              {{ item.label }}
            </a>
          }
        </div>

        <!-- Hamburger -->
        <button class="hamburger" (click)="toggleMenu()" [class.open]="menuOpen" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>

    <!-- Mobile sidebar -->
    <div class="sidebar-overlay" [class.show]="menuOpen" (click)="closeMenu()"></div>
    <aside class="sidebar" [class.open]="menuOpen">
      <div class="sidebar-header">
        <img src="assets/images/logo.jpeg" alt="POBSI" class="sidebar-logo" />
        <div>
          <div class="sidebar-title">POBSI Sulteng</div>
          <div class="sidebar-subtitle">Menu Navigasi</div>
        </div>
        <button class="sidebar-close" (click)="closeMenu()">
          <span class="material-icons">close</span>
        </button>
      </div>
      <nav class="sidebar-nav">
        @for (item of navItems; track item.route) {
          <a [routerLink]="item.route"
             routerLinkActive="sidebar-active"
             [routerLinkActiveOptions]="{exact: item.route === '/'}"
             class="sidebar-link"
             (click)="closeMenu()">
            <span class="material-icons">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>
      <div class="sidebar-footer">
        <img src="assets/images/logo.jpeg" alt="POBSI" style="width:28px;height:28px;border-radius:50%;border:2px solid rgba(255,255,255,0.3)" />
        <span>&copy; {{ year }} POBSI Sulawesi Tengah</span>
      </div>
    </aside>

    <!-- Page Content -->
    <main class="main-content">
      <router-outlet />
    </main>

    <!-- Footer -->
    <footer class="site-footer">
      <div class="footer-top">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-col brand-col">
              <img src="assets/images/logo.jpeg" alt="POBSI" class="footer-logo" />
              <div>
                <div class="footer-org-name">POBSI Sulawesi Tengah</div>
                <div class="footer-org-sub">Persatuan Olahraga Biliar Seluruh Indonesia</div>
                <p class="footer-desc">Organisasi resmi pembina olahraga biliar di Provinsi Sulawesi Tengah.</p>
              </div>
            </div>
            <div class="footer-col">
              <div class="footer-col-title">Navigasi</div>
              <div class="footer-links">
                @for (item of navItems; track item.route) {
                  <a [routerLink]="item.route" class="footer-link">
                    <span class="material-icons">chevron_right</span>{{ item.label }}
                  </a>
                }
              </div>
            </div>
            <div class="footer-col">
              <div class="footer-col-title">Kontak</div>
              <div class="footer-contacts">
                <div class="footer-contact-item">
                  <span class="material-icons">location_on</span>
                  <span>Palu, Sulawesi Tengah</span>
                </div>
                <div class="footer-contact-item">
                  <span class="material-icons">email</span>
                  <span>pobsi.sulteng&#64;gmail.com</span>
                </div>
                <div class="footer-contact-item">
                  <span class="material-icons">language</span>
                  <span>www.pobsisulteng.org</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container">
          <span>&copy; {{ year }} POBSI Sulawesi Tengah. All rights reserved.</span>
          <span>Powered by Angular &amp; Supabase</span>
        </div>
      </div>
    </footer>

    <!-- Toast Notifications -->
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class]="toast.type" (click)="toastService.remove(toast.id)">
          <span class="material-icons toast-icon">
            {{ toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info' }}
          </span>
          <span class="toast-msg">{{ toast.message }}</span>
          <span class="material-icons toast-close">close</span>
        </div>
      }
    </div>
  `,
  styles: [`
    /* ─── NAVBAR ─────────────────────────────────── */
    .navbar {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 600;
      background: var(--red);
      height: var(--navbar-height);
      transition: box-shadow 0.3s;
    }
    .navbar.scrolled {
      box-shadow: 0 2px 20px rgba(0,0,0,0.25);
    }
    .navbar-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      max-width: 1140px;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* Brand */
    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      flex-shrink: 0;
    }
    .nav-logo {
      width: 42px; height: 42px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--yellow);
      flex-shrink: 0;
    }
    .nav-brand-text { display: flex; flex-direction: column; }
    .nav-brand-main {
      font-family: var(--font-heading);
      font-size: 1.25rem; font-weight: 700;
      color: #fff; line-height: 1;
      letter-spacing: 1px;
    }
    .nav-brand-sub {
      font-size: 9px; color: rgba(255,255,255,0.75);
      text-transform: uppercase; letter-spacing: 1px;
    }

    /* Desktop links */
    .nav-links {
      display: none;
      gap: 2px;
    }
    @media (min-width: 900px) {
      .nav-links { display: flex; }
    }
    .nav-link {
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      color: rgba(255,255,255,0.88);
      text-decoration: none;
      letter-spacing: 0.2px;
      transition: background 0.2s, color 0.2s;
      white-space: nowrap;
    }
    .nav-link:hover { background: rgba(255,255,255,0.15); color: #fff; }
    .nav-link.active {
      background: rgba(255,255,255,0.2);
      color: var(--yellow);
    }

    /* Hamburger */
    .hamburger {
      display: flex;
      flex-direction: column;
      gap: 5px;
      background: none; border: none;
      cursor: pointer; padding: 8px; border-radius: 8px;
      transition: background 0.2s;
    }
    .hamburger:hover { background: rgba(255,255,255,0.15); }
    .hamburger span {
      display: block;
      width: 22px; height: 2px;
      background: #fff; border-radius: 2px;
      transition: all 0.3s;
    }
    .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
    .hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
    .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
    @media (min-width: 900px) { .hamburger { display: none; } }

    /* ─── SIDEBAR (mobile) ───────────────────────── */
    .sidebar-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.55);
      backdrop-filter: blur(3px);
      z-index: 700;
      opacity: 0; pointer-events: none;
      transition: opacity 0.3s;
    }
    .sidebar-overlay.show { opacity: 1; pointer-events: all; }

    .sidebar {
      position: fixed;
      top: 0; left: 0; bottom: 0;
      width: 280px;
      background: var(--dark);
      z-index: 800;
      display: flex;
      flex-direction: column;
      transform: translateX(-100%);
      transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 4px 0 24px rgba(0,0,0,0.3);
    }
    .sidebar.open { transform: translateX(0); }

    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.04);
    }
    .sidebar-logo {
      width: 44px; height: 44px;
      border-radius: 50%; object-fit: cover;
      border: 2px solid var(--yellow);
      flex-shrink: 0;
    }
    .sidebar-title {
      font-family: var(--font-heading);
      font-size: 1rem; font-weight: 700;
      color: #fff;
    }
    .sidebar-subtitle { font-size: 11px; color: rgba(255,255,255,0.45); }
    .sidebar-close {
      margin-left: auto;
      background: rgba(255,255,255,0.1);
      border: none; border-radius: 8px;
      width: 32px; height: 32px;
      display: flex; align-items: center; justify-content: center;
      color: rgba(255,255,255,0.7); cursor: pointer;
      flex-shrink: 0;
      transition: background 0.2s;
    }
    .sidebar-close:hover { background: var(--red); color: #fff; }
    .sidebar-close .material-icons { font-size: 18px; }

    .sidebar-nav {
      flex: 1; overflow-y: auto;
      padding: 12px 12px;
      display: flex; flex-direction: column; gap: 2px;
    }
    .sidebar-link {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 16px;
      border-radius: 10px;
      color: rgba(255,255,255,0.75);
      font-size: 15px; font-weight: 500;
      text-decoration: none;
      transition: all 0.2s;
    }
    .sidebar-link:hover {
      background: rgba(255,255,255,0.08);
      color: #fff;
    }
    .sidebar-link.sidebar-active {
      background: var(--red);
      color: #fff;
    }
    .sidebar-link .material-icons { font-size: 20px; flex-shrink: 0; }

    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid rgba(255,255,255,0.08);
      display: flex; align-items: center; gap: 10px;
      color: rgba(255,255,255,0.35);
      font-size: 12px;
    }

    /* ─── MAIN ───────────────────────────────────── */
    .main-content { min-height: 100vh; }

    /* ─── FOOTER ─────────────────────────────────── */
    .site-footer { background: #111; color: #fff; margin-top: 0; }
    .footer-top { padding: 48px 0 36px; }
    .footer-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 32px;
    }
    @media (min-width: 640px) {
      .footer-grid { grid-template-columns: 1.5fr 1fr 1fr; }
    }
    .brand-col { display: flex; gap: 14px; align-items: flex-start; }
    .footer-logo {
      width: 52px; height: 52px;
      border-radius: 50%; object-fit: cover;
      border: 2px solid var(--yellow); flex-shrink: 0;
    }
    .footer-org-name {
      font-family: var(--font-heading);
      font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 2px;
    }
    .footer-org-sub { font-size: 11px; color: rgba(255,255,255,0.4); margin-bottom: 8px; }
    .footer-desc { font-size: 13px; color: rgba(255,255,255,0.5); line-height: 1.6; }
    .footer-col-title {
      font-family: var(--font-heading);
      font-size: 13px; font-weight: 600;
      text-transform: uppercase; letter-spacing: 1px;
      color: var(--yellow); margin-bottom: 14px;
    }
    .footer-links { display: flex; flex-direction: column; gap: 6px; }
    .footer-link {
      display: flex; align-items: center; gap: 4px;
      color: rgba(255,255,255,0.6); font-size: 14px;
      text-decoration: none; transition: color 0.2s;
    }
    .footer-link:hover { color: var(--yellow); }
    .footer-link .material-icons { font-size: 16px; }
    .footer-contacts { display: flex; flex-direction: column; gap: 10px; }
    .footer-contact-item {
      display: flex; align-items: flex-start; gap: 8px;
      font-size: 13px; color: rgba(255,255,255,0.55);
    }
    .footer-contact-item .material-icons { font-size: 16px; color: var(--red); flex-shrink: 0; margin-top: 1px; }
    .footer-bottom {
      background: rgba(0,0,0,0.4);
      padding: 14px 0;
    }
    .footer-bottom .container {
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 8px;
      font-size: 12px; color: rgba(255,255,255,0.3);
    }

    /* ─── TOAST ──────────────────────────────────── */
    .toast-container {
      position: fixed; top: 72px; right: 16px;
      z-index: 2000;
      display: flex; flex-direction: column; gap: 8px;
      pointer-events: none;
    }
    .toast {
      background: #1f2937;
      color: #fff;
      padding: 12px 14px;
      border-radius: 10px;
      font-size: 14px;
      display: flex; align-items: center; gap: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.25);
      animation: toastIn 0.3s ease;
      min-width: 220px; max-width: 340px;
      pointer-events: all; cursor: pointer;
    }
    .toast.success { border-left: 4px solid #22c55e; }
    .toast.error   { border-left: 4px solid var(--red); }
    .toast.info    { border-left: 4px solid #3b82f6; }
    .toast-icon { font-size: 18px; flex-shrink: 0; }
    .toast.success .toast-icon { color: #22c55e; }
    .toast.error   .toast-icon { color: #f87171; }
    .toast.info    .toast-icon { color: #60a5fa; }
    .toast-msg { flex: 1; line-height: 1.4; }
    .toast-close { font-size: 16px; color: rgba(255,255,255,0.35); flex-shrink: 0; }
    @keyframes toastIn {
      from { transform: translateX(110%); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }
  `]
})
export class AppComponent {
  menuOpen = false;
  scrolled = false;
  year = new Date().getFullYear();

  navItems: NavItem[] = [
    { label: 'Beranda',      route: '/',          icon: 'home' },
    { label: 'Organisasi',   route: '/organisasi', icon: 'account_tree' },
    { label: 'Data Atlet',   route: '/atlet',      icon: 'people' },
    { label: 'Kalender',     route: '/kalender',   icon: 'event' },
    { label: 'Berita',       route: '/berita',     icon: 'article' },
  ];

  constructor(public toastService: ToastService) {}

  @HostListener('window:scroll')
  onScroll() { this.scrolled = window.scrollY > 20; }

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  closeMenu()  { this.menuOpen = false; }
}
