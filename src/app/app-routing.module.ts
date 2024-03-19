import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { VisualizarComponent } from './pages/visualizar/visualizar.component';
import { DetallesComponent } from './pages/detalles/detalles.component';


const routes: Routes = [
  {
    path:'home',
    component: HomeComponent,
  },
  {
    path:'registro',
    component: RegistroComponent,
  },
  {
    path:'visualizar',
    component: VisualizarComponent,
  },
  {
    path: 'detalles/:nombre', component: DetallesComponent 
  },
  {
    path:'**',
    redirectTo: 'home'
  },
  { 
    path: 'detalles/:id',
    component: DetallesComponent 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
