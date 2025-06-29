import { Categoria } from "./categoria.interface";
import { Subcategoria } from "./subcategoria.interface";

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

export interface ProductList {
  id: number;
  nome: string;
  marca: string;
  destaque: boolean;
  visivel: boolean;
  status: string;
  selected?: boolean;
}

export interface ProductData {
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  porcentagemDesconto: number;
  marca: string;
  modelo:string;
  status: string;
  peso: number;
  altura: number;
  largura: number;
  profundidade: number;
  destaque: boolean;
  visivel: boolean;
  mesesGarantia: number;
  categoria: string;
  subcategoria: string;
  imagens: string[];
  dataCadastro: Date;
  dataAtualizacao: Date;

  categoriaId: number;
  SubcategoriaId: number;
}
