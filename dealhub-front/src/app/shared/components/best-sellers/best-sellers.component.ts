import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { bestSellers } from 'app/shared/storage/data/bestsellers.data';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { InViewportDirective } from 'app/shared/directives/show-viewport.directive';
import { BestSeller } from 'app/core/interface/bestseller.interface';
import { AuthService } from 'app/core/services/auth/auth.service';
import { CartService } from 'app/core/services/cart/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'dealhub-best-sellers',
  imports: [CommonModule, InViewportDirective],
  templateUrl: './best-sellers.component.html',
  styleUrl: './best-sellers.component.scss',
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
export class BestSellersComponent {
  public bestSellers: BestSeller[] = bestSellers;
  public isVisible: boolean[] = Array(this.bestSellers.length).fill(false);

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ){}
  setVisible(index: number, visible: boolean) {
    this.isVisible[index] = visible;
  }

  buyItem(product: any): void{
    const loggedIn = this.authService.isLoggedIn();
    this.cartService.addToCart(product, 1, loggedIn);

    this.router.navigate(['/shopping/shopping-cart']);
  }
}
