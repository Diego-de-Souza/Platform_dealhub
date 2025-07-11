import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'dealhub-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
}
