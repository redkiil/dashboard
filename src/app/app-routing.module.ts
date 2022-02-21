import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './views/home/home.component';
import { MapComponent } from './views/map/map.component';
import { SettingsComponent } from './views/settings/settings.component';
import { StatusComponent } from './views/status/status.component';




const routes: Routes = [{
    path: "",
    component: HomeComponent
  },
  {
    path: "settings",
    component: SettingsComponent
  },{
    path: "map",
    component: MapComponent
  },{
    path: "status",
    component: StatusComponent
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
