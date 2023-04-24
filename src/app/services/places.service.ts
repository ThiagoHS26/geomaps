import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

//Http://localhost:3000
const URL = environment.urlServer;

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor(private _http:HttpClient) { 
  }

  //Get all markers
  getAllMarkers():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(`${URL}list`,{headers:headers})
  }

  //Post new marker
  insertNewMarker(data:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(`${URL}register`,data,{headers:headers});
  }

  //Post excel data
  insertExcelData(dataExcel):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(`${URL}register-excel`,dataExcel,{headers:headers});
  }

  //Get by id
  getMarkerById(id:string):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(`${URL}${id}`,{headers:headers});
  }

  //Put marker
  updateMarker(data:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.put(`${URL}update/${data._id}`,data,{headers:headers});
  }

  //Delete marker
  deleteMarker(id:string):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.delete(`${URL}delete/${id}`,{headers:headers});
  }

}
