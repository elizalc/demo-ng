import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';  
import { AuthserviceService } from './authservice.service'
import * as firebase from "firebase";

@Injectable()
export class AuthguardService {

  constructor(public auth: AuthserviceService, public router: Router) { }
  
  canActivate() {
    // if(this.auth.loginUser == undefined){
    //   console.log(this.auth.loginUser)
    //   console.log('loginUser null')
    //   this.router.navigateByUrl('/');
    //   return false
    // }
    // console.log('no null')
    // return true
    return this.auth.isLoggedIn();
  }

}  
