import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { OrgMember } from '../models';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private table = 'org_members';

  constructor(private supabase: SupabaseService) {}

  async getAll(): Promise<OrgMember[]> {
    const { data, error } = await this.supabase.client
      .from(this.table)
      .select('*')
      .order('level',      { ascending: true })
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async create(member: OrgMember): Promise<OrgMember> {
    const { data, error } = await this.supabase.client
      .from(this.table)
      .insert([member])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async update(id: string, member: Partial<OrgMember>): Promise<OrgMember> {
    const { data, error } = await this.supabase.client
      .from(this.table)
      .update(member)
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
