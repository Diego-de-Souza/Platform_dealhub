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
  
}
