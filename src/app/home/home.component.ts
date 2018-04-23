import { Component, OnInit, Inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AgeService } from "../services/age.service";
import { ChartsModule } from 'ng2-charts';

interface User {
  age: number,
  correo: string,
  name: string,
  lastname: string,
  cellpohone: string,
  gender: string,
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  registerForm: FormGroup;
  name: string;
  lastname: string;
  email: string;
  cellphone: string;
  birthday: string;
  gender: string;
  canvas: any;
  ctx: any;
  chart = [];

  constructor( @Inject(FormBuilder) private fb: FormBuilder, private afs: AngularFirestore, private age:AgeService ) {

  }

  ngOnInit() {
    this.buildForm();
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`ages/${this.email}`);
    const data: User = {
      age: this.submitBday(),
      correo: this.email,
      name: this.name,
      lastname: this.lastname,
      cellpohone: this.cellphone,
      gender: this.gender
    }
    return userRef.set(data, { merge: true })
  }
  getAge() {
    this.age.showAge()
      .subscribe(
        res =>{
          let ageObject = {
            0: 0,
            18: 0,
            25: 0,
            35: 0,
            50: 0
          }
          for (let cart of res) {
            if (cart.age >= 0 && cart.age < 18) {
              ageObject[0]++
            } else if (cart.age >= 18 && cart.age < 25) {
              ageObject[18]++
            } else if (cart.age >= 25 && cart.age < 35) {
              ageObject[25]++
            } else if (cart.age >= 35 && cart.age < 50) {
              ageObject[35]++
            } else if (cart.age >= 50) {
              ageObject[50]++
            }
          }
          console.log(ageObject[18])
          this.chartData[0].data = [ageObject[0], ageObject[18], ageObject[25], ageObject[35], ageObject[50]]
          this.chartData = this.chartData.slice()
          console.log(this.chartData)
          return ageObject
        },
        err => console.log(err)
      )
  }
  //Chart settings
  chartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          steps: 5,
          stepValue:2,
          max: 30,
        }
      }]
    }
  };

  chartData = [
    { data: [10,10,10,10,10]}
  ];

  chartLabels = ['0-18', '18-25', '25-35', '35-50', '50-más'];

  onChartClick(event) {
    console.log(event);
  }

  postDate(){
    console.log(this.submitBday())
    this.updateUserData(this.submitBday())
    //this.afs.doc<User>(`ages/${this.submitBday()}`)
  }
  //Current age
  submitBday() {
    var Bdate = this.birthday;
    var Bday = +new Date(Bdate);
    return ~~((Date.now() - Bday) / (31557600000));
  }
  //construye el formulario
  buildForm(): void {
    this.registerForm = this.fb.group({
      'name': ['', [
        Validators.required,
        Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1])[a-zA-ZÀ-ÿ\u00f1\u00d1]+$')
      ]],
      'lastname': ['', [
        Validators.required,
        Validators.pattern('^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1])[a-zA-ZÀ-ÿ\u00f1\u00d1]+$')
      ]],
      'email': ['', [
        Validators.email
      ]],
      'cellphone': ['', [
        Validators.minLength(9),
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ]
      ],
      'birthday': ['', [
        Validators.required
      ]],
      'gender': ['', [
        Validators.required
      ]
      ],
    });

    this.registerForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }

  // Updates validation state on form changes.
  onValueChanged(data?: any) {
    if (!this.registerForm) { return; }
    const form = this.registerForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  formErrors = {
    'name': '',
    'lastname': '',
    'email': '',
    'cellphone': '',
    'birthday': '',
    'gender': ''
  };

  validationMessages = {
    'name': {
      'required': 'Este campo es obligatorio',
      'pattern': 'Ingresa un nombre válido'
    },
    'lastname': {
      'required': 'Este campo es obligatorio',
      'pattern': 'Ingresa un apellido válido'
    },
    'email': {
      'email': 'Ingresa un correo válido'
    },
    'cellphone': {
      'minlength': 'Debe tener 9 caracteres como mínimo',
      'required': 'Este campo es obligatorio',
      'pattern': 'Ingresa un celular válido'
    },
    'birthday': {
      'required': 'Este campo es obligatorio'
    },
    'gender': {
      'required': 'Este campo es obligatorio'
    }
  };

}
