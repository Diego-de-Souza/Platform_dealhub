import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/services/auth/auth.service';
import { ToastService } from 'app/core/services/toast/toast.service';

@Component({
  selector: 'dealhub-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
   loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.toast.showToast('Preencha os campos corretamente.', 'warning');
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.toast.showToast('Login realizado com sucesso!', 'success');
        const role = sessionStorage.getItem('role')
        if(role === 'ADMIN'){
          this.router.navigate(['/platform/admin'])
        }else{
          this.router.navigate(['/home']);
        }
        console.log("Seja Bem vindo ao nosso E-commerce")
      },
      error: (err) => {
        const msg = err?.error || 'Email ou senha inválidos.';
        this.toast.showToast(msg, 'error');
      }
    });
  }

}
