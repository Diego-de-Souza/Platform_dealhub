import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { featuredProducts } from 'app/shared/storage/data/feature-products.data';

@Component({
  selector: 'dealhub-featured-products',
  imports: [],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.scss'
})
export class FeaturedProductsComponent {
  public featuredProducts = featuredProducts;

  constructor( private router: Router){}

  seeMore(_id: number){
    this.router.navigate([`/shopping/product/:${_id}`]);
  }
}
