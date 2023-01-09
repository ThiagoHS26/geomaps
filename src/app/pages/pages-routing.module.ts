import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/index-marker/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { PagesComponent } from './pages.component';
import { CreateMarkerComponent } from './dashboard/create-marker/create-marker.component';
import { EditMarkerComponent } from './dashboard/edit-marker/edit-marker.component';
import { PermissionGuard } from '../guards/permission.guard';

const routes:Routes = [
  {path:'dashboard',component:PagesComponent,
    children:[
      {path:'mapas',component:DashboardComponent},
      {path:'usuarios',component:UsuariosComponent,canActivate:[PermissionGuard]},
      {path:'añadir-marcador',component:CreateMarkerComponent,canActivate:[PermissionGuard]},
      {path:'editar-marcador',component:EditMarkerComponent,canActivate:[PermissionGuard]}
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
