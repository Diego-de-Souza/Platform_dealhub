import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'dealhub-header-platform',
  imports: [CommonModule],
  templateUrl: './header-platform.component.html',
  styleUrl: './header-platform.component.scss'
})
export class HeaderPlatformComponent {
  userMenuOpen = false;

  @Input() titleHeader: String = "Dashboard";

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  logout() {
    // Aqui você faz o processo de logout real
    // Por exemplo:
    console.log('Deslogando...');
    // AuthService.logout(); --> seu serviço
    // Redirecionar
    // this.router.navigate(['/login']);
  }
}
