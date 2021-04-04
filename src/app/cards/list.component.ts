import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { first } from 'rxjs/operators';
import { CardService } from '../_services/card.service';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    cards = null;

    constructor(
        private cardService: CardService,
        private sanitizer: DomSanitizer,
    ) {}

    ngOnInit() {
        this.cardService.getAll()
            .pipe(first())
            .subscribe(cards => this.cards = cards);
    }

    deleteCard(id: string) {
        const card = this.cards.find(x => x.id === id);
        card.isDeleting = true;
        this.cardService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.cards = this.cards.filter(x => x.id !== id) 
            });
    }

    sanitize(url:string){
		return this.sanitizer.bypassSecurityTrustUrl(url);
	}
}