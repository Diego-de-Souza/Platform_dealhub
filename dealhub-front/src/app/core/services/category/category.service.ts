import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly http = inject(HttpClient);
  constructor() { }

  getAllCategory(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/plataforma/admin-categoria/all`);
  }

  getAllDataCategories(page: number = 0, size: number = 10): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/plataforma/admin-categoria/categorias/listar?page=${page}&size=${size}`)
  }

  getDataCategory(id: number): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/plataforma/admin-categoria/${id}`);
  }

  updateCategory(category: any, id:number): Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}/plataforma/admin-categoria/atualizar/${id}`, category)
  }
  
  createCategory(category: any): Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}/plataforma/admin-categoria/cadastrar/plataforma`, category);
  }
  
  deleteCategory(id:number): Observable<any>{
    return this.http.delete<any>(`${environment.apiUrl}/plataforma/admin-categoria/categoria/${id}`);
  }
}
