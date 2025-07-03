import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoryService } from 'app/core/services/category/category.service';
import { ToastService } from 'app/core/services/toast/toast.service';
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
    private router: Router,
    private categoriaService: CategoryService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.categoriaForm = this.fb.group({
      id: [''],
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.categoriaId = id;
        this.loadCategoria(Number(id));
      }
    });
  }

  loadCategoria(id: number) {
    this.categoriaService.getDataCategory(id).subscribe({
      next: (response)=>{
        this.categoriaForm.patchValue({
          id: response.id,
          nome: response.nome,
          descricao: response.descricao
        })

        console.log(this.categoriaForm)
      },
      error: (err) => console.error('Erro ao buscar categoria:', err)
    })
  }

  submit(): void {
    if (this.categoriaForm.invalid) return;

    const dados = this.categoriaForm.value;
    if (this.isEditMode) {
      this.categoriaService.updateCategory(dados,dados.id).subscribe({
        next: () => {
          this.toast.showToast('Categoria atualizado com sucesso!', 'success');
          this.router.navigate(['/platform/list-categories']);
        },
        error: (err) => {
          console.error('Erro ao atualizar categoria:', err);
          const msg = err?.error || 'Não foi possível atualizar a categoria.';
          this.toast.showToast(msg, 'error');
        }
      })
    } else {
      this.categoriaService.createCategory(dados).subscribe({
        next: () => {
          this.toast.showToast('Categoria criada com sucesso!', 'success');
          this.router.navigate(['/platform/list-categories']);
        },
        error: (err) => {
          console.error('Erro ao criar categoria:', err);
          const msg = err?.error || 'Não foi possível criar a categoria.';
          this.toast.showToast(msg, 'error');
        }
      })
    }

    this.router.navigate(['/categorias']);
  }
}
