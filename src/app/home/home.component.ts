import { Component, OnInit, Inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

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

  constructor( @Inject(FormBuilder) private fb: FormBuilder, private afs: AngularFirestore ) { }

  ngOnInit() {
    this.buildForm();
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`ages/${user}`);
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

  postDate(){
    // const data: User = {
    //   age: this.submitBday(),
    //   correo: this.email,
    //   name: this.name,
    //   lastname: this.lastname,
    //   cellpohone: this.cellphone,
    //   gender: this.gender
    // }
    // this.submitBday()
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
        Validators.pattern('^[a-zA-Z]+$')
      ]],
      'lastname': ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z]+$')
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
      'required': 'El correo es obligatorio',
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
