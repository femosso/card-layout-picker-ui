import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FileService {

    constructor(private http: HttpClient) { }

    get(id: string) {
        return this.http.get(environment.apiUrl + "/files/" + id);
    }
}