import { Injectable, signal } from '@angular/core';
import { Toast } from '../models';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(message: string, type: Toast['type'] = 'info') {
    const id = Date.now().toString();
    this.toasts.update(list => [...list, { id, message, type }]);
    setTimeout(() => this.remove(id), 3500);
  }

  remove(id: string) {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  success(message: string) { this.show(message, 'success'); }
  error(message: string) { this.show(message, 'error'); }
  info(message: string) { this.show(message, 'info'); }
}
