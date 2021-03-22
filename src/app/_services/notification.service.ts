import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  toasts: any[] = [];

  info(message: string) {
    this.show(message, {
      classname: 'bg-info text-light',
      delay: 5000,
      autohide: true
    });
  }

  success(message: string) {
    this.show(message, { 
      classname: 'bg-success text-light', 
      delay: 5000,
      autohide: true
    });
  }

  error(message: string) {
    this.show(message, {
      classname: 'bg-danger text-light',
      delay: 5000,
      autohide: true
    });
  }

  // Push new toasts to array with content and options
  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  // Callback method to remove toast DOM element from view
  remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}