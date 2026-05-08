import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface SiteSetting {
  id?: string;
  key: string;
  value: string;
  updated_at?: string;
}

export interface HeroSlide {
  id?: string;
  title: string;
  subtitle: string;
  photo_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

@Injectable({ providedIn: 'root' })
export class SiteSettingsService {

  constructor(private supabase: SupabaseService) {}

  // ─── SITE SETTINGS (key-value) ────────────────────────────────
  async get(key: string): Promise<string | null> {
    const { data } = await this.supabase.client
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .single();
    return data?.value ?? null;
  }

  async set(key: string, value: string): Promise<void> {
    await this.supabase.client
      .from('site_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  }

  // ─── HERO SLIDES ──────────────────────────────────────────────
  async getSlides(): Promise<HeroSlide[]> {
    const { data, error } = await this.supabase.client
      .from('hero_slides')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async createSlide(slide: HeroSlide, photoFile?: File): Promise<HeroSlide> {
    if (photoFile) {
      const ext = photoFile.name.split('.').pop();
      const path = `hero/${Date.now()}.${ext}`;
      const url = await this.supabase.uploadImage('pobsi-photos', photoFile, path);
      if (url) slide.photo_url = url;
    }
    const { data, error } = await this.supabase.client
      .from('hero_slides')
      .insert([slide])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateSlide(id: string, slide: Partial<HeroSlide>, photoFile?: File): Promise<HeroSlide> {
    if (photoFile) {
      const ext = photoFile.name.split('.').pop();
      const path = `hero/${Date.now()}.${ext}`;
      const url = await this.supabase.uploadImage('pobsi-photos', photoFile, path);
      if (url) slide.photo_url = url;
    }
    const { data, error } = await this.supabase.client
      .from('hero_slides')
      .update(slide)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteSlide(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('hero_slides')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
}
