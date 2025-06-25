import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderPlatformComponent } from 'app/shared/components/header-platform/header-platform.component';
import { MenuAsideComponent } from 'app/shared/components/menu-aside/menu-aside.component';
@Component({
  selector: 'dealhub-create-category',
  imports: [CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HeaderPlatformComponent,
    MenuAsideComponent],
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.scss'
})
export class CreateCategoryComponent {
  categoriaForm!: FormGroup;
  isEditMode = false;
  categoriaId!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoriaForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.categoriaId = id;
        this.loadCategoria(id);
      }
    });
  }

  loadCategoria(id: string) {
    // Simula o carregamento dos dados da categoria
    const categoria = {
      nome: 'Eletrônicos',
      descricao: 'Itens de tecnologia e informática'
    };
    this.categoriaForm.patchValue(categoria);
  }

  submit(): void {
    if (this.categoriaForm.invalid) return;

    const dados = this.categoriaForm.value;
    if (this.isEditMode) {
      console.log('Atualizar categoria:', dados);
      // Chamada para atualizar categoria
    } else {
      console.log('Criar categoria:', dados);
      // Chamada para criar nova categoria
    }

    this.router.navigate(['/categorias']);
  }
}
