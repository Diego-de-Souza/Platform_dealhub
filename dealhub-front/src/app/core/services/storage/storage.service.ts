import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly prefix = 'myapp_';

  getItem(key: string): string | null {
    return localStorage.getItem(this.prefix + key);
  }
  
  removeItem(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  setItem(key: string, data: string): void {
    localStorage.setItem(this.prefix + key, data);
  }

  // Novo: Armazenamento de objetos
  getObject<T>(key: string): T | null {
    const item = this.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  setObject(key: string, data: any): void {
    this.setItem(key, JSON.stringify(data));
  }

  // Novo: Limpar todos os itens do app
  clearAppStorage(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => localStorage.removeItem(key));
  }
}