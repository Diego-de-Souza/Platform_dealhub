import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class CartService {
  private cart: any[] = [];
  
   modalEvent$ = new Subject<{ title: string; description: string }>();

  constructor(private router: Router) {}

  addToCart(product: any, quantity: number, isLoggedIn: boolean) {
    if (!isLoggedIn) {
      this.modalEvent$.next({
        title: 'Atenção',
        description: 'Você precisa estar logado para adicionar produtos ao carrinho.',
      });
      this.router.navigate(['/login']);
      return;
    }

    // Aqui você chamaria o backend para salvar
    this.cart.push({product, quantity});
    console.log('Produto adicionado:', this.cart);
  }

  getCartItems() {
    return this.cart;
  }

  clearCart() {
    this.cart = [];
    console.log('Carrinho limpo');
  }
}
