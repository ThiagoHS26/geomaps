import { Injectable } from '@angular/core';
import { UserInterface } from '../interfaces/user.interface';
import { EditUserInterface } from '../interfaces/editUser.interface';
import { ChangePassUser } from '../interfaces/passUser.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

//Http://localhost:3000
const URL = 'http://127.0.0.1:3000/api/';

@Injectable({
  providedIn: 'root'
})

export class UserService {
    constructor(private _http:HttpClient){}

    //Get all user
    get_all_users():Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/json');
      return this._http.get(`${URL}user/list`,{headers:headers});
    }
    //New user
    new_user(data:UserInterface):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/json');
      return this._http.post(`${URL}user/register`,data,{headers:headers});
    }

    //get user by id
    get_user_by_id(id:string){
      let headers = new HttpHeaders().set('Content-Type','application/json');
      return this._http.get(`${URL}user/list/${id}`,{headers:headers});
    }

    //edit user
    edit_user(id:string,data:EditUserInterface):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/json');
      return this._http.put(`${URL}user/update/${id}`,data,{headers:headers});
    }

    //change password
    change_password(id:string, data:ChangePassUser):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/json');
      return this._http.put(`${URL}user/change-pass/${id}`,data,{headers:headers});
    }

    //Delete user
    delete_user(id:string):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/json');
      return this._http.delete(`${URL}user/delete/${id}`,{headers:headers});
    }
    
}