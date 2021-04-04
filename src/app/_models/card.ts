export class Card {
    id: string;
    imagePath: any;
    fields: CardField[];
}

export class CardField {
    name: string;
    fieldTypeId: string;
}

export class CardFieldType {
    id: string;
    type: string;
}