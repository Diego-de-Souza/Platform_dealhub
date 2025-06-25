import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderPlatformComponent } from 'app/shared/components/header-platform/header-platform.component';
import { MenuAsideComponent } from 'app/shared/components/menu-aside/menu-aside.component';

@Component({
  selector: 'dealhub-list-subcategories',
  imports: [CommonModule, HeaderPlatformComponent, MenuAsideComponent, FormsModule, RouterModule],
  templateUrl: './list-subcategories.component.html',
  styleUrl: './list-subcategories.component.scss'
})
export class ListSubcategoriesComponent {
  searchTerm = '';
  selectAll = false;
  currentPage = 0;
  itemsPerPage = 10;

  subcategories = [
    { id: 1, nome: 'Eletrônicos', quantidadeProdutos: 25, selected: false },
    { id: 2, nome: 'Roupas', quantidadeProdutos: 15, selected: false },
    { id: 3, nome: 'Esportes', quantidadeProdutos: 8, selected: false },
    // ...simulados
  ];

  get totalPages() {
    return Math.ceil(this.subcategories.length / this.itemsPerPage);
  }

  filteredSubcategories() {
    let filtered = this.subcategories.filter(c =>
      c.nome.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    const start = this.currentPage * this.itemsPerPage;
    return filtered.slice(start, start + this.itemsPerPage);
  }

  toggleSelectAll() {
    this.filteredSubcategories().forEach(c => c.selected = this.selectAll);
  }

  deleteSubcategory(subcategory: any) {
    if (confirm(`Tem certeza que deseja excluir "${subcategory.nome}"?`)) {
      this.subcategories = this.subcategories.filter(c => c.id !== subcategory.id);
    }
  }

  totalPagesArray() {
    return Array(this.totalPages).fill(0).map((x, i) => i);
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
  }
}
