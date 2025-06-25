import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { novidades } from 'app/shared/storage/data/new-products.data';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { InViewportDirective } from 'app/shared/directives/show-viewport.directive';
import { Novidades } from 'app/core/interface/new-product.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'dealhub-new-products',
  standalone: true,
  imports: [CommonModule, InViewportDirective],
  templateUrl: './new-products.component.html',
  styleUrl: './new-products.component.scss',
  animations: [
    trigger('fadeInUp', [
      state(
        'out',
        style({
          opacity: 0,
          transform: 'translateY(20px)',
        })
      ),
      state(
        'in',
        style({
          opacity: 1,
          transform: 'translateY(0)',
        })
      ),
      transition('out => in', animate('800ms ease-out')),
    ]),
  ],
})
export class NewProductsComponent {
  public novidades: Novidades[] = novidades;
  public isVisible: { [key: number]: boolean } = {};

  constructor(private router: Router){}

  setVisible(index: number, visible: boolean): void {
    this.isVisible[index] = visible;
  }

  seeMore(_id: number): void{
    this.router.navigate([`/shopping/product/:${_id}`]);
  }
}
