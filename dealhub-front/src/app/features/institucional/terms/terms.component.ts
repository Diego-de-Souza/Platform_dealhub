import { Component } from '@angular/core';
import { FooterComponent } from 'app/shared/components/footer/footer.component';
import { HeaderComponent } from 'app/shared/components/header/header.component';

@Component({
  selector: 'dealhub-terms',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.scss'
})
export class TermsComponent {

}
