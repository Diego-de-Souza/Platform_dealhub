import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private readonly http = inject(HttpClient);

  constructor() { }

  getAllOrders(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/plataforma/admin-order/listar/all?page=${page}&size=${size}`);
  }
}
