import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker, tileLayer, Map } from 'leaflet';
import { Marcador } from 'src/app/models/marker.model';
import { PlacesService } from 'src/app/services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-marker',
  templateUrl: './edit-marker.component.html',
  styleUrls: ['./edit-marker.component.css']
})
export class EditMarkerComponent implements OnInit, AfterViewInit {

  public marcador:Marcador;
  public map3:any;
  public editcurrentlyCoords:any;
  public defPoint:any=[-1.6617057696333162, -78.655273310996];

  constructor(private _placesSvc:PlacesService, private _route:ActivatedRoute, private _router:Router) { 
    this.marcador = new Marcador('','',null);
  }

  ngOnInit(): void {
    setTimeout(()=>{
      this.get_marker();
      this.reference_marker();
    },1500);

  }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.map3 = new Map('map3').setView([-1.6640222,-78.6607665],13);//Riobamba
    //Paiting map...
    tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map3);
    },1500);
  }

  
  reference_marker(){
    setTimeout(()=>{
      const id = localStorage.getItem('idMarker');
      this._placesSvc.getMarkerById(id).subscribe(
        (res:any)=>{
          let editDefPoint = res.feature;

          const miUbicacion = marker(editDefPoint.geometry.coordinates,{draggable:true}).addTo(this.map3);
          let nuevaUbicacion =  miUbicacion.setLatLng(editDefPoint.geometry.coordinates);

          miUbicacion.on('moveend',()=>{
            let moveUbicacion = Object.values(nuevaUbicacion);
            this.editcurrentlyCoords = [moveUbicacion[1].lat,moveUbicacion[1].lng];
            localStorage.setItem('coordsEdit',JSON.stringify(this.editcurrentlyCoords));
        }
      );

      });
    },1500);
  }

  //buscar detalles del marcador
  get_marker(){
    const id = localStorage.getItem('idMarker');
    this._placesSvc.getMarkerById(id).subscribe(
      (res:any)=>{
        let marcadorEdit = res.feature;
        $("#_name").val(marcadorEdit.name);
        $("#_state").val(marcadorEdit.state);
        $("#_coords").val(marcadorEdit.geometry.coordinates);
      },
      (error:any)=>{
        console.log(error);
      }
    );
  }

  onSubmit(formMarcador){

    if(formMarcador.valid){
      this._placesSvc.updateMarker({
        _id:localStorage.getItem('idMarker'),
        name:formMarcador.value.name,
        state:formMarcador.value.state,
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
            }
          });
        },
        (error:any)=>{
          console.log(error);
        }
      );
    }

  }

}
