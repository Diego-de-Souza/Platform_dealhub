import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Categoria } from 'app/core/interface/categoria.interface';
import { ProductData } from 'app/core/interface/product.interface';
import { Subcategoria } from 'app/core/interface/subcategoria.interface';
import { CategoryService } from 'app/core/services/category/category.service';
import { ProductService } from 'app/core/services/product/product.service';
import { SubcategoryService } from 'app/core/services/subcategory/subcategory.service';
import { ToastService } from 'app/core/services/toast/toast.service';
import { HeaderPlatformComponent } from 'app/shared/components/header-platform/header-platform.component';
import { MenuAsideComponent } from 'app/shared/components/menu-aside/menu-aside.component';

@Component({
  selector: 'dealhub-create-product',
  standalone: true,
  imports: [
    CommonModule, 
    HeaderPlatformComponent, 
    MenuAsideComponent, 
    FormsModule, 
    RouterModule, 
    ReactiveFormsModule
  ],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss'
})
export class CreateProductComponent {
  isEdit = false;
  id_product = 0;
  productForm: FormGroup;
  statusList = [];
  categorias: any[] = []; 
  subcategorias: any[] = []; 
  selectedFiles: File[] = [];
  selectedCategoria: Categoria[] = [];
  selectedSubcategoria: Subcategoria[] = [];
  filteredSubcategorias: any[] = [];
  loadedImages: string[] = [];


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute, 
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private toast: ToastService
  ) {
    this.productForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      preco: [0, [Validators.required, Validators.min(0)]],
      estoque: [0, [Validators.required, Validators.min(0)]],
      porcentagemDesconto: [0, [Validators.min(0), Validators.max(100)]],
      marca: [''],
      modelo: [''],
      mesesGarantia: [0, Validators.min(0)],
      status: ['', Validators.required],
      peso: [0, Validators.required],
      altura: [0, Validators.required],
      largura: [0, Validators.required],
      profundidade: [0, Validators.required],
      destaque: [true],
      visivel: [true],
      categoriaId: ['', Validators.required],
      subcategoriaId: ['']
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    // Desabilita subcategoria
    this.productForm.get('subcategoriaId')?.disable();

    // Espera todas as listas carregarem antes de carregar o produto
    Promise.all([
      this.loadCategorias(),
      this.loadSubcategorias(),
      this.loadStatus()
    ]).then(() => {
      if (id) {
        this.isEdit = true;
        this.loadProductData(Number(id));
      }
    });
  }


  loadCategorias(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.categoryService.getAllCategory().subscribe({
        next: (response) => {
          this.categorias = response;
          console.log(this.categorias);
          resolve();
        },
        error: (err) => {
          const msg = err?.error || 'Não foi possível buscar dados da categoria.';
          this.toast.showToast(msg, 'error');
          reject(err);
        }
      });
    });
  }

  loadSubcategorias(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.subcategoryService.getAllSubcategory().subscribe({
        next: (response) => {
          this.subcategorias = response;
          console.log(this.subcategorias);
          resolve();
        },
        error: (err) => {
          const msg = err?.error || 'Não foi possível buscar dados da subcategoria.';
          this.toast.showToast(msg, 'error');
          reject(err);
        }
      });
    });
  }

  loadStatus(){
    this.productService.getAllStatus().subscribe({
      next: (response)=>{
        this.statusList = response.status;
        console.log(this.statusList)
      },
      error: (err)=>{
        console.error('Erro ao carregar Status do produto:', err);
        const msg = err?.error || 'Não foi possível buscar status do produto.';
        this.toast.showToast(msg, 'error');
      }
    })
  }

  loadProductData(id: number) {
    this.productService.getDataProduct(id).subscribe({
      next: (response) => {
        console.log(response)
        this.id_product = response.produto.id;
        this.productForm.patchValue({
          nome: response.produto.nome,
          descricao: response.produto.descricao,
          preco: response.produto.preco,
          estoque: response.produto.estoque,
          porcentagemDesconto: response.produto.porcentagemDesconto,
          marca: response.produto.marca,
          modelo: response.produto.modelo,
          mesesGarantia: response.produto.mesesGarantia,
          status: String(response.produto.status),
          peso: response.produto.peso,
          altura: response.produto.altura,
          largura: response.produto.largura,
          profundidade: response.produto.profundidade,
          destaque: response.produto.destaque,
          visivel: response.produto.visivel,
          categoriaId: response.produto.categoria_id || '',
          subcategoriaId: response.produto.subcategoria_id || '',
          imagens: response.produto.imagens
        });

        this.loadedImages = response.produto.imagens || [];

        console.log(this.productForm);
        this.onCategoriaChange();
        console.log('Subcategoria selecionada:', this.productForm.get('subcategoriaId')?.value);
        console.log('Subcategorias filtradas:', this.filteredSubcategorias);

      },
      error: (err) => {
        console.error('Erro ao carregar dados do produto:', err);
        const msg = err?.error || 'Não foi possível buscar dados do produto.';
        this.toast.showToast(msg, 'error');
      }
    });
  }

  onFileChange(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.toast.showToast('Por favor, preencha todos os campos obrigatórios', 'error');
      return;
    }

    const formData = new FormData();
    const formValue = this.productForm.value;

    // Append all form fields
    Object.keys(formValue).forEach(key => {
      if (key !== 'imagens' && formValue[key] !== null && formValue[key] !== undefined) {
        formData.append(key, String(formValue[key]));
      }
    });

    // Append files
    this.selectedFiles.forEach(file => {
      formData.append('imagens', file);
    });

    if (this.isEdit) {
      this.productService.updateProduct(formData, this.id_product).subscribe({
        next: () => {
          this.toast.showToast('Produto atualizado com sucesso!', 'success');
          this.router.navigate(['/platform/list-products']);
        },
        error: (err) => {
          console.error('Erro ao atualizar produto:', err);
          const msg = err?.error || 'Não foi possível atualizar o produto.';
          this.toast.showToast(msg, 'error');
        }
      });
    } else {
      this.productService.createProduct(formData).subscribe({
        next: () => {
          this.toast.showToast('Produto criado com sucesso!', 'success');
          this.router.navigate(['/platform/list-products']);
        },
        error: (err) => {
          console.error('Erro ao criar produto:', err);
          const msg = err?.error || 'Não foi possível criar o produto.';
          this.toast.showToast(msg, 'error');
        }
      });
    }
  }

  onCategoriaChange() {
    const categoriaId = this.productForm.get('categoriaId')?.value;

    if (categoriaId) {
      this.filteredSubcategorias = this.subcategorias.filter(
        sub => sub.categoria_id === +categoriaId
      );
      this.productForm.get('subcategoriaId')?.enable();
    } else {
      this.filteredSubcategorias = [];
      this.productForm.get('subcategoriaId')?.disable();
    }

    if (!this.isEdit) {
      this.productForm.get('subcategoriaId')?.reset();
    }
  }
}