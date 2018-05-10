import { Routes } from "@angular/router";
import { AuthguardService } from "./services/authguard.service";

import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";

export const AppRoutes: Routes = [
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthguardService]
  }
]