import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FooterComponent } from 'app/shared/components/footer/footer.component';
import { HeaderComponent } from 'app/shared/components/header/header.component';
import { FormsModule } from '@angular/forms';
import { Produto } from 'app/core/interface/product.interface';
import { CartService } from 'app/core/services/cart/cart.service';
import { AuthService } from 'app/core/services/auth/auth.service';
import { ModalComponent } from 'app/shared/components/modal/modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dealhub-product',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, FormsModule, ModalComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit, OnDestroy {
  product: Produto | null = null;
  quantidade = 1;

  showModal = false;
  modalTitle = '';
  modalDescription = '';

  private modalSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id);

    this.product = {
      id,
      name: 'Headset Gamer RGB Ultra X',
      descricao:
        'Áudio imersivo, design futurista, microfone removível e conexão bluetooth de alta performance.',
      preco: 399.9,
      precoOriginal: 499.9,
      desconto: true,
      imagemPrincipal: 'assets/produtos/headset-principal.jpg',
      imagensSecundarias: [
        'assets/produtos/headset-lado.jpg',
        'assets/produtos/headset-cima.jpg',
        'assets/produtos/headset-detalhe.jpg',
      ],
      especificacoes: [
        'Conexão Bluetooth 5.2',
        'Iluminação RGB dinâmica',
        'Microfone com cancelamento de ruído',
        'Bateria de até 30 horas',
        'Compatível com PC, PS5, Xbox e Mobile',
      ],
    };

    // Escutando o evento do service
    this.modalSubscription = this.cartService.modalEvent$.subscribe((modal) => {
      this.modalTitle = modal.title;
      this.modalDescription = modal.description;
      this.showModal = true;
    });
  }

  trocarImagem(imagem: string) {
    if (this.product) {
      this.product.imagemPrincipal = imagem;
    }
  }

  adicionarAoCarrinho() {
    const loggedIn = this.authService.isLoggedIn();
    this.cartService.addToCart(this.product, this.quantidade, loggedIn);
  }

  comprarAgora() {
    const loggedIn = this.authService.isLoggedIn();
    this.cartService.addToCart(this.product, this.quantidade, loggedIn);

    this.router.navigate(['/shopping/shopping-cart']);
  }

  fecharModal() {
    this.showModal = false;
  }

  confirmarModal() {
    this.showModal = false;
    // Aqui você pode redirecionar se quiser, ou executar qualquer ação
  }

  ngOnDestroy() {
    this.modalSubscription.unsubscribe();
  }
}
