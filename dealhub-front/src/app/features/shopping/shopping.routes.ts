import { Routes } from "@angular/router";

export const shoppingRoutes: Routes = [
    {
        path: 'buy',
        loadComponent: () => import('./buy/buy.component').then(m => m.BuyComponent)
    },
    {
        path: 'shopping-cart',
        loadComponent: () => import('./shopping-cart/shopping-cart.component').then(m => m.ShoppingCartComponent)
    },
    {
        path: 'product/:id',
        loadComponent: () => import('./product/product.component').then(m => m.ProductComponent)
    },
    {
        path: 'checkout',
        loadComponent: () => import('./checkout/checkout.component').then(m => m.CheckoutComponent)
    }
];