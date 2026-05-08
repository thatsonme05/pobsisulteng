import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrganizationService } from '../../services/organization.service';
import { ToastService } from '../../services/toast.service';
import { OrgMember } from '../../models';

@Component({
  selector: 'app-organization',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit {
  members    = signal<OrgMember[]>([]);
  loading    = signal(true);
  saving     = signal(false);
  showModal  = signal(false);
  showDeleteConfirm = signal(false);

  view: 'chart' | 'grid' | 'table' = 'chart';
  filterDivision = '';
  editingId: string | null = null;
  deletingMember: OrgMember | null = null;
  form: OrgMember = this.emptyForm();

  get currentPeriod(): string {
    return this.members()[0]?.period ?? new Date().getFullYear().toString();
  }
  get activeCount(): number {
    return this.members().filter(m => m.is_active).length;
  }
  get divisions(): string[] {
    return [...new Set(this.members().map(m => m.division).filter(Boolean))].sort();
  }
  get filteredMembers(): OrgMember[] {
    return this.filterDivision
      ? this.members().filter(m => m.division === this.filterDivision)
      : this.members();
  }
  get divisionGroups(): { name: string; members: OrgMember[] }[] {
    const map = new Map<string, OrgMember[]>();
    this.members()
      .filter(m => m.level >= 3 && m.is_active)
      .forEach(m => {
        if (!map.has(m.division)) map.set(m.division, []);
        map.get(m.division)!.push(m);
      });
    return [...map.entries()].map(([name, members]) => ({ name, members }));
  }

  constructor(
    private orgService: OrganizationService,
    private toast: ToastService
  ) {}

  ngOnInit() { this.load(); }

  emptyForm(): OrgMember {
    return {
      name: '', position: '', division: 'Pimpinan',
      level: 2, period: '', sort_order: 1,
      phone: '', email: '', is_active: true
    };
  }

  async load() {
    this.loading.set(true);
    try { this.members.set(await this.orgService.getAll()); }
    catch (e: any) { this.toast.error('Gagal memuat: ' + e.message); }
    finally { this.loading.set(false); }
  }

  getLevel(lv: number): OrgMember[] {
    return this.members().filter(m => m.level === lv && m.is_active);
  }

  initials(name: string): string {
    return (name || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  openModal(m?: OrgMember) {
    this.form = m ? { ...m } : this.emptyForm();
    this.editingId = m?.id ?? null;
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); this.editingId = null; }

  async save() {
    if (!this.form.name || !this.form.position || !this.form.division || !this.form.period) {
      this.toast.error('Nama, jabatan, bidang, dan periode wajib diisi!');
      return;
    }
    this.saving.set(true);
    try {
      const payload = { ...this.form };
      delete payload.id;
      delete payload.created_at;
      if (this.editingId) {
        await this.orgService.update(this.editingId, payload);
        this.toast.success('Pengurus berhasil diperbarui!');
      } else {
        await this.orgService.create(payload);
        this.toast.success('Pengurus baru berhasil ditambahkan!');
      }
      this.closeModal();
      this.load();
    } catch (e: any) { this.toast.error('Gagal menyimpan: ' + e.message); }
    finally { this.saving.set(false); }
  }

  confirmDelete(m: OrgMember) { this.deletingMember = m; this.showDeleteConfirm.set(true); }

  async deleteMember() {
    if (!this.deletingMember?.id) return;
    this.saving.set(true);
    try {
      await this.orgService.delete(this.deletingMember.id);
      this.toast.success('Pengurus berhasil dihapus!');
      this.showDeleteConfirm.set(false);
      this.load();
    } catch (e: any) { this.toast.error('Gagal menghapus: ' + e.message); }
    finally { this.saving.set(false); }
  }
}
