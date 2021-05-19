import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CardsComponent } from './cards.component';
import { CardFormComponent } from './card-form/card-form.component';
import { CardListComponent } from './card-list/card-list.component';
import { AuthGuard } from '../_helpers/auth.guard';

const routes: Routes = [
    {
        path: '', component: CardsComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: CardListComponent },
            { path: 'add', component: CardFormComponent },
            { path: 'edit/:id', component: CardFormComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CardsRoutingModule { }