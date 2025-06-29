// list-users.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserList } from 'app/core/interface/user.interface';
import { UserService } from 'app/core/services/user/user.service';
import { HeaderPlatformComponent } from 'app/shared/components/header-platform/header-platform.component';
import { MenuAsideComponent } from 'app/shared/components/menu-aside/menu-aside.component';

// Atualize sua interface UserList para incluir status
  // Ou adicione um tipo local se não puder modificar a original
  type DisplayUser = UserList & { selected: boolean; status: string };

@Component({
  selector: 'dealhub-list-users',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderPlatformComponent, MenuAsideComponent],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.scss'
})
export class ListUsersComponent implements OnInit {
  users = signal<UserList[]>([]);
  searchTerm = signal('');
  selectAll = signal(false);

  currentPage = signal(0);
  itemsPerPage = signal(10);
  totalPages = signal(0);

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.getlistUsers();
  }

  getlistUsers() {
    this.userService.getLIstUsers(this.currentPage(), this.itemsPerPage()).subscribe({
      next: (response) => {
        this.users.set(response.content.map((user:UserList) => ({
          ...user,
          selected: false,
          status: 'Ativo' // Adicionando status temporariamente
        })));
        this.totalPages.set(Math.ceil(response.totalElements / this.itemsPerPage()));
        this.selectAll.set(false);
      },
      error: (err) => console.error('Erro:', err)
    });
  }

  filteredUsers() {
    return this.users().filter(user =>
      user.nome.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm().toLowerCase())
    );
  }

  toggleSelectAll() {
    this.selectAll.update(value => !value);
    this.users.update(users => 
      users.map(user => ({ ...user, selected: this.selectAll() }))
    )
  }

  deleteUser(user: UserList) {
    const confirmDelete = confirm(`Excluir ${user.nome}?`);
    if (confirmDelete) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => this.getlistUsers(),
        error: (err) => console.error('Erro ao excluir:', err)
      });
    }
  }

  paginatedUsers() {
    const startIndex = this.currentPage() * this.itemsPerPage();
    return this.filteredUsers().slice(startIndex, startIndex + this.itemsPerPage());
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