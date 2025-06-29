import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadChildren: () => import('./features/home/home.routes').then(m => m.homeRoutes)
    },
    {
        path: 'institucional',
        loadChildren: () => import('./features/institucional/institucional.routes').then(m => m.institucionalRoutes)
    },
    {
        path: 'shopping',
        loadChildren: () => import('./features/shopping/shopping.routes').then(m => m.shoppingRoutes),
        canActivate: [authGuard]
    },
    {
        path: 'login',
        loadChildren: () => import('./features/login/login.routes').then(m => m.loginRoutes)
    },
    {
        path: 'platform',
        loadChildren: ()=> import('./features/platform/platform.routes').then(m => m.platformRoutes),
        canActivate: [authGuard]
    }
];