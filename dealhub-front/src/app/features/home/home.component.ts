import { Component, OnInit } from '@angular/core';
import { BestSellersComponent } from 'app/shared/components/best-sellers/best-sellers.component';
import { DealsComponent } from 'app/shared/components/deals/deals.component';
import { DepartamentsComponent } from 'app/shared/components/departaments/departaments.component';
import { FeaturedProductsComponent } from 'app/shared/components/featured-products/featured-products.component';
import { FooterComponent } from 'app/shared/components/footer/footer.component';
import { HeaderComponent } from 'app/shared/components/header/header.component';
import { NewProductsComponent } from 'app/shared/components/new-products/new-products.component';
import { SliderComponent } from 'app/shared/components/slider/slider.component';

@Component({
  selector: 'dealhub-home',
  imports: [
    HeaderComponent, 
    FooterComponent, 
    SliderComponent, 
    FeaturedProductsComponent,
    DealsComponent,
    DepartamentsComponent,
    NewProductsComponent,
    BestSellersComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent{

}
