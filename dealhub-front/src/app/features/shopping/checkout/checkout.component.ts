import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from 'app/core/services/cart/cart.service';
import { FooterComponent } from 'app/shared/components/footer/footer.component';
import { HeaderComponent } from 'app/shared/components/header/header.component';

@Component({
  selector: 'dealhub-checkout',
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, FooterComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit{
  checkoutForm!: FormGroup;
  cartItems: any[] = [];
  total = 0;

  constructor(private fb: FormBuilder, private cartService: CartService) {}

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      cep: ['', Validators.required],
      endereco: ['', Validators.required],
      pagamento: ['pix', Validators.required],
    });

    this.cartItems = this.cartService.getCartItems();
    this.total = this.cartItems.reduce(
      (sum, item) => sum + item.preco * item.quantidade,
      0
    );
  }

  finalizarPedido() {
    if (this.checkoutForm.invalid) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const pedido = {
      ...this.checkoutForm.value,
      itens: this.cartItems,
      total: this.total,
    };

    console.log('Pedido realizado:', pedido);

    // 🔥 Aqui você pode integrar com a API ou serviço de backend
    alert('Pedido finalizado com sucesso!');
    this.cartService.clearCart();
  }
}
