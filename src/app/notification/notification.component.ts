import {Component, TemplateRef} from '@angular/core';

import { NotificationService } from '../_services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: 'notification.component.html',
  host: {'[class.ngb-toasts]': 'true'}
})
export class NotificationComponent {
  constructor(public notificationService: NotificationService) { }

  isTemplate(toast: any) { return toast.textOrTpl instanceof TemplateRef; }
}