import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap'
import { ToastrService } from 'ngx-toastr';

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  setup?: Object;
}

@Injectable()
export class AuthserviceService {

  user: Observable<User>;
  currentUser: User;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private afData: AngularFireDatabase,
    private router: Router,
    private toastr: ToastrService
  ) { 
    //Esto se agrega por el error de fechas de Firestore
    // const firestore = firebase.firestore();
    // const settings = {timestampsInSnapshots: true };
    // firestore.settings(settings);
    // const timestamp = snapshot.get('created_at');
    // const date = timestamp.toDate();
    this.user = this.afAuth.authState;
    this.user.subscribe
    (user => {
      if (user) {
        console.log(user);
        return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
      } else {
        return Observable.of(null)
      }
    })
  }
  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user)
      })
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }
    return userRef.set(data, { merge: true })
  }

  signup(email: string, password: string) {
    this.afAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        localStorage.setItem('usuario', value.uid);
        this.updateUserData(value)
        console.log('Success!', value);
        this.router.navigate(['home'])
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  login(email: string, password: string) {
    this.afAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        this.updateUserData(value)
        console.log('Nice, it worked!');
        console.log(value);
        this.router.navigate(['home'])
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
        console.log(err);
        if (err.code == "auth/wrong-password"){
          this.toastr.error('Contraseña incorrecta','Intenta otra vez',{
            timeOut: 3000,
          });
        } else if (err.code == "auth/user-not-found"){
          this.toastr.error('Usuario no encontrado', 'Intenta otra vez',{
            timeOut: 3000,
          });
        } 
      });
  }
  anonymousLogin() {
    this.afAuth
      .auth
      .signInAnonymously()
      .then(value => {
        localStorage.setItem('usuario', value.uid);
        this.updateUserData(value)
        console.log('Nice, it worked!');
        console.log(value);
        this.router.navigate(['home'])
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  logout() {
    this.afAuth
      .auth
      .signOut();
  }

}
