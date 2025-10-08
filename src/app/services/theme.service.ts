import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDark = signal(false);
  
  constructor() {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDark.set(savedTheme === 'dark');
    } else {
      // Check system preference
      this.isDark.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    
    this.applyTheme();
  }

  get isDarkMode() {
    return this.isDark.asReadonly();
  }

  toggleTheme() {
    this.isDark.update(current => !current);
    this.applyTheme();
    localStorage.setItem('theme', this.isDark() ? 'dark' : 'light');
  }

  setTheme(isDark: boolean) {
    this.isDark.set(isDark);
    this.applyTheme();
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  private applyTheme() {
    const body = document.body;
    if (this.isDark()) {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }
  }
}