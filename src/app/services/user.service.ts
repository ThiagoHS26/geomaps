import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

//Http://localhost:3000
const URL = 'http://127.0.0.1:3000/api/user/';

@Injectable({
  providedIn: 'root'
})

export class UserService {
    constructor(private _http:HttpClient){}

    
}