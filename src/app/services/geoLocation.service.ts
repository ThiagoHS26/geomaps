import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
const URL = environment.urlServer;
@Injectable({
    providedIn: 'root'
  })
export class GeoService {
    public useLocation?: [number,number];
    constructor(private _http:HttpClient) { 
        this.getUserLocation();
    }
    //Geolocalizacion
  public getUserLocation(){
    navigator.geolocation.getCurrentPosition(
    ({coords})=>{
      this.useLocation=[coords.latitude, coords.longitude]
    }
    )
  }
}