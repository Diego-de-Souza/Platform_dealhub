import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderPlatformComponent } from 'app/shared/components/header-platform/header-platform.component';
import { MenuAsideComponent } from 'app/shared/components/menu-aside/menu-aside.component';

@Component({
  selector: 'dealhub-create-subcategory',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HeaderPlatformComponent,
    MenuAsideComponent
  ],
  templateUrl: './create-subcategory.component.html',
  styleUrl: './create-subcategory.component.scss'
})
export class CreateSubcategoryComponent {
  subcategoryForm!: FormGroup;
  categorias = [
    { id: 1, nome: 'Eletrônicos' },
    { id: 2, nome: 'Roupas' },
    { id: 3, nome: 'Acessórios' },
  ];

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.subcategoryForm = this.fb.group({
      categoriaId: ['', Validators.required],
      nome: ['', Validators.required]
    });
  }

  submit() {
    if (this.subcategoryForm.invalid) return;

    console.log('Criar subcategoria:', this.subcategoryForm.value);
    // Chamada de serviço para salvar

    this.router.navigate(['/subcategorias']);
  }
}
