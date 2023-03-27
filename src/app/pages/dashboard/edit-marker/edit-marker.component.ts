import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker, tileLayer, Map } from 'leaflet';
import { Marcador } from 'src/app/models/marker.model';
import { PlacesService } from 'src/app/services';
import { GeoService } from 'src/app/services/geoLocation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-marker',
  templateUrl: './edit-marker.component.html',
  styleUrls: ['./edit-marker.component.css']
})
export class EditMarkerComponent implements OnInit, AfterViewInit, OnDestroy {

  public marcador:Marcador;
  public map3:any;
  public editcurrentlyCoords:any;

  constructor(private _placesSvc:PlacesService, private _route:ActivatedRoute, 
    private _geoSvc: GeoService,
    private _router:Router) { 
    this.marcador = new Marcador('','','',null,null,0,0,0,0,0,0,0);
  }

  ngOnInit(): void {
    setTimeout(()=>{
      this.get_marker();
      this.reference_marker();
    },500);

  }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.map3 = new Map('map3').setView([-1.6640222,-78.6607665],13);//Riobamba
    //Paiting map...
    tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map3);
    },500);
  }

  updateCurrentlyCoords(){
    console.log(this._geoSvc.useLocation);
    this.editcurrentlyCoords = this._geoSvc.useLocation;
    localStorage.setItem('editCoords',JSON.stringify(this.editcurrentlyCoords));
  }
  
  reference_marker(){
    setTimeout(()=>{
      const id = localStorage.getItem('idMarker');
      this._placesSvc.getMarkerById(id).subscribe(
        (res:any)=>{
          
          let editDefPoint = res.feature;
          const miUbicacion = marker(editDefPoint.geometry.coordinates,{draggable:false}).addTo(this.map3);

      });//subs
    },500);//sto
  }

  //buscar detalles del marcador
  get_marker(){
    const id = localStorage.getItem('idMarker');
    this._placesSvc.getMarkerById(id).subscribe(
      (res:any)=>{
        //Complete the form
        let marcadorEdit = res.feature;
        $("#_name").val(marcadorEdit.name);
        $("#_state").val(marcadorEdit.state);
        $("#_coords").val(marcadorEdit.geometry.coordinates);
        localStorage.setItem('lastCoords',JSON.stringify(marcadorEdit.geometry.coordinates));
        //ICA dates
        $("#_carbon_monoxide").val(marcadorEdit.ica_dates.carbon_monoxide);
        $("#_nitrogen_dioxide").val(marcadorEdit.ica_dates.nitrogen_dioxide);
        $("#_ozone").val(marcadorEdit.ica_dates.ozone);
        $("#_hidrogen_sulfide").val(marcadorEdit.ica_dates.hidrogen_sulfide);
        $("#_sulfur_dioxide").val(marcadorEdit.ica_dates.sulfur_dioxide);
        $("#_pm_25").val(marcadorEdit.ica_dates.pm_25);
        $("#_pm_10").val(marcadorEdit.ica_dates.pm_10);
      },
      (error:any)=>{
        console.log(error);
      }
    );
  }

  //Guardar nuevo marcador
  onSubmit(formMarcador){
    const lastCoords = JSON.parse(localStorage.getItem('lastCoords'));
    console.log(lastCoords);

    if(!localStorage.getItem('coordsEdit')){
      localStorage.setItem('coordsEdit',JSON.stringify(lastCoords));
    }
    if(formMarcador.valid){
      this._placesSvc.updateMarker({
        _id:localStorage.getItem('idMarker'),
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
        geometry:{coordinates:JSON.parse(localStorage.getItem('coordsEdit'))}
      }).subscribe(
        (res:any)=>{
          Swal.fire({
            icon:'success',
            title:'Exito!',
            text:'Marcador actualizado',
            showConfirmButton:false,
            timer:1000
          }).then((result)=>{
            if(result){
              this._router.navigate(['/dashboard/mapas']);
              localStorage.removeItem('idMarker');
            }
          });
        },
        (error:any)=>{
          console.log(error);
        }
      );
    }

  }

  ngOnDestroy(): void {
    localStorage.removeItem('coordsEdit');
    localStorage.removeItem('lastCoords');
    localStorage.removeItem('idMarker');
  }

}
