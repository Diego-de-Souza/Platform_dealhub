import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserData } from 'app/core/interface/user.interface';
import { ToastService } from 'app/core/services/toast/toast.service';
import { UserService } from 'app/core/services/user/user.service';
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
  id_user = 0;

  form:UserData = {
    nome: '',
    apelido: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    cpf: '',
    telefone: '',
    dataNascimento: '',
    role: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    principal: true
  };

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private userService: UserService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loadUserData(Number(id));
    }
  }

  loadUserData(id: number) {
    this.userService.getDataUser(id).subscribe({
      next: (response)=>{
        this.id_user = response.id;
        this.form = {
          nome: response.nome || '',
          apelido: response.apelido || '',
          email: response.email || '',
          senha: '',
          confirmarSenha: '',
          cpf: response.cpf || '',
          telefone: response.telefone || '',
          dataNascimento: response.dataNascimento || '',
          role: response.role,
          cep: response.endereco.cep || '',
          logradouro: response.endereco.logradouro || '',
          numero: response.endereco.numero || '',
          complemento: response.endereco.complemento || '',
          bairro: response.endereco.bairro || '',
          cidade: response.endereco.cidade || '',
          estado: response.endereco.estado || '',
          principal: response.endereco.principal || true
        }
      },
      error: (err)=>{
        console.error('Erro ao carregar dados do usuário:', err);
        const msg = err?.error || 'Não foi possível buscar dados usuário.';
        this.toast.showToast(msg, 'error');
      }
    })
    console.log('Carregar dados do usuário com id:', id);
  }

  onSubmit() {
    if (this.isEdit) {
      this.userService.updateUser(this.form, this.id_user).subscribe({
        next: ()=>{
          this.toast.showToast('Atualização realizado com sucesso!', 'success');
          this.router.navigate(['/platform/list-users']);
        },
        error:(err)=>{
          console.error('Erro ao atualizar dados do usuário:', err);
          const msg = err?.error || 'Não foi possível efetuar a atualização.';
          this.toast.showToast(msg, 'error');
        }
      })
    } else {
      this.userService.createUser(this.form).subscribe({
        next: ()=>{
          this.toast.showToast('Criação de usuário realizado com sucesso!', 'success');
          this.router.navigate(['/platform/list-users']);
        },
        error:(err)=>{
          console.error('Erro ao criar dados do usuário:', err);
          const msg = err?.error || 'Não foi possível efetuar criação de usuário.';
          this.toast.showToast(msg, 'error');
        }
      })
    }
  }
}
