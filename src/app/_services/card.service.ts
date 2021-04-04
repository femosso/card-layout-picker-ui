import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Card, CardFieldType } from '../_models/card';

@Injectable({ providedIn: 'root' })
export class CardService {

    constructor(private http: HttpClient) { }

    register(file: File, card: Card) {
        const data: FormData = new FormData();
        data.append('file', file);
        data.append('card', new Blob([JSON.stringify(card)], { type: "application/json" }));
        return this.http.post(environment.apiUrl + "/cards", data);
    }

    get(id: string) {
        return this.http.get<Card>(environment.apiUrl + "/cards/" + id);
    }

    getAll() {
        return this.http.get<Card[]>(environment.apiUrl + "/cards");
    }

    update(id: string, file: File, card: Card) {
        const data: FormData = new FormData();
        data.append('file', file);
        data.append('card', new Blob([JSON.stringify(card)], { type: "application/json" }));
        return this.http.put(environment.apiUrl + "/cards/" + id, data);
    }

    delete(id: string) {
        return this.http.delete(environment.apiUrl + "/cards/" + id);
    }

    getFieldTypes() {
        return this.http.get<CardFieldType[]>(environment.apiUrl + "/cards/field-types");
    }
}