import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderPlatformComponent } from 'app/shared/components/header-platform/header-platform.component';
import { MenuAsideComponent } from 'app/shared/components/menu-aside/menu-aside.component';

@Component({
  selector: 'dealhub-create-user',
  imports: [CommonModule, HeaderPlatformComponent, MenuAsideComponent, FormsModule, RouterModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent {
  isEdit = false;

  form = {
    nome: '',
    apelido: '',
    email: '',
    cpf: '',
    telefone: '',
    dataNascimento: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    enderecoPrincipal: true,
    senha: '',
    confirmarSenha: '',
  };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loadUserData(id);
    }
  }

  loadUserData(id: string) {
    // Aqui faz uma chamada ao backend para buscar os dados do usuário/produto
    console.log('Carregar dados do usuário com id:', id);

    // Exemplo (mock):
    this.form = {
      nome: 'João da Silva',
      apelido: 'joaosilva',
      email: 'joao@email.com',
      cpf: '123.456.789-00',
      telefone: '(11) 91234-5678',
      dataNascimento: '1990-01-01',
      cep: '01000-000',
      logradouro: 'Rua Exemplo',
      numero: '123',
      complemento: 'Apto 45',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      enderecoPrincipal: true,
      senha: '',
      confirmarSenha: '',
    };
  }

  onSubmit() {
    if (this.isEdit) {
      console.log('Atualizar usuário:', this.form);
      // Chamada para serviço de atualização
    } else {
      console.log('Cadastrar novo usuário:', this.form);
      // Chamada para serviço de criação
    }

    this.router.navigate(['/users']);
  }
}
