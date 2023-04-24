import { Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { geoJSON, icon,Map,Marker,marker,tileLayer } from 'leaflet';
import { Marcador } from 'src/app/models/marker.model';
import { PlacesService } from 'src/app/services';
import { GeoService } from 'src/app/services/geoLocation.service';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-marker',
  templateUrl: './create-marker.component.html',
  styleUrls: ['./create-marker.component.css']
})
export class CreateMarkerComponent implements OnInit, AfterViewInit, OnDestroy {

  public ExcelData : any;
  public marcador:Marcador;
  public map2:any;
  public newPoint:any=[];
  public currentlyCoords:any;
  public dataExcel:any=[];

  /*Reactive form */

  constructor(private _fb:FormBuilder,
    private _router:Router, 
    private _placesSvc: PlacesService,
    private _geoSvc: GeoService) { 
      this.marcador = new Marcador('','','',null,null,0,0,0,0,0,0,0);
    }

  ngOnInit():void{
    setTimeout(()=>{
      //this.reference_marker();
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

  getCurrentlyCoords(){
    console.log(this._geoSvc.useLocation);
    this.currentlyCoords = this._geoSvc.useLocation;
    localStorage.setItem('coords',JSON.stringify(this.currentlyCoords));
  }

  readExcel(event:any){
    let file = event.target.files[0];
    let fileRader = new FileReader();
    fileRader.readAsBinaryString(file);

    fileRader.onload = (e)=>{
      var workBook = XLSX.read(fileRader.result,{type:'binary'});
      var sheetNames = workBook.SheetNames;
      this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);
    }
  }

  sendData(){
    if(!this.ExcelData){
      alert('No has seleccionado nada');
    }else{
      this.ExcelData.forEach(element => {
        this.dataExcel.push({
          name:element.name,
          state:element.state,
          ica_dates:{
            carbon_monoxide:element.carbon_monoxide,
            nitrogen_dioxide:element.nitrogen_dioxide,
            ozone:element.ozone,
            hidrogen_sulfide:element.hidrogen_sulfide,
            sulfur_dioxide:element.sulfur_dioxide,
            pm_25:element.pm_25,
            pm_10:element.pm_10
          },
          geometry:{
            coordinates:(element.geometry).split(',').map(function(item){
              return parseFloat(item)
            })
          }
        });
      });
      //console.log(this.dataExcel);
      this._placesSvc.insertExcelData(this.dataExcel).subscribe(
        (res:any)=>{
          Swal.fire(
            {
              icon:'success',
              title:'Datos ingresados',
              text:'Excel cargado correctamente',
              showConfirmButton:false,
              timer:2000
            }
          ).then((result)=>{
            if(result){
              this._router.navigate(['/dashboard/mapas']);
            }
          })
        },
        (error:any)=>{
          Swal.fire({
            icon:'error',
            title:'Error',
            text:'Algo ha ocurrido!',
            showConfirmButton:false,
            timer:1500
          });
        }
      );
    }
  }

  //Reference marker
  reference_marker(){
    setTimeout(()=>{
      this.newPoint = JSON.parse(localStorage.getItem('coords'));
      marker(this.newPoint).addTo(this.map2)
        .bindPopup('Estás aquí!')
        .openPopup();

      /*miUbicacion.on('moveend',()=>{
        let moveUbicacion = Object.values(nuevaUbicacion);
        this.currentlyCoords = [moveUbicacion[1].lat,moveUbicacion[1].lng];
        localStorage.setItem('coords',JSON.stringify(this.currentlyCoords));
      });*/
    },1000);
  }

  ngOnDestroy(): void {
    localStorage.removeItem('coords');
  }

}
