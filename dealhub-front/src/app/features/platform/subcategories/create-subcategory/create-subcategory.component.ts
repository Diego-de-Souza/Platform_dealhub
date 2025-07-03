import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoryService } from 'app/core/services/category/category.service';
import { SubcategoryService } from 'app/core/services/subcategory/subcategory.service';
import { ToastService } from 'app/core/services/toast/toast.service';
import { HeaderPlatformComponent } from 'app/shared/components/header-platform/header-platform.component';
import { MenuAsideComponent } from 'app/shared/components/menu-aside/menu-aside.component';

@Component({
  selector: 'dealhub-create-subcategory',
  standalone: true,
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
  categorias: any[] = [];
  isEditMode = false;
  subcategoriaId!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoriaService: CategoryService,
    private subcategoryService: SubcategoryService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.subcategoryForm = this.fb.group({
      id: [''],
      nome: ['', Validators.required],
      categoriaId: ['', Validators.required]
    });

    // Carregar categorias pai
    this.categoriaService.getAllDataCategories(0, 100).subscribe({
      next: (response) => {
        this.categorias = response.categorias;
      },
      error: (err) => console.error('Erro ao buscar categorias:', err)
    });

    // Verificar se é modo edição
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.subcategoriaId = id;
        this.loadSubcategory(Number(id));
      }
    });
  }

  loadSubcategory(id: number) {
    this.subcategoryService.getDataSubcategory(id).subscribe({
      next: (response) => {
        this.subcategoryForm.patchValue({
          id: response.id,
          nome: response.nome,
          categoriaId: response.categoria_id
        });
      },
      error: (err) => console.error('Erro ao buscar subcategoria:', err)
    });
  }

  submit(): void {
    if (this.subcategoryForm.invalid) return;

    const dados = this.subcategoryForm.value;

    if (this.isEditMode) {
      this.subcategoryService.updateSubcategory(dados, dados.id).subscribe({
        next: () => {
          this.toast.showToast('Subcategoria atualizada com sucesso!', 'success');
          this.router.navigate(['/platform/list-subcategories']);
        },
        error: (err) => {
          console.error('Erro ao atualizar subcategoria:', err);
          this.toast.showToast(err?.error || 'Erro ao atualizar subcategoria.', 'error');
        }
      });
    } else {
      this.subcategoryService.createSubcategory(dados).subscribe({
        next: () => {
          this.toast.showToast('Subcategoria criada com sucesso!', 'success');
          this.router.navigate(['/platform/list-subcategories']);
        },
        error: (err) => {
          console.error('Erro ao criar subcategoria:', err);
          this.toast.showToast(err?.error || 'Erro ao criar subcategoria.', 'error');
        }
      });
    }
  }
}
