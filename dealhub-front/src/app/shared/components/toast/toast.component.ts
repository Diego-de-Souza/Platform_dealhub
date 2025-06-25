import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ToastService } from 'app/core/services/toast/toast.service';

@Component({
  selector: 'dealhub-toast',
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  constructor(public toast: ToastService) {}

  get bgColor() {
    switch (this.toast.type()) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  }
}
