import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  validToken:string;
  constructor(private _router:Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){
      this.validToken = localStorage.getItem('token');
      if(this.validToken){
        return true;
      }else{
        this._router.navigate(['dashboard/mapas']);
        return false;
      }
  }
  
}
