import { Component } from '@angular/core';
import { FooterComponent } from 'app/shared/components/footer/footer.component';
import { HeaderComponent } from 'app/shared/components/header/header.component';

@Component({
  selector: 'dealhub-exchange-and-return',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './exchange-and-return.component.html',
  styleUrl: './exchange-and-return.component.scss'
})
export class ExchangeAndReturnComponent {

}
