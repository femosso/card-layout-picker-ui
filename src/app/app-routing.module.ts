import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AuthGuard } from './_helpers/auth.guard';

const authModule = () => import('./auth/auth.module').then(x => x.AuthModule);
const usersModule = () => import('./users/users.module').then(x => x.UsersModule);
const cardsModule = () => import('./cards/cards.module').then(x => x.CardsModule);
const ordersModule = () => import('./orders/orders.module').then(x => x.OrdersModule);

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard], pathMatch: 'full' },
    { path: 'users', loadChildren: usersModule },
    { path: 'cards', loadChildren: cardsModule },
    { path: 'orders', loadChildren: ordersModule },
    { path: 'auth', loadChildren: authModule },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }