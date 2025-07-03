import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { Novidades } from 'app/core/interface/new-product.interface';
import { Product } from 'app/shared/storage/data/product.data';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly http = inject(HttpClient);

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

  getListProducts(page: number,size:number): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/plataforma/admin-product/produtos/listar?page=${page}&size=${size}`)
  }

  getDataProduct(id: number): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/plataforma/admin-product/${id}`);
  }
  
  updateProduct(product: any, id:number): Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}/plataforma/admin-product/atualizar/${id}`, product)
  }
  
  createProduct(product: any): Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}/plataforma/admin-product/cadastrar/plataforma`, product);
  }
  
  deleteProduct(id:number): Observable<any>{
    return this.http.delete<any>(`${environment.apiUrl}/plataforma/admin-product/${id}`);
  }

  getAllStatus(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/plataforma/admin-product/status`)
  }
}
