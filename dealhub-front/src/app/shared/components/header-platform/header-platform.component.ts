import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/services/auth/auth.service';
import { ToastService } from 'app/core/services/toast/toast.service';

@Component({
  selector: 'dealhub-header-platform',
  imports: [CommonModule],
  templateUrl: './header-platform.component.html',
  styleUrl: './header-platform.component.scss'
})
export class HeaderPlatformComponent implements OnInit {
  userMenuOpen = false;
  userName: string | null = 'Usuário';

  @Input() titleHeader: String = "Dashboard";

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ){}

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('name')?.split(' ')[0] || null;
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  logout() {
    this.authService.logout().subscribe({
      next: ()=>{
        this.router.navigate(['/login']);
      },
      error: (err)=>{
        const msg = err?.error || 'Ocorreu um erro ao tentar deslogar.';
        this.toast.showToast(msg, 'error');
      }
    });    
  }
}
