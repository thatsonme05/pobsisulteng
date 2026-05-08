import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Athlete } from '../models';

@Injectable({ providedIn: 'root' })
export class AthleteService {
  private table = 'athletes';

  constructor(private supabase: SupabaseService) {}

  async getAll(search = ''): Promise<Athlete[]> {
    let query = this.supabase.client
      .from(this.table)
      .select('*')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async getById(id: string): Promise<Athlete | null> {
    const { data, error } = await this.supabase.client
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async create(athlete: Athlete, photoFile?: File): Promise<Athlete> {
    if (photoFile) {
      const ext = photoFile.name.split('.').pop();
      const path = `athletes/${Date.now()}.${ext}`;
      const url = await this.supabase.uploadImage('pobsi-photos', photoFile, path);
      if (url) athlete.photo_url = url;
    }

    const { data, error } = await this.supabase.client
      .from(this.table)
      .insert([athlete])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async update(id: string, athlete: Partial<Athlete>, photoFile?: File): Promise<Athlete> {
    if (photoFile) {
      const ext = photoFile.name.split('.').pop();
      const path = `athletes/${Date.now()}.${ext}`;
      const url = await this.supabase.uploadImage('pobsi-photos', photoFile, path);
      if (url) athlete.photo_url = url;
    }

    const { data, error } = await this.supabase.client
      .from(this.table)
      .update(athlete)
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
}
