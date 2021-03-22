import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from '../_models/user';

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(private http: HttpClient) { }

    register(user: User) {
        return this.http.post(environment.apiUrl + "/users", user);
    }

    get(id: string) {
        return this.http.get<User>(environment.apiUrl + "/users/" + id);
    }

    getAll() {
        return this.http.get<User[]>(environment.apiUrl + "/users");
    }

    update(id: string, user: User) {
        return this.http.put(environment.apiUrl + "/users/" + id, user);
    }

    delete(id: string) {
        return this.http.delete(environment.apiUrl + "/users/" + id);
    }
}