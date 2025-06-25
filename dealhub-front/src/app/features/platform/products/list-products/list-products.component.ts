import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderPlatformComponent } from 'app/shared/components/header-platform/header-platform.component';
import { MenuAsideComponent } from 'app/shared/components/menu-aside/menu-aside.component';

interface Product {
  id: number;
  nome: string;
  marca: string;
  destaque: boolean;
  visivel: boolean;
  status: 'Ativo' | 'Inativo' | 'Descontinuado';
  selected?: boolean;
}

@Component({
  selector: 'dealhub-list-products',
  imports: [CommonModule, RouterModule, FormsModule, HeaderPlatformComponent, MenuAsideComponent],
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.scss'
})
export class ListProductsComponent {
   products: Product[] = [];
  searchTerm: string = '';
  selectAll: boolean = false;

  // Paginação
  currentPage: number = 0;
  itemsPerPage: number = 10;
  totalPages = 1;

  constructor() {}

  ngOnInit(): void {
    // 🔥 Mock de produtos - aqui você pode substituir pela API futuramente
    this.products = [
      {
        id: 1,
        nome: 'Produto A',
        marca: 'Marca X',
        destaque: true,
        visivel: true,
        status: 'Ativo'
      },
      {
        id: 2,
        nome: 'Produto B',
        marca: 'Marca Y',
        destaque: false,
        visivel: false,
        status: 'Inativo'
      },
      {
        id: 3,
        nome: 'Produto C',
        marca: 'Marca Z',
        destaque: false,
        visivel: true,
        status: 'Descontinuado'
      },
      // ➕ Adicione mais produtos se quiser testar
    ];
  }

  // 🔍 Filtro de busca
  filteredProducts(): Product[] {
    const filtered = this.products.filter(product =>
      product.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      product.marca.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    const start = this.currentPage * this.itemsPerPage;
    return filtered.slice(start, start + this.itemsPerPage);
  }

  // 🔄 Alternar seleção geral
  toggleSelectAll() {
    this.filteredProducts().forEach(product => {
      product.selected = this.selectAll;
    });
  }

  // 🗑️ Deletar produto
  deleteProduct(product: Product) {
    if (confirm(`Tem certeza que deseja excluir o produto ${product.nome}?`)) {
      this.products = this.products.filter(p => p.id !== product.id);
    }
  }

  // 🔢 Paginação
  totalPagesArray(): number[] {
    const total = Math.ceil(
      this.products.filter(product =>
        product.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.marca.toLowerCase().includes(this.searchTerm.toLowerCase())
      ).length / this.itemsPerPage
    );
    return Array.from({ length: total }, (_, i) => i);
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPagesArray().length - 1) {
      this.currentPage++;
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
  }
}
