import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { UserData } from '../../interface/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly http = inject(HttpClient);

  constructor() { }

  getLIstUsers(page:number, size:number): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/plataforma/admin-user/usuarios/listar?page=${page}&size=${size}`)
  }

  getDataUser(id: number): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/plataforma/admin-user/${id}`);
  }

  updateUser(user: UserData, id:number): Observable<any>{
    return this.http.put<any>(`${environment.apiUrl}/plataforma/admin-user/${id}`, user)
  }

  createUser(user: UserData): Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}/plataforma/admin-user`,user);
  }

  deleteUser(id:number): Observable<any>{
    return this.http.delete(`${environment.apiUrl}/plataforma/admin-user/${id}`);
  }
}
