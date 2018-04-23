import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

interface Total {
  age:number
}
interface Edades {
  0: number;
  18: number;
  25: number;
  35: number;
  50: number;
}

@Injectable()
export class AgeService {

  total: AngularFirestoreCollection<Total>
  age: Observable<Total[]>
  ages: Observable<Edades[]>
  single:Observable<any>

  constructor(private db: AngularFirestore) {
    this.total = this.db.collection(`ages`)
    this.age = this.total.valueChanges();
    this.age.subscribe(
      data=> console.log(data)
    )
   }
  //  getAges() {
  //    this.age
  //     .subscribe(res => {
  //         console.log(res)
  //         let ageObject = {
  //           0: 0,
  //           18: 0,
  //           25: 0,
  //           35: 0,
  //           50: 0
  //         }
  //         for (let cart of res) {
  //           if (cart.age >= 0 && cart.age < 18) {
  //             ageObject[0]++
  //           } else if (cart.age >= 18 && cart.age <25) {
  //             ageObject[18]++
  //           } else if (cart.age >= 25 && cart.age < 35) {
  //             ageObject[25]++
  //           } else if (cart.age >= 35 && cart.age < 50) {
  //             ageObject[35]++
  //           } else if (cart.age >= 50) {
  //             ageObject[50]++
  //           }
  //           console.log(ageObject)
  //           console.log(cart.age)
  //         }
  //       return ageObject
  //     })
  //  }
   showAge() {
     this.total = this.db.collection(`ages`)
     this.age = this.total.valueChanges();
     return this.age
     /* this.age.map(
       data => { return data }
     ) */
   }
}
