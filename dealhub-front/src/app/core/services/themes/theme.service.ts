import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private currentTheme: 'light' | 'dark' = 'light';

  constructor() {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    this.setTheme(savedTheme || 'light');
  }

  setTheme(theme: 'light' | 'dark') {
    this.currentTheme = theme;
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem('theme', theme);
  }

  toggleTheme() {
    this.setTheme(this.currentTheme === 'light' ? 'dark' : 'light');
  }

  getTheme() {
    return this.currentTheme;
  }
}
