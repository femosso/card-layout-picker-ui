import { Component, QueryList, ViewChildren } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';

import { NgbdSortableHeader, SortEvent } from 'src/app/shared/table/sortable.directive';
import { Card } from 'src/app/_models/card';
import { CardService } from 'src/app/_services/card.service';

@Component({
    selector: 'app-card-list',
    templateUrl: './card-list.component.html'
})
export class CardListComponent {
    @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
    cards$: Observable<Card[]>;
    total$: Observable<number>;

    constructor(
        public service: CardService,
        private sanitizer: DomSanitizer,
    ) {
        this.cards$ = this.service.cards$;
        this.total$ = this.service.total$;
    }

    deleteCard(id: string) {
        alert("need to fix this!");
        // const card = this.cards.find(x => x.id === id);
        // card.isDeleting = true;
        // this.service.delete(id)
        //     .pipe(first())
        //     .subscribe(() => {
        //         this.cards = this.cards.filter(x => x.id !== id)
        //     });
    }

    sanitize(url: string) {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }

    onSort({ column, direction }: SortEvent) {
        // resetting other headers
        this.headers.forEach(header => {
            if (header.sortable !== column) {
                header.direction = '';
            }
        });

        this.service.sortColumn = column;
        this.service.sortDirection = direction;
    }
}