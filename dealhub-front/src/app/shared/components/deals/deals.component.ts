import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/services/auth/auth.service';
import { CartService } from 'app/core/services/cart/cart.service';
import { specialOffers } from 'app/shared/storage/data/deal.data';

@Component({
  selector: 'dealhub-deals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.scss']
})
export class DealsComponent implements OnInit {
  public specialOffers = specialOffers;
  public hasOffers = false;

  constructor(
    private router: Router,
    private cartService: CartService,
    private authService: AuthService
  ){}

  ngOnInit() {
    this.hasOffers = this.specialOffers.length > 0;
  }

  buyItem(product: any): void{
    const loggedIn = this.authService.isLoggedIn();
    this.cartService.addToCart(product, 1, loggedIn);

    this.router.navigate(['/shopping/shopping-cart']);
  }
}
