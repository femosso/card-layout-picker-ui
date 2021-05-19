import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Card, CardFieldType } from '../_models/card';
import { TableResult, TableState } from '../_models/table';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SortColumn, SortDirection } from '../shared/table/sortable.directive';
import { debounceTime, switchMap, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CardService {
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _cards$ = new BehaviorSubject<Card[]>([]);
    private _total$ = new BehaviorSubject<number>(0);

    constructor(
        private http: HttpClient
    ) {
        this._search$.pipe(
            tap(() => this._loading$.next(true)),
            debounceTime(200),
            switchMap(() => this._search()), // FIXME - what if _search() fails? currently not setting loading back to false.
            tap(() => this._loading$.next(false))
        ).subscribe(result => {
            this._cards$.next(result.data);
            this._total$.next(result.total);
        });

        this._search$.next();
    }

    private _state: TableState = {
        page: 1,
        pageSize: 2,
        searchTerms: [],
        sortColumn: 'id',
        sortDirection: 'desc',
        fromDate: '',
        toDate: ''
    };

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

    getTableData(tableState: TableState): Observable<TableResult> {
        return this.http.post<TableResult>(environment.apiUrl + "/cards/list", tableState, {});
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

    get cards$() { return this._cards$.asObservable(); }
    get total$() { return this._total$.asObservable(); }
    get loading$() { return this._loading$.asObservable(); }
    get page() { return this._state.page; }
    get pageSize() { return this._state.pageSize; }

    set page(page: number) { this._set({ page }); }
    set pageSize(pageSize: number) { this._set({ pageSize }); }
    set sortColumn(sortColumn: SortColumn) { this._set({ sortColumn }); }
    set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

    private _set(patch: Partial<TableState>) {
        Object.assign(this._state, patch);
        this._search$.next();
    }

    private _search(): Observable<TableResult> {
        return this.getTableData(this._state);
    }
}