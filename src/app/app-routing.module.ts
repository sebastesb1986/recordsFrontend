import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './components/client/client.component';
import { LogClientComponent } from './components/log-client/log-client.component';

const routes: Routes = [

  // RUTAS APLICACIÓN
  /*{ path: '', component: ClientComponent },
  { path: 'logClient', component: LogClientComponent },
  { path: '', pathMatch: 'full', redirectTo: '' },
  { path: '**', pathMatch: 'full', redirectTo: '' }*/

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
