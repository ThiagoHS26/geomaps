import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserInterface } from '../interfaces/user.interface';

//Http://localhost:3000
const URL = 'http://127.0.0.1:3000/api/auth/';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private _http:HttpClient){}

    //Login service
    login(formData:UserInterface):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(`${URL}login`,formData,{headers:headers});
    }
}