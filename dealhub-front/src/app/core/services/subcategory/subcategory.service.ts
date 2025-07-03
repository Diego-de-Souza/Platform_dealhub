import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {

  private readonly http = inject(HttpClient);

  constructor() { }

  getAllSubcategory(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/plataforma/admin-subcategoria/all`);
  }
  
  getAllDataSubcategories(page: number = 0, size: number = 10): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/plataforma/admin-subcategoria/subcategorias/listar?page=${page}&size=${size}`)
  }

  getDataSubcategory(id: number): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/plataforma/admin-subcategoria/${id}`);
  }

  updateSubcategory(subcategory: any, id:number): Observable<any>{
    return this.http.put<any>(`${environment.apiUrl}/plataforma/admin-subcategoria/atualizar/${id}`, subcategory)
  }
  
  createSubcategory(subcategory: any): Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}/plataforma/admin-subcategoria/cadastrar/plataforma`, subcategory);
  }
  
  deleteSubcategory(id:number): Observable<any>{
    return this.http.delete<any>(`${environment.apiUrl}/plataforma/admin-subcategoria/subcategoria/${id}`);
  }
}
