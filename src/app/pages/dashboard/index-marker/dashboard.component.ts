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
  public data_point=[];
  public sumatoria=0;
  public promedio=0;
  public token:string;
  /*Datatable */
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public marcadores:Marcador[];

  constructor(
    private _placesService:PlacesService,
    private _router:Router
  ) { 
    this.token = localStorage.getItem('token');
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
    },500);
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
    },500)
  }
  //put markers
  put_markers(){
    setTimeout(()=>{
      this._placesService.getAllMarkers().subscribe(
        (res:any)=>{
          this.marcadores = res.features;
          this.data = res.features;
          this.data.forEach(element => {
            marker(element.geometry.coordinates).on('click',()=>{

              if(element.state === "En mantenimiento"){
                alert("El marcador está en Mantenimiento");
                return;
              }
              if(element.state === "Inactivo"){
                alert("El marcador está Inactivo");
                return;
              }

              //Show card over
              $("#card_over").css("display","block");
              $("#_codigo").val(element.name);

              $("#_co2").val(element.ica_dates.carbon_monoxide);
              $("#_no2").val(element.ica_dates.nitrogen_dioxide);
              $("#_o3").val(element.ica_dates.ozone);
              $("#_h2s").val(element.ica_dates.hidrogen_sulfide);
              $("#_so2").val(element.ica_dates.sulfur_dioxide);
              $("#_pm25").val(element.ica_dates.pm_25);
              $("#_pm10").val(element.ica_dates.pm_10);

              /*ICA DATES */
              //Datos segun normas del ICA para catalogar mediante mapa de
              //colores el indice de seguridad en la calidad del aire
              //Colores utilizados.-
              //#53FACA CYAN: para una calidad de aire apropiada
              //#09FA17 VERDE CLARO: para una calidad de aire razonable
              //#BCE503 AMARILLO: para una calidad de aire regular
              //#F35D01: NARANJA: para una calidad del aire mala
              //#F90D02 ROJO: para una calidad del aire muy mala
              //#AF0378 PURPURA para una calidad del aire dañina 
              //El caluclo se realiza mediante un condicional para conocer
              //la cantidad de materiales perjudiciales en el aire
              //existen limites para ser considerados con los colores mencionados
              //REVISAR la documentacion sobre ICA (Indice de Calidad del Aire)

              //Monoxido de Carbono
              if(element.ica_dates.carbon_monoxide >= 0 && element.ica_dates.carbon_monoxide <= 50){
                $("#co2_box").css("background-color","#53FACA");//apropiada
                $("#_co2").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.carbon_monoxide >= 51 && element.ica_dates.carbon_monoxide <= 100){
                $("#co2_box").css("background-color","#09FA17");//razonable
                $("#_co2").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.carbon_monoxide >= 101 && element.ica_dates.carbon_monoxide <= 130){
                $("#co2_box").css("background-color","#BCE503");//regular
                $("#_co2").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.carbon_monoxide >= 131 && element.ica_dates.carbon_monoxide <= 240){
                $("#co2_box").css("background-color","#F35D01");//mala
                $("#_co2").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.carbon_monoxide >= 241 && element.ica_dates.carbon_monoxide <= 380){
                $("#co2_box").css("background-color","#F90D02 ");//muy mala
                $("#_co2").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.carbon_monoxide > 380){
                $("#co2_box").css("background-color","#AF0378 ");//dañina
                $("#_co2").css({"color":"white","font-weight":"bold"});
              }

              //Dioxido de nitrogeno
              if(element.ica_dates.nitrogen_dioxide >=0 && element.ica_dates.nitrogen_dioxide <=40){
                $("#no2_box").css("background-color","#53FACA");//apropiada
                $("#_no2").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.nitrogen_dioxide >=41 && element.ica_dates.nitrogen_dioxide <=90){
                $("#no2_box").css("background-color","#09FA17");//razonable
                $("#_no2").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.nitrogen_dioxide >=91 && element.ica_dates.nitrogen_dioxide <=120){
                $("#no2_box").css("background-color","#BCE503");//regular
                $("#_no2").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.nitrogen_dioxide >=121 && element.ica_dates.nitrogen_dioxide <=230){
                $("#no2_box").css("background-color","#F35D01");//mala
                $("#_no2").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.nitrogen_dioxide >=231 && element.ica_dates.nitrogen_dioxide <=340){
                $("#no2_box").css("background-color","#F90D02 ");//muy mala
                $("#_no2").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.nitrogen_dioxide >=341){
                $("#no2_box").css("background-color","#AF0378 ");//dañina
                $("#_no2").css({"color":"white","font-weight":"bold"});
              }

              ////////OZONO
              if(element.ica_dates.ozone >=0 && element.ica_dates.ozone <=50){
                $("#o3_box").css("background-color","#53FACA");//apropiada
                $("#_o3").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.ozone >=51 && element.ica_dates.ozone <=100){
                $("#o3_box").css("background-color","#09FA17");//razonable
                $("#_o3").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.ozone >=101 && element.ica_dates.ozone <=130){
                $("#o3_box").css("background-color","#BCE503");//regular
                $("#_o3").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.ozone >=131 && element.ica_dates.ozone <=240){
                $("#o3_box").css("background-color","#F35D01");//mala
                $("#_o3").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.ozone >=241 && element.ica_dates.ozone <=380){
                $("#o3_box").css("background-color","#F90D02 ");//muy mala
                $("#_o3").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.ozone >=381){
                $("#o3_box").css("background-color","#AF0378 ");//dañina
                $("#_o3").css({"color":"white","font-weight":"bold"});
              }

              ///////////Sulfuro de hidrogeno
              if(element.ica_dates.hidrogen_sulfide >=0 && element.ica_dates.hidrogen_sulfide <=100){
                $("#h2s_box").css("background-color","#53FACA");//apropiada
                $("#_h2s").css({"color":"white","font-weight":"bold"});
              }
              if(element.ica_dates.hidrogen_sulfide >=101 && element.ica_dates.hidrogen_sulfide <=200){
                $("#h2s_box").css("background-color","#09FA17");//razonable
                $("#_h2s").css({"color":"white","font-weight":"bold"});
              }
              if(element.ica_dates.hidrogen_sulfide >=201 && element.ica_dates.hidrogen_sulfide <=350){
                $("#h2s_box").css("background-color","#BCE503");//regular
                $("#_h2s").css({"color":"white","font-weight":"bold"});
              }
              if(element.ica_dates.hidrogen_sulfide >=351 && element.ica_dates.hidrogen_sulfide <=500){
                $("#h2s_box").css("background-color","#F35D01");//mala
                $("#_h2s").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.hidrogen_sulfide >=501 && element.ica_dates.hidrogen_sulfide <=1250){
                $("#h2s_box").css("background-color","#F90D02 ");//muy mala
                $("#_h2s").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.hidrogen_sulfide >=1251){
                $("#h2s_box").css("background-color","#AF0378 ");//dañina
                $("#_h2s").css({"color":"white","font-weight":"bold"});
              }

              //Dioxido de azufre
              if(element.ica_dates.sulfur_dioxide >=0 && element.ica_dates.sulfur_dioxide <=100){
                $("#so2_box").css("background-color","#53FACA");//apropiada
                $("#_so2").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.sulfur_dioxide >=101 && element.ica_dates.sulfur_dioxide <=200){
                $("#so2_box").css("background-color","#09FA17");//razonable
                $("#_so2").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.sulfur_dioxide >=201 && element.ica_dates.sulfur_dioxide <=350){
                $("#so2_box").css("background-color","#BCE503");//regular
                $("#_so2").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.sulfur_dioxide >=351 && element.ica_dates.sulfur_dioxide <=500){
                $("#so2_box").css("background-color","#F35D01");//mala
                $("#_so2").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.sulfur_dioxide >=501 && element.ica_dates.sulfur_dioxide <=750){
                $("#so2_box").css("background-color","#F90D02 ");//muy mala
                $("#_so2").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.sulfur_dioxide >=751){
                $("#so2_box").css("background-color","#AF0378 ");//dañina
                $("#_so2").css({"color":"white","font-weight":"bold"});
              }

              //PM25
              if(element.ica_dates.pm_25 >=0 && element.ica_dates.pm_25 <=10){
                $("#pm25_box").css("background-color","#53FACA");//apropiada
                $("#_pm25").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.pm_25 >=11 && element.ica_dates.pm_25 <=20){
                $("#pm25_box").css("background-color","#09FA17");//razonable
                $("#_pm25").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.pm_25 >=21 && element.ica_dates.pm_25 <=25){
                $("#pm25_box").css("background-color","#BCE503");//regular
                $("#_pm25").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.pm_25 >=26 && element.ica_dates.pm_25 <=50){
                $("#pm25_box").css("background-color","#F35D01");//mala
                $("#_pm25").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.pm_25 >=51 && element.ica_dates.pm_25 <=75){
                $("#pm25_box").css("background-color","#F90D02 ");//muy mala
                $("#_pm25").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.pm_25 >=76){
                $("#pm25_box").css("background-color","#AF0378 ");//dañina
                $("#_pm25").css({"color":"white","font-weight":"bold"});
              }

              //PM10
              if(element.ica_dates.pm_10 >=0 && element.ica_dates.pm_10 <=20){
                $("#pm10_box").css("background-color","#53FACA");//apropiada
                $("#_pm10").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.pm_10 >=21 && element.ica_dates.pm_10 <=40){
                $("#pm10_box").css("background-color","#09FA17");//razonable
                $("#_pm10").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.pm_10 >=41 && element.ica_dates.pm_10 <=50){
                $("#pm10_box").css("background-color","#BCE503");//regular
                $("#_pm10").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.pm_10 >=51 && element.ica_dates.pm_10 <=100){
                $("#pm10_box").css("background-color","#F35D01");//mala
                $("#_pm10").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.pm_10 >=101 && element.ica_dates.pm_10 <=150){
                $("#pm10_box").css("background-color","#F90D02 ");//muy mala
                $("#_pm10").css({"color":"white","font-weight":"bold"});
              }else if(element.ica_dates.pm_10 >=151){
                $("#pm10_box").css("background-color","#AF0378 ");//dañina
                $("#_pm10").css({"color":"white","font-weight":"bold"});
              }

              /*Calculo del promedio segun datos ingresados
              Prom = Sumatoria / cant. */
              this.sumatoria = parseInt(element.ica_dates.carbon_monoxide + element.ica_dates.nitrogen_dioxide + 
                element.ica_dates.ozone + element.ica_dates.hidrogen_sulfide + element.ica_dates.sulfur_dioxide + 
                element.ica_dates.pm_25 + element.ica_dates.pm_10);
              
              this.promedio = this.sumatoria / 7;

              //Mostrar promedio
              if(this.promedio >= 0 && this.promedio <=50){
                $("#_ica").val("ICA Bueno");
                $("#_description").val("Los indicadores muestran una calidad del aire Buena para la salud");
                $("#_recomendation").val("No se recomienda el uso constante de cubrebocas");
              }else if(this.promedio >= 51 && this.promedio <=100){
                $("#_ica").val("ICA Razonable");
                $("#_description").val("Los indicadores muestran una calidad del aire Razonable para la salud");
                $("#_recomendation").val("No se recomienda el uso constante de cubrebocas");
              }else if(this.promedio >= 101 && this.promedio <=150){
                $("#_ica").val("ICA Regular");
                $("#_description").val("Los indicadores muestran una calidad del aire Regular para la salud");
                $("#_recomendation").val("Se recomienda el uso de cubrebocas en estos lugares");
              }else if(this.promedio >= 151 && this.promedio <=200){
                $("#_ica").val("ICA Malo");
                $("#_description").val("Los indicadores muestran una calidad del aire Mala para la salud");
                $("#_recomendation").val("Se recomienda el uso constante de cubrebocas en estos lugares");
              }else if(this.promedio >= 201 && this.promedio <=300){
                $("#_ica").val("ICA Muy Malo");
                $("#_description").val("Los indicadores muestran una calidad del aire Muy Mala para la salud");
                $("#_recomendation").val("Se recomienda el uso permanente de cubrebocas en estos lugares");
              }else if(this.promedio >= 301){
                $("#_ica").val("ICA Dañino");
                $("#_description").val("Los indicadores muestran una calidad del aire Dañina para la salud");
                $("#_recomendation").val("No se recomienda la habitabilidad del lugar");
              }
              //close card_over data
              $("#btn_card_over").click(function(){
                $("#card_over").css("display","none");
              });
            }).addTo(this.map)
          });
          this.dtTrigger.next();
        },
        (error:any)=>{
          console.log(error);
        }
      );
    },500);
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