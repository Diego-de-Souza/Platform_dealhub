export interface Produto {
  id: string | null;
  name: string;
  descricao: string;
  preco: number;
  precoOriginal: number;
  desconto: boolean;
  imagemPrincipal: string;
  imagensSecundarias: string[];
  especificacoes: string[];
}
