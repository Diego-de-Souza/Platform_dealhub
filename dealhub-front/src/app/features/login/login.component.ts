import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    private toast: ToastService
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

    if (email === 'teste@email.com' && password === '123456') {
      this.toast.showToast('Login realizado com sucesso!', 'success');
      this.router.navigate(['/home']);
    } else {
      this.toast.showToast('Email ou senha inválidos.', 'error');
    }
  }
}
