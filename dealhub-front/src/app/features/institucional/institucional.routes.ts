import { Routes } from "@angular/router";

export const institucionalRoutes: Routes = [
    {
        path: 'about',
        loadComponent: () => import('./about/about.component').then(m => m.AboutComponent)
    },
    {
        path: 'terms',
        loadComponent: () => import('./terms/terms.component').then(m => m.TermsComponent)
    },
    {
        path: 'policy-privacy',
        loadComponent: () => import('./privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent)
    },
    {
        path: 'exchange-and-return',
        loadComponent: () => import('./exchange-and-return/exchange-and-return.component').then(m => m.ExchangeAndReturnComponent)
    }
];