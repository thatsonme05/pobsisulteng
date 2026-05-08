import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'organisasi',
    loadComponent: () => import('./pages/organization/organization.component').then(m => m.OrganizationComponent)
  },
  {
    path: 'atlet',
    loadComponent: () => import('./pages/athletes/athletes.component').then(m => m.AthletesComponent)
  },
  {
    path: 'kalender',
    loadComponent: () => import('./pages/calendar/calendar.component').then(m => m.CalendarComponent)
  },
  {
    path: 'berita',
    loadComponent: () => import('./pages/news/news-list.component').then(m => m.NewsListComponent)
  },
  {
    path: 'berita/:id',
    loadComponent: () => import('./pages/news/news-detail.component').then(m => m.NewsDetailComponent)
  },
  { path: '**', redirectTo: '' }
];
