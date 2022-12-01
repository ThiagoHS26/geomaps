import { Component, OnInit, AfterViewInit } from '@angular/core';
import { icon,Map,marker,tileLayer } from 'leaflet';
import { PlacesService } from 'src/app/services';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  public geo:any;
  public map:any;
  public rio:any=[-1.663583580753706, -78.66215381962525];
  public guano:any=[-1.6042662653053839, -78.63048098946079];

  constructor(
    private _placesService:PlacesService
  ) { }

  ngOnInit(){
    setTimeout(()=>{
      this.geo = this._placesService.useLocation;
      this.put_markers();
    },2000);
  }
  ngAfterViewInit(){
    setTimeout(()=>{
      this.map = new Map('map').setView(this.geo,7);
      tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
    },2000)
  }
  //put markers
  put_markers(){
    setTimeout(()=>{
      marker(this.geo).addTo(this.map);
      marker(this.guano).addTo(this.map);
      marker([-0.14127537631234707, -78.45389726828812]).addTo(this.map);
      marker([-2.1332821934858206, -79.94852821775065]).addTo(this.map);
      marker([-2.88781119153516, -78.98114106611489]).addTo(this.map);
      marker([0.9780143055794749, -79.66210202400971]).addTo(this.map);
    },2000);
  }
}