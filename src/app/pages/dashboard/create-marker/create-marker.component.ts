import { Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { geoJSON, icon,Map,Marker,marker,tileLayer } from 'leaflet';
import { Marcador } from 'src/app/models/marker.model';
import { PlacesService } from 'src/app/services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-marker',
  templateUrl: './create-marker.component.html',
  styleUrls: ['./create-marker.component.css']
})
export class CreateMarkerComponent implements OnInit, AfterViewInit, OnDestroy {

  public marcador:Marcador;
  public map2:any;
  public defPoint:any=[-1.6617057696333162, -78.655273310996];
  public currentlyCoords:any;

  /*Reactive form */

  constructor(private _fb:FormBuilder,
    private _router:Router, 
    private _placesSvc: PlacesService,) { 
      this.marcador = new Marcador('','','',null,null,0,0,0,0,0,0,0);
    }

  ngOnInit():void{
    setTimeout(()=>{
      this.reference_marker();
    },1500);
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.map2 = new Map('map2').setView([-1.6640222,-78.6607665],13);//Riobamba
    //Paiting map...
    tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map2);
    },1500);
  }

  //Reference marker
  reference_marker(){
    setTimeout(()=>{
      const miUbicacion = marker(this.defPoint,{draggable:true}).addTo(this.map2);
      let nuevaUbicacion =  miUbicacion.setLatLng(this.defPoint);
    
      miUbicacion.on('moveend',()=>{
        let moveUbicacion = Object.values(nuevaUbicacion);
        this.currentlyCoords = [moveUbicacion[1].lat,moveUbicacion[1].lng];
        localStorage.setItem('coords',JSON.stringify(this.currentlyCoords));
      });
    },1500);
  }
  //Add new marker on server
  onSubmit(formMarcador){
    const coords = JSON.parse(localStorage.getItem('coords'));
    if(formMarcador.valid){
      if(coords){
        this._placesSvc.insertNewMarker({
          name:formMarcador.value.name,
          state:formMarcador.value.state,
          ica_dates:{
            carbon_monoxide:formMarcador.value.carbon_monoxide,
            nitrogen_dioxide:formMarcador.value.nitrogen_dioxide,
            ozone:formMarcador.value.ozone,
            hidrogen_sulfide:formMarcador.value.hidrogen_sulfide,
            sulfur_dioxide:formMarcador.value.sulfur_dioxide,
            pm_25:formMarcador.value.pm_25,
            pm_10:formMarcador.value.pm_10
          },
          geometry:{coordinates:coords}
        }).subscribe(
          (res:any)=>{
            Swal.fire({
              icon:'success',
              title:'Exito!',
              text:'Marcador agregado',
              showConfirmButton:false,
              timer:1000
            }).then((result)=>{
              if(result){
                this._router.navigate(['/dashboard/mapas']);
              }
            });
          },
          (error:any)=>{
            Swal.fire({
              icon:'error',
              title:'Error',
              text:'Algo ha ocurrido!',
              showConfirmButton:false,
              timer:1500
            });
            console.log(error);
          }
        );
      }
    }
  }

  ngOnDestroy(): void {
    localStorage.removeItem('coords');
  }

}
