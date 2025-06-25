import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Partners } from 'app/core/interface/partners.interface';
import { partners } from 'app/shared/storage/data/partners.data';

@Component({
  selector: 'dealhub-partners',
  imports: [CommonModule],
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.scss'
})
export class PartnersComponent {
  public partners: Partners[] = partners;

}
