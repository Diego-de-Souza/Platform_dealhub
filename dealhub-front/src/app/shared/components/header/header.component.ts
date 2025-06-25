import { CommonModule } from '@angular/common';
import { Component, inject, OnChanges, SimpleChanges } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from 'app/core/services/storage/storage.service';
import { ThemeService } from 'app/core/services/themes/theme.service';

@Component({
  selector: 'dealhub-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  dropdownOpen = false;
  isLoggedIn = false; // Atualize conforme sua lógica real
  userName = 'Usuário';
  
  isSubmenuOpen = false;

  hoverPrivacy = false;
  hoverSecurity = false;
  hoverExchange = false;

  constructor(public themeService: ThemeService, private router: Router) {}

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  logout() {
    this.isLoggedIn = false;
    this.dropdownOpen = false;
    // Aqui faça a limpeza de tokens etc
    this.router.navigate(['/login']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  mobileMenuOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    console.log('Mobile menu toggled:', this.mobileMenuOpen);
  }

  toggleSubmenu(event: MouseEvent) {
    event.stopPropagation(); // Impede que o clique no botão feche imediatamente pelo listener global
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }

  closeSubmenu() {
    this.isSubmenuOpen = false;
  }

  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.relative');
    if (!clickedInside) {
      this.isSubmenuOpen = false;
    }
  }


}
