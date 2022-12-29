import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { geoJSON, icon,Map,marker,tileLayer } from 'leaflet';
import { PlacesService } from 'src/app/services';
import * as jQuery from 'jquery';
import { Marcador } from 'src/app/models/marker.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import  Swal  from 'sweetalert2'

declare var $:any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  public geo:any;
  public map:any;// se carga el mapa
  public data:any;
  /*Datatable */
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public marcadores:Marcador[]=[];

  constructor(
    private _placesService:PlacesService,
    private _router:Router
  ) { 
  }

  ngOnInit(){

    this.put_markers();

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive:true,
      language:{url:'//cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json'}
    };

    
    setTimeout(()=>{
      //this.geo = this._placesService.useLocation;
    },1500);
  }
  //Riobamba
  ngAfterViewInit(){
    setTimeout(()=>{
      this.map = new Map('map').setView([-1.6640222,-78.6607665],13);//Riobamba
      //Paiting map...
      tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
    },1500)
  }
  //put markers
  put_markers(){
    setTimeout(()=>{
      this._placesService.getAllMarkers().subscribe(
        (res:any)=>{
          this.marcadores = res.features;
          this.data = res.features;
          this.data.forEach(element => {
            marker(element.geometry.coordinates).addTo(this.map).bindPopup(
              `
              <div class="">
                <div class="">
                  <div class="modal-header">
                    <h4 class="modal-title">Información Marcador</h4>
                  </div>
                  <div class="modal-body">
                    <label form="">Coordenadas</label>
                    <p>${element.geometry.coordinates}</p>
                    <label for="">Nombre</label>
                    <p>${element.name}</p>
                    <label for="">Estado</label>
                    <p>${element.state}</p>
                  </div>
              </div>
              `
            );
          });
          this.dtTrigger.next();
        },
        (error:any)=>{
          console.log(error);
        }
      );
    },1500);
  }

  //Redirected to Edit markers and store in localstorage
  get_item(id:string){
    localStorage.setItem('idMarker',id);
    $('#modal-lg').modal('hide');
    this._router.navigate(['/dashboard/editar-marcador']);
  }

  //eliminar un marcador
  delete_item(id:string){

    Swal.fire({
      icon:'warning',
      title:'Advertencia!',
      text:'Estás a punto de eliminar un marcador del mapa',
      showCancelButton:true,
      confirmButtonText:'Confirmar'
    }).then((result)=>{
      if(result.isConfirmed){
        this._placesService.deleteMarker(id).subscribe(
          (res:any)=>{
              Swal.fire({
                icon:'success',
                title:'Exito!',
                text:'Marcador eliminado',
                showConfirmButton:false,
                timer:1000
              }).then((result)=>{
                if(result){
                  $("#modal-lg").modal('hide');
                  location.reload();
                }
              });
              
          },
          (error:any)=>{
            console.log(error);
          }
        );
      }
    });

  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}