import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Order, OrderStatus } from '../_models/order';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SortColumn, SortDirection } from '../shared/table/sortable.directive';
import { debounceTime, switchMap, tap } from 'rxjs/operators';

interface SearchResult {
    data: Order[];
    total: number;
}

export interface SearchTerm {
    name: string;
    value: string;
}

interface State {
    page: number;
    pageSize: number;
    searchTerms: SearchTerm[];
    sortColumn: SortColumn;
    sortDirection: SortDirection;
    fromDate: string;
    toDate: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _orders$ = new BehaviorSubject<Order[]>([]);
    private _total$ = new BehaviorSubject<number>(0);

    private _state: State = {
        page: 1,
        pageSize: 10,
        searchTerms: [],
        sortColumn: 'createdAt',
        sortDirection: 'desc',
        fromDate: '',
        toDate: ''
    };

    constructor(private http: HttpClient) {
        this._search$.pipe(
            tap(() => this._loading$.next(true)),
            debounceTime(200),
            switchMap(() => this._search()), // FIXME - what if _search() fails? currently not setting loading back to false.
            tap(() => this._loading$.next(false))
        ).subscribe(result => {
            this._orders$.next(result.data);
            this._total$.next(result.total);
        });

        this._search$.next();
    }

    register(order: Order) {
        return this.http.post(environment.apiUrl + "/orders", order);
    }

    get(id: string) {
        return this.http.get<Order>(environment.apiUrl + "/orders/" + id);
    }

    getDataTable(dataTablesParameters: State) : Observable<SearchResult> {
        return this.http.post<SearchResult>(environment.apiUrl + "/orders/list", dataTablesParameters, {});
    }

    update(id: string, order: Order) {
        return this.http.put(environment.apiUrl + "/orders/" + id, order);
    }

    status(orders: Order[]) {
        return this.http.post(environment.apiUrl + "/orders/status", orders);
    }

    delete(id: string) {
        return this.http.delete(environment.apiUrl + "/orders/" + id);
    }

    validatePersonId(id: string, personId: string) {
        return this.http.post(environment.apiUrl + "/orders/" + id + "/validate", { personId });
    }

    getStatusTypes() {
        return this.http.get<OrderStatus[]>(environment.apiUrl + "/orders/status-types");
    }

    get orders$() { return this._orders$.asObservable(); }
    get total$() { return this._total$.asObservable(); }
    get loading$() { return this._loading$.asObservable(); }
    get page() { return this._state.page; }
    get pageSize() { return this._state.pageSize; }

    set page(page: number) { this._set({ page }); }
    set pageSize(pageSize: number) { this._set({ pageSize }); }
    set sortColumn(sortColumn: SortColumn) { this._set({ sortColumn }); }
    set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }
    set searchTerms(searchTerms: SearchTerm[]) { this._set({ searchTerms }); }
    set fromDate(fromDate: string) { this._set({ fromDate }); }
    set toDate(toDate: string) { this._set({ toDate }); }
    
    private _set(patch: Partial<State>) {
        console.log("_set", this._state);

        Object.assign(this._state, patch);
        this._search$.next();
    }

    private _search(): Observable<SearchResult> {
        console.log("_search", this._state);
        this._state.page = this._state.page
        return this.getDataTable(this._state);
    }
}