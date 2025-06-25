import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Novidades } from 'app/core/interface/new-product.interface';
import { ProductService } from 'app/core/services/product/product.service';
import { FooterComponent } from 'app/shared/components/footer/footer.component';
import { HeaderComponent } from 'app/shared/components/header/header.component';
import { ProductCardComponent } from 'app/shared/components/product-card/product-card.component';

@Component({
  selector: 'dealhub-buy',
  imports: [CommonModule, ProductCardComponent, HeaderComponent, FooterComponent],
  templateUrl: './buy.component.html',
  styleUrl: './buy.component.scss'
})
export class BuyComponent implements OnInit{
  produtos: Novidades[] = [];
  categorias: string[] = ['Headsets', 'Monitores', 'Teclados', 'Mouses'];
  selectedCategory?: string;
  selectedFilter: string | null = null;
  
  pagina = 1;
  totalPaginas = Array.from({ length: 5 }, (_, index) => index + 1);
  loading = false;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.loading = true;
    this.productService.getProdutos(this.pagina, this.selectedCategory, this.selectedFilter)
      .subscribe(res => {
        this.produtos = res.produtos;
        // this.totalPaginas = res.totalPaginas;
        this.loading = false;
      });
  }

  selecionarCategoria(categoria: string) {
    this.selectedCategory = categoria;
    this.selectedFilter = null;
    this.pagina = 1;
    this.carregarProdutos();
  }

  aplicarFiltro(filtro: string) {
    this.selectedFilter = filtro;
    this.selectedCategory = undefined;
    this.pagina = 1;
    this.carregarProdutos();
  }

  mudarPagina(pagina: number) {
    this.pagina = pagina;
    this.carregarProdutos();
  }
}
