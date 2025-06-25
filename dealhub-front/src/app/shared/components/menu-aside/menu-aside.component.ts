import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'dealhub-menu-aside',
  imports: [CommonModule, RouterLink],
  templateUrl: './menu-aside.component.html',
  styleUrl: './menu-aside.component.scss'
})
export class MenuAsideComponent {

  menus: { [key: string]: boolean } = {
    users: false,
    products: false,
    categories: false,
    subcategories: false,
  };

  toggleMenu(menuName: string) {
    this.menus[menuName] = !this.menus[menuName];
  }
}
