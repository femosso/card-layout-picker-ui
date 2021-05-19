import { Card, CardField } from "./card";

export class Order {
    id: string;
    name: string;
    personId: string;
    employeeId: string;
    statusId: string;
    createdAt: string;
    card: Card;
    orderAnswers: OrderAnswer[];
    checked: boolean;
}

export class OrderAnswer {
    id: string;
    cardField: CardField;
    answer: string;
}

export class OrderStatus {
    id: string;
    name: string;
}