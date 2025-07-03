export interface Categoria {
    id: number;
    nome: string;
    descricao: string;
    ativa: boolean;
}

export interface CategoriaData {
  id: number;
  nome: string;
  descricao: string;
  ativa: boolean;
  quantidadeProdutos: number;
  quantidadeSubcategorias: number;
  selected?: boolean;
}