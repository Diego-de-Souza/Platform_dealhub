import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CategoriaData } from 'app/core/interface/categoria.interface';
import { CategoryService } from 'app/core/services/category/category.service';
import { HeaderPlatformComponent } from 'app/shared/components/header-platform/header-platform.component';
import { MenuAsideComponent } from 'app/shared/components/menu-aside/menu-aside.component';

@Component({
  selector: 'dealhub-list-categories',
  imports: [CommonModule, HeaderPlatformComponent, MenuAsideComponent, FormsModule, RouterModule],
  templateUrl: './list-categories.component.html',
  styleUrl: './list-categories.component.scss'
})
export class ListCategoriesComponent implements OnInit{
  categories: CategoriaData[] = [];
  searchTerm = '';
  selectAll = false;
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  itemsPerPage = 10;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.getDataCategory();
  }

  getDataCategory() {
    this.categoryService.getAllDataCategories(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        this.categories = response.categorias;
        this.categories.filter((c: CategoriaData) =>
          c.nome.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
      },
      error: (err) => console.error('Erro ao buscar categorias:', err)
    });
  }

  filteredCategories() {
    return this.categories.filter(c =>
      c.nome.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleSelectAll() {
    this.filteredCategories().forEach(c => c.selected = this.selectAll);
  }

  totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getDataCategory();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.getDataCategory();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.getDataCategory();
  }

  deleteCategory(categoria: CategoriaData) {
    if (confirm(`Deseja realmente excluir a categoria "${categoria.nome}"?`)) {
      this.categoryService.deleteCategory(categoria.id).subscribe({
        next: () => this.getDataCategory(),
        error: (err) => console.error('Erro ao excluir:', err)
      })
      
    }
  }
}
