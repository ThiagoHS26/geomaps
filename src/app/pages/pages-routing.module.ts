import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/index-marker/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { PagesComponent } from './pages.component';
import { CreateMarkerComponent } from './dashboard/create-marker/create-marker.component';
import { EditMarkerComponent } from './dashboard/edit-marker/edit-marker.component';

const routes:Routes = [
  {path:'dashboard',component:PagesComponent,
    children:[
      {path:'mapas',component:DashboardComponent},
      {path:'usuarios',component:UsuariosComponent},
      {path:'añadir-marcador',component:CreateMarkerComponent},
      {path:'editar-marcador',component:EditMarkerComponent}
    ]
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class PagesRoutingModule { }
