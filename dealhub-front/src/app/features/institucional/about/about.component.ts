import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from 'app/shared/components/footer/footer.component';
import { HeaderComponent } from 'app/shared/components/header/header.component';
import { PartnersComponent } from 'app/shared/components/partners/partners.component';

@Component({
  selector: 'dealhub-about',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, PartnersComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

}
