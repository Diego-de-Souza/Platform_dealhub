import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderPlatformComponent } from 'app/shared/components/header-platform/header-platform.component';
import { MenuAsideComponent } from 'app/shared/components/menu-aside/menu-aside.component';

@Component({
  selector: 'dealhub-create-product',
  imports: [CommonModule, HeaderPlatformComponent, MenuAsideComponent, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss'
})
export class CreateProductComponent {
  productForm!: FormGroup;
  isEditMode = false;
  productId!: string;

  categorias = [
    { id: 1, nome: 'Eletrônicos' },
    { id: 2, nome: 'Roupas' },
    { id: 3, nome: 'Acessórios' },
  ];

  subcategorias = [
    { id: 1, nome: 'Smartphones', categoriaId: 1 },
    { id: 2, nome: 'Notebooks', categoriaId: 1 },
    { id: 3, nome: 'Camisetas', categoriaId: 2 },
  ];

  statusList = ['ATIVO', 'INATIVO'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      nome: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      garantia: ['', Validators.required],
      preco: [0, [Validators.required, Validators.min(0)]],
      porcentagemDesconto: [0, [Validators.min(0)]],
      descricao: ['', Validators.required],
      estoque: [0, [Validators.required, Validators.min(0)]],
      peso: [0, Validators.required],
      altura: [0, Validators.required],
      largura: [0, Validators.required],
      profundidade: [0, Validators.required],
      categoriaId: ['', Validators.required],
      subcategoriaId: ['', Validators.required],
      status: ['', Validators.required],
      destaque: [false],
      disponivel: [true],
      imagens: [null],
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.productId = id;
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: string) {
    const produto = {
      nome: 'Produto Teste',
      marca: 'Marca A',
      modelo: 'Modelo X',
      garantia: '1 ano',
      preco: 100.0,
      porcentagemDesconto: 10,
      descricao: 'Descrição do produto.',
      estoque: 50,
      peso: 1.5,
      altura: 0.3,
      largura: 0.2,
      profundidade: 0.1,
      categoriaId: 1,
      subcategoriaId: 1,
      status: 'ATIVO',
      destaque: true,
      disponivel: true,
    };
    this.productForm.patchValue(produto);
  }

  onFileChange(event: any) {
    const files = event.target.files;
    this.productForm.patchValue({ imagens: files });
  }

  submit() {
    if (this.productForm.invalid) return;

    if (this.isEditMode) {
      console.log('Atualizar produto:', this.productForm.value);
      // Chamada para atualizar produto
    } else {
      console.log('Criar produto:', this.productForm.value);
      // Chamada para criar novo produto
    }
    this.router.navigate(['/produtos']);
  }
}
