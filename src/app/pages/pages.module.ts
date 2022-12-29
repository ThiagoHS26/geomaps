import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/index-marker/dashboard.component';
import { UsuariosComponent } from './dashboard/index-marker/usuarios/usuarios.component';
import { PagesComponent } from './pages.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CreateMarkerComponent } from './dashboard/create-marker/create-marker.component';
import { EditMarkerComponent } from './dashboard/edit-marker/edit-marker.component';



@NgModule({
  declarations: [
    DashboardComponent,
    UsuariosComponent,
    PagesComponent,
    CreateMarkerComponent,
    EditMarkerComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
  ],
  exports:[
    DashboardComponent,
    UsuariosComponent,
    CreateMarkerComponent,
    EditMarkerComponent
  ]
})
export class PagesModule { }
