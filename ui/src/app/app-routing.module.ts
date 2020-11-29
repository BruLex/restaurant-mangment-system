import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { WaiterComponent } from './waiter/waiter.component';
import { OrderComponent } from './order/order.component';
import { MenuComponent } from './menu/menu.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'admin',
    },
    {
        path: 'admin',
        component: AdminComponent
    },
    {
        path: 'waiter',
        component: WaiterComponent
    },
    {
        path: 'order',
        component: OrderComponent
    },
    {
        path: 'menu',
        component: MenuComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
