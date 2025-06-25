import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Novidades } from 'app/core/interface/new-product.interface';
import { AuthService } from 'app/core/services/auth/auth.service';
import { CartService } from 'app/core/services/cart/cart.service';
import { ToastComponent } from '../toast/toast.component';
import { ToastService } from 'app/core/services/toast/toast.service';

@Component({
  selector: 'dealhub-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() produto!: Novidades;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private toast: ToastService
  ){}

  adicionarAoCarrinho(product: any) {
    const loggedIn = this.authService.isLoggedIn();
    this.cartService.addToCart(product, 1, loggedIn);

    this.toast.showToast('Produto adicionado ao carrinho!', 'success');
  }
}
