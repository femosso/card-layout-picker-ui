import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../_helpers/auth.guard';
import { OrdersComponent } from './orders.component';
import { OrderFormComponent } from './order-form/order-form.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderFormCompleteComponent } from './order-form-complete/order-form-complete.component';
import { OrderFormValidateComponent } from './order-form-validate/order-form-validate.component';

const routes: Routes = [
    {
        path: '', component: OrdersComponent,
        children: [
            { path: '', component: OrderListComponent, canActivate: [AuthGuard] },
            { path: 'add', component: OrderFormComponent, canActivate: [AuthGuard] },
            { path: ':id/complete', component: OrderFormCompleteComponent },
            { path: ':id/validate', component: OrderFormValidateComponent, canActivate: [AuthGuard] }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrdersRoutingModule { }