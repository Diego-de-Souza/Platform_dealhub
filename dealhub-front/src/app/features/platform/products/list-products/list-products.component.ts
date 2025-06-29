import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductList } from 'app/core/interface/product.interface';
import { ProductService } from 'app/core/services/product/product.service';
import { HeaderPlatformComponent } from 'app/shared/components/header-platform/header-platform.component';
import { MenuAsideComponent } from 'app/shared/components/menu-aside/menu-aside.component';

@Component({
  selector: 'dealhub-list-products',
  imports: [CommonModule, RouterModule, FormsModule, HeaderPlatformComponent, MenuAsideComponent],
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.scss'
})
export class ListProductsComponent {
  products = signal<ProductList[]>([]);
  searchTerm = signal('');
  selectAll = signal(false);

  currentPage = signal(0);
  itemsPerPage = signal(10);
  totalPages = signal(0);

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(){
    this.productService.getListProducts(this.currentPage(), this.itemsPerPage()).subscribe({
      next: (response) => {
        this.products.set(response.content); 
        this.totalPages.set(response.totalPages);
      },
      error: (err) => console.error('Erro:', err)
    });
  }

  filteredProducts() {
    const term = this.searchTerm().toLowerCase();
    return this.products().filter(product =>
      product.nome.toLowerCase().includes(term) ||
      product.marca.toLowerCase().includes(term)
    );
  }

  toggleSelectAll() {
    this.selectAll.update(value => !value);
    this.products.update(product => 
      product.map(prod => ({ ...prod, selected: this.selectAll() }))
    )
  }
  
    deleteProduct(product: ProductList) {
      const confirmDelete = confirm(`Excluir ${product.nome}?`);
      if (confirmDelete) {
        this.productService.deleteProduct(product.id).subscribe({
          next: () => this.getProducts(),
          error: (err) => console.error('Erro ao excluir:', err)
        });
      }
    }
  
    paginatedProducts() {
      const startIndex = this.currentPage() * this.itemsPerPage();
      return this.filteredProducts().slice(startIndex, startIndex + this.itemsPerPage());
    }
  
    previousPage() {
      if (this.currentPage() > 0) {
        this.currentPage.update(p => p - 1);
      }
    }
  
    nextPage() {
      if (this.currentPage() < this.totalPages() - 1) {
        this.currentPage.update(p => p + 1);
      }
    }
  
    goToPage(page: number) {
      this.currentPage.set(page);
    }
  
    get pageNumbers(): number[] {
      return Array.from({ length: this.totalPages() }, (_, i) => i);
    }
}
