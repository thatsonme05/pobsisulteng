import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Championship } from '../models';

@Injectable({ providedIn: 'root' })
export class ChampionshipService {
  private table = 'championships';

  constructor(private supabase: SupabaseService) {}

  async getAll(): Promise<Championship[]> {
    const { data, error } = await this.supabase.client
      .from(this.table)
      .select('*')
      .order('date_start', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async getById(id: string): Promise<Championship | null> {
    const { data, error } = await this.supabase.client
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async create(championship: Championship): Promise<Championship> {
    const { data, error } = await this.supabase.client
      .from(this.table)
      .insert([championship])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async update(id: string, championship: Partial<Championship>): Promise<Championship> {
    const { data, error } = await this.supabase.client
      .from(this.table)
      .update(championship)
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
