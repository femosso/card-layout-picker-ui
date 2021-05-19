import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { OrderFormComponent } from './order-form/order-form.component';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderFormCompleteComponent } from './order-form-complete/order-form-complete.component';
import { OrderFormValidateComponent } from './order-form-validate/order-form-validate.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        OrdersRoutingModule,
        NgxDropzoneModule,
        FontAwesomeModule,
        SharedModule,
        NgbModule
    ],
    declarations: [
        OrdersComponent,
        OrderListComponent,
        OrderFormComponent,
        OrderFormCompleteComponent,
        OrderFormValidateComponent
    ]
})
export class OrdersModule { }