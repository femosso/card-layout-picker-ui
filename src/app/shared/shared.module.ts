import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingComponent } from './loading/loading.component';
import { DatePlaceholderPipe, NgbDateToUtcDateFormatPipe, StatusNameFormat, UtcToDateFormatPipe } from './pipes/datetime.pipe';
import { NgbdSortableHeader } from './table/sortable.directive';

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [
        LoadingComponent,
        DatePlaceholderPipe,
        NgbDateToUtcDateFormatPipe,
        UtcToDateFormatPipe,
        StatusNameFormat,
        NgbdSortableHeader
    ],
    declarations: [
        LoadingComponent,
        DatePlaceholderPipe,
        NgbDateToUtcDateFormatPipe,
        UtcToDateFormatPipe,
        StatusNameFormat,
        NgbdSortableHeader
    ],
    providers: [
        DatePlaceholderPipe,
        NgbDateToUtcDateFormatPipe,
        UtcToDateFormatPipe,
        StatusNameFormat,
        NgbdSortableHeader
    ],
})
export class SharedModule { }