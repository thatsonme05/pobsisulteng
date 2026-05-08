import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { News } from '../models';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private table = 'news';

  constructor(private supabase: SupabaseService) {}

  async getAll(publishedOnly = false): Promise<News[]> {
    let query = this.supabase.client
      .from(this.table)
      .select('*')
      .order('created_at', { ascending: false });

    if (publishedOnly) {
      query = query.eq('published', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async getById(id: string): Promise<News | null> {
    const { data, error } = await this.supabase.client
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async create(news: News, photoFile?: File): Promise<News> {
    if (photoFile) {
      const ext = photoFile.name.split('.').pop();
      const path = `news/${Date.now()}.${ext}`;
      const url = await this.supabase.uploadImage('pobsi-photos', photoFile, path);
      if (url) news.photo_url = url;
    }

    const { data, error } = await this.supabase.client
      .from(this.table)
      .insert([news])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async update(id: string, news: Partial<News>, photoFile?: File): Promise<News> {
    if (photoFile) {
      const ext = photoFile.name.split('.').pop();
      const path = `news/${Date.now()}.${ext}`;
      const url = await this.supabase.uploadImage('pobsi-photos', photoFile, path);
      if (url) news.photo_url = url;
    }

    const { updated_at: _, ...payload } = news as any;
    payload.updated_at = new Date().toISOString();

    const { data, error } = await this.supabase.client
      .from(this.table)
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from(this.table)
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  async togglePublish(id: string, published: boolean): Promise<void> {
    const { error } = await this.supabase.client
      .from(this.table)
      .update({ published })
      .eq('id', id);
    if (error) throw error;
  }
}
