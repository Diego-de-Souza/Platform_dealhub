import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@environment/environment';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private storage = inject(StorageService);
  private translate = inject(TranslateService);

  currentLanguage = signal<string>(
    this.storage.getItem('language') ||
    this.getBrowserLanguage() ||
    environment.defaultLanguage
  );

  availableLanguages = environment.supportedLanguages.map(lang => lang.value);

  constructor() {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    const lang = this.currentLanguage();
    this.translate.use(lang);
    this.setDocumentAttributes(lang);
  }

  private getBrowserLanguage(): string | null {
    const browserLang = navigator.language.split('-')[0];
    return this.availableLanguages.includes(browserLang) ? browserLang : null;
  }

  private setDocumentAttributes(lang: string): void {
    document.documentElement.lang = lang;
    // Para idiomas RTL como árabe/hebraico
    document.documentElement.dir = ['ar', 'he'].includes(lang) ? 'rtl' : 'ltr';
  }

  getAvailableLanguages(): string[] {
    return this.availableLanguages;
  }

  getLanguage() {
    return this.currentLanguage;
  }

  setLanguage(language: string): void {
    if (!this.availableLanguages.includes(language)) {
      console.warn(`Language ${language} is not supported`);
      return;
    }

    this.currentLanguage.set(language);
    this.translate.use(language);
    this.storage.setItem('language', language);
    this.setDocumentAttributes(language);
    
    // Atualiza meta tags para SEO
    this.updateMetaTags(language);
  }

  private updateMetaTags(lang: string): void {
    // Atualiza a meta tag de linguagem para SEO
    const htmlTag = document.getElementsByTagName('html')[0];
    htmlTag.lang = lang;
  }

  // Método para traduções com parâmetros
  instant(key: string, params?: Record<string, any>): string {
    return this.translate.instant(key, params);
  }
}