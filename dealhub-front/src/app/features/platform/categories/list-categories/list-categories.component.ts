import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderPlatformComponent } from 'app/shared/components/header-platform/header-platform.component';
import { MenuAsideComponent } from 'app/shared/components/menu-aside/menu-aside.component';

@Component({
  selector: 'dealhub-list-categories',
  imports: [CommonModule, HeaderPlatformComponent, MenuAsideComponent, FormsModule, RouterModule],
  templateUrl: './list-categories.component.html',
  styleUrl: './list-categories.component.scss'
})
export class ListCategoriesComponent {
  categories = [
    { id: 1, nome: 'Eletrônicos', ativa: true, quantidadeSubcategorias: 3, quantidadeProdutos: 150, selected: false },
    { id: 2, nome: 'Vestuário', ativa: false, quantidadeSubcategorias: 5, quantidadeProdutos: 80, selected: false },
    { id: 3, nome: 'Casa e Jardim', ativa: true, quantidadeSubcategorias: 2, quantidadeProdutos: 50, selected: false },
    // ...adicione mais dados conforme sua API
  ];

  searchTerm = '';
  selectAll = false;
  currentPage = 0;
  itemsPerPage = 10;

  filteredCategories() {
    const filtered = this.categories.filter(c =>
      c.nome.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return filtered.slice(start, end);
  }

  toggleSelectAll() {
    this.filteredCategories().forEach(c => c.selected = this.selectAll);
  }

  totalPagesArray() {
    const total = Math.ceil(
      this.categories.filter(c =>
        c.nome.toLowerCase().includes(this.searchTerm.toLowerCase())
      ).length / this.itemsPerPage
    );
    return Array.from({ length: total }, (_, i) => i);
  }

  get totalPages() {
    return this.totalPagesArray().length;
  }

  previousPage() {
    if (this.currentPage > 0) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) this.currentPage++;
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  deleteCategory(categoria: any) {
    if (confirm(`Deseja realmente excluir a categoria "${categoria.nome}"?`)) {
      this.categories = this.categories.filter(c => c.id !== categoria.id);
    }
  }
}
