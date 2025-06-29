import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '@environment/environment';
import { jwtDecode } from 'jwt-decode';
import { CustomJwtPayload } from 'app/core/interface/jwtPayload.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);
  private tokenSubject = new BehaviorSubject<string | null>(sessionStorage.getItem('accessToken'));
  public token$ = this.tokenSubject.asObservable();

  constructor() { }

  isLoggedIn(): boolean {
    return !!this.getToken(); 
  }


  login(email:string, password: string): Observable<any> {
    const loginData = { email, password };
    return this.http.post<any>(`${environment.apiUrl}/api/auth/login`, loginData, { withCredentials: true })
    .pipe(
      tap({
        next: (res: any) => {
          this.setToken(res.accessToken);
          try {
            const decoded = jwtDecode<CustomJwtPayload>(res.accessToken);;
            sessionStorage.setItem('role', decoded.role);
            if (decoded.name) {
              sessionStorage.setItem('name', decoded.name);
            }
            if(decoded.sub){
              sessionStorage.setItem('email',decoded.sub);
            }
            if(decoded.id){
              sessionStorage.setItem('id',decoded.id);
            }
            console.log(decoded);
          } catch (e) {
            console.error('Error decoding token:', e);
          }
        },
        error: (err) => {
          console.error('Error in login:', err);
        }
      })
    )
  }

  setToken(token: string) {
    sessionStorage.setItem('accessToken', token);
    this.tokenSubject.next(token);
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  logout(): Observable<any>{
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('id');
    this.tokenSubject.next(null);
    return this.http.post(`${environment.apiUrl}/api/auth/logout`, {});
  }

  refreshToken(): Observable<any> {
    return this.http.post('/api/auth/refresh-token', {}).pipe(
      tap((res: any) => {
        this.setToken(res.accessToken);
      })
    );
  }
  
}

