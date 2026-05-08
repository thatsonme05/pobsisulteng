// =============================================
// ATHLETE MODEL
// =============================================
export interface Athlete {
  id?: string;
  name: string;
  nik: string;
  birth_date: string;
  birth_place: string;
  gender: 'Laki-laki' | 'Perempuan';
  category: string;
  club: string;
  address: string;
  phone: string;
  photo_url?: string;
  status: 'Aktif' | 'Tidak Aktif';
  created_at?: string;
}

// =============================================
// CHAMPIONSHIP / CALENDAR MODEL
// =============================================
export interface Championship {
  id?: string;
  title: string;
  description: string;
  date_start: string;
  date_end: string;
  location: string;
  category: string;
  organizer: string;
  status: 'Akan Datang' | 'Berlangsung' | 'Selesai' | 'Dibatalkan';
  registration_deadline?: string;
  contact?: string;
  created_at?: string;
}

// =============================================
// NEWS MODEL
// =============================================
export interface News {
  id?: string;
  title: string;
  content: string;
  summary: string;
  photo_url?: string;
  author: string;
  category: string;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

// =============================================
// ORGANIZATION MEMBER MODEL (no photo)
// =============================================
export interface OrgMember {
  id?: string;
  name: string;
  position: string;
  division: string;
  level: number;
  phone?: string;
  email?: string;
  period: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

// =============================================
// TOAST MODEL
// =============================================
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
