import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SubcategoryService } from 'app/core/services/subcategory/subcategory.service';
import { ToastService } from 'app/core/services/toast/toast.service';
import { HeaderPlatformComponent } from 'app/shared/components/header-platform/header-platform.component';
import { MenuAsideComponent } from 'app/shared/components/menu-aside/menu-aside.component';

@Component({
  selector: 'dealhub-list-subcategories',
  imports: [CommonModule, HeaderPlatformComponent, MenuAsideComponent, FormsModule, RouterModule],
  templateUrl: './list-subcategories.component.html',
  styleUrl: './list-subcategories.component.scss'
})
export class ListSubcategoriesComponent implements OnInit {
  subcategories: any[] = [];
  searchTerm = '';
  selectAll = false;
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  itemsPerPage = 10;

  constructor(
    private subcategoryService: SubcategoryService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.getDataSubcategories();
  }

  getDataSubcategories() {
    this.subcategoryService.getAllDataSubcategories(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        this.subcategories = response.subcategorias.map((s: any) => ({
          ...s,
          selected: false
        }));
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
      },
      error: (err) => console.error('Erro ao buscar categorias:', err)
    });
  }

  filteredSubcategories() {
    return this.subcategories.filter(c =>
      c.nome.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleSelectAll() {
    this.filteredSubcategories().forEach(c => c.selected = this.selectAll);
  }

  totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getDataSubcategories();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.getDataSubcategories();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.getDataSubcategories();
  }

  deleteSubcategory(subcategory: any) {
    if (confirm(`Deseja realmente excluir "${subcategory.nome}"?`)) {
      this.subcategoryService.deleteSubcategory(subcategory.id).subscribe({
        next: () => this.getDataSubcategories(),
        error: (err) => console.error('Erro ao excluir:', err)
      });
    }
  }
}
