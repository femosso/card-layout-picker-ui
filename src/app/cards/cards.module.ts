import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { CardsRoutingModule } from './cards-routing.module';
import { LayoutComponent } from './layout.component';
import { CardFormComponent } from './card-form/card-form.component';
import { ListComponent } from './list.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CardsRoutingModule,
        NgxDropzoneModule
    ],
    declarations: [
        LayoutComponent,
        ListComponent,
        CardFormComponent
    ]
})
export class CardsModule { }