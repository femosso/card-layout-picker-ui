export class Card {
    id: string;
    imagePath: string;
    fields: CardField[];
    createdAt: string;

    constructor(id: string) {
        this.id = id;
    }
}

export class CardField {
    id: string;
    name: string;
    type: CardFieldType;
}

export class CardFieldType {
    id: string;
    name: string;
}