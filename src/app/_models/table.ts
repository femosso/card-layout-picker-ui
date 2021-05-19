import { SortColumn, SortDirection } from "../shared/table/sortable.directive";
import { Card } from "./card";

export class TableState {
    page: number;
    pageSize: number;
    sortColumn: SortColumn;
    sortDirection: SortDirection;
    searchTerms: SearchTerm[];
    fromDate: string;
    toDate: string;
}

export class SearchTerm {
    name: string;
    value: string;
}

export class TableResult {
    data: Card[];
    total: number;
}