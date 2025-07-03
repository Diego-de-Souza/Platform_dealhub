import { Routes } from "@angular/router";


export const platformRoutes: Routes = [
    {
        path: 'admin',
        title: 'Tela de administracao',
        loadComponent: ()=> import('./admin/admin.component').then(m=> m.AdminComponent)
    },
    {
        path: 'list-users',
        title: 'Users list',
        loadComponent: ()=> import('./users/list-users/list-users.component').then(m => m.ListUsersComponent)
    },
    {
        path: 'create-user',
        title: 'User create',
        loadComponent: ()=> import('./users/create-user/create-user.component').then(m => m.CreateUserComponent)
    },
    {
        path: 'create-user/:id',
        title: 'User edit',
        loadComponent: () =>
            import('./users/create-user/create-user.component').then(m => m.CreateUserComponent),
    },
    {
        path: 'list-products',
        title: 'Products list',
        loadComponent: ()=> import('./products/list-products/list-products.component').then(m => m.ListProductsComponent)
    },
    {
        path: 'create-product',
        title: 'Product create',
        loadComponent: ()=> import('./products/create-product/create-product.component').then(m => m.CreateProductComponent)
    },
    {
        path: 'create-product/:id',
        title: 'Product edit',
        loadComponent: ()=> import('./products/create-product/create-product.component').then(m => m.CreateProductComponent)
    },
    {
        path: 'list-categories',
        title: 'Categories list',
        loadComponent: ()=> import('./categories/list-categories/list-categories.component').then(m => m.ListCategoriesComponent)
    },
    {
        path: 'create-category',
        title: 'Category create',
        loadComponent: ()=> import('./categories/create-category/create-category.component').then(m => m.CreateCategoryComponent)
    },
    {
        path: 'create-category/:id',
        title: 'Category edit',
        loadComponent: ()=> import('./categories/create-category/create-category.component').then(m => m.CreateCategoryComponent)
    },
    {
        path: 'list-subcategories',
        title: 'Subcategories list',
        loadComponent: ()=> import('./subcategories/list-subcategories/list-subcategories.component').then(m => m.ListSubcategoriesComponent)
    },
    {
        path: 'create-subcategory',
        title: 'Subcategory create',
        loadComponent: ()=> import('./subcategories/create-subcategory/create-subcategory.component').then(m => m.CreateSubcategoryComponent)
    },
    {
        path: 'create-subcategory/:id',
        title: 'Subcategory edit',
        loadComponent: ()=> import('./subcategories/create-subcategory/create-subcategory.component').then(m => m.CreateSubcategoryComponent)
    },
    {
        path: 'list-orders',
        title: 'Orders list',
        loadComponent: ()=> import('./orders/list-orders/list-orders.component').then(m => m.ListOrdersComponent)
    }
]