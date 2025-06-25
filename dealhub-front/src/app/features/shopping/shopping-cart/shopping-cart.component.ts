import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'app/core/services/cart/cart.service';
import { HeaderComponent } from 'app/shared/components/header/header.component';
import { FooterComponent } from 'app/shared/components/footer/footer.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'dealhub-shopping-cart',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, FormsModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent  implements OnInit  {
  cartItems: any[] = [];

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit() {
    this.cartItems = this.cartService.getCartItems();
  }

  get total() {
    return this.cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  }

  removerItem(index: number) {
    this.cartItems.splice(index, 1);
  }

  alterarQuantidade(index: number, quantidade: number) {
    if (quantidade < 1) {
      this.removerItem(index);
    } else {
      this.cartItems[index].quantity = quantidade;
    }
  }

  irParaCheckout() {
    if (this.cartItems.length === 0) {
      this.cartService.modalEvent$.next({
        title: 'Carrinho vazio',
        description: 'Adicione produtos antes de prosseguir para o checkout.',
      });
      return;
    }
    this.router.navigate(['/shopping/checkout']);
  }

  voltarAsCompras():void{
    this.router.navigate(['/shopping/buy'])
  }
}
