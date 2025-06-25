import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderPlatformComponent } from 'app/shared/components/header-platform/header-platform.component';
import { MenuAsideComponent } from 'app/shared/components/menu-aside/menu-aside.component';

@Component({
  selector: 'dealhub-list-users',
  imports: [CommonModule, RouterModule, FormsModule, HeaderPlatformComponent, MenuAsideComponent],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.scss'
})
export class ListUsersComponent {
  users = [
    { id: 1, nome: 'Diego Souza', email: 'diego@email.com', role: 'ADMIN', status: 'Ativo', selected: false },
    { id: 2, nome: 'Maria Silva', email: 'maria@email.com', role: 'USER', status: 'Ativo', selected: false },
    { id: 3, nome: 'João Pedro', email: 'joao@email.com', role: 'USER', status: 'Inativo', selected: false },
    // Adicione mais dados mockados...
  ];

  searchTerm = '';
  selectAll = false;

  currentPage = 0;
  itemsPerPage = 10;
  totalPages = 1;

  ngOnInit() {
    this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
  }

  filteredUsers() {
    const filtered = this.users.filter(user =>
      user.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    return filtered.slice(
      this.currentPage * this.itemsPerPage,
      (this.currentPage + 1) * this.itemsPerPage
    );
  }

  toggleSelectAll() {
    this.users.forEach(user => user.selected = this.selectAll);
  }

  deleteUser(user: any) {
    const confirmDelete = confirm(`Deseja excluir o usuário ${user.nome}?`);
    if (confirmDelete) {
      this.users = this.users.filter(u => u.id !== user.id);
      this.ngOnInit();
    }
  }

  totalPagesArray() {
    return Array(this.totalPages).fill(0).map((_, i) => i);
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
