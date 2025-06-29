import { CommonModule } from '@angular/common';
import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'app/core/services/auth/auth.service';
import { StorageService } from 'app/core/services/storage/storage.service';
import { ThemeService } from 'app/core/services/themes/theme.service';
import { ToastComponent } from '../toast/toast.component';
import { ToastService } from 'app/core/services/toast/toast.service';

@Component({
  selector: 'dealhub-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  dropdownOpen = false;
  isLoggedIn = false; // Atualize conforme sua lógica real
  userName: string | null = 'Usuário';
  
  isSubmenuOpen = false;

  hoverPrivacy = false;
  hoverSecurity = false;
  hoverExchange = false;

  constructor(
    public themeService: ThemeService, 
    private router: Router,
    private authService: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userName = sessionStorage.getItem('name')?.split(' ')[0] || null;
  }

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
    this.authService.logout().subscribe({
      next: ()=>{
        this.isLoggedIn = false;
        this.dropdownOpen = false;
        this.router.navigate(['/login']);
      },
      error: (err)=>{
        const msg = err?.error || 'Ocorreu um erro ao tentar deslogar.';
        this.toast.showToast(msg, 'error');
      }
    });    
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
