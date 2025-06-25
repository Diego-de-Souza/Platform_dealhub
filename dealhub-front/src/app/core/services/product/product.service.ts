import { Injectable } from '@angular/core';
import { Novidades } from 'app/core/interface/new-product.interface';
import { Product } from 'app/shared/storage/data/product.data';
import { delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private produtos: Novidades[] = Product;

  getProdutos(pagina = 1, categoria?: string, filtro?: string | null) {
    let filtrados = [...this.produtos];

    if (categoria) {
      filtrados = filtrados.filter(p => p.name.includes(categoria));
    }

    if (filtro) {
      filtrados = filtrados.slice(0, 10); // Simula "mais vendidos", etc.
    }

    const porPagina = 20;
    const inicio = (pagina - 1) * porPagina;
    const paginaProdutos = filtrados.slice(inicio, inicio + porPagina);
    const totalPaginas = Math.ceil(filtrados.length / porPagina);

    return of({ produtos: paginaProdutos, totalPaginas }).pipe(delay(500));
  }
}
