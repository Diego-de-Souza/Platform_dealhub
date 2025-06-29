export interface UserList {
  id: number;
  nome: string;
  apelido: string;
  email: string;
  role: string;
  dataNascimento: Date;
  status: 'Ativo' | 'Inativo'; 
  selected?: boolean;
}

export interface UserData {
  nome: string;
  apelido: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  cpf: string;
  telefone: string;
  dataNascimento: string;
  role: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  principal: boolean;
}