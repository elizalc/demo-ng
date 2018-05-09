import { Component, OnInit, Inject } from '@angular/core';
import { AuthserviceService } from "../services/authservice.service";
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { MaterialModule } from './../material.module';
import anime from 'animejs'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userForm: FormGroup;
  newUser: boolean = true; // to toggle login or signup form
  email: string;
  password: string;
  total: number;

  constructor(public authService: AuthserviceService, @Inject(FormBuilder) private fb: FormBuilder) { }

  signup() {
    this.authService.signup(this.email, this.password)
  }

  login(): void {
    this.authService.login(this.email, this.password)
  }

  logout(): void {
    this.authService.logout();
  }
  anonymouslogin():void{
    this.authService.anonymousLogin();
  }

  ngOnInit() {
    this.buildForm();
  }

  // toggleForm(): void {
  //   this.newUser = !this.newUser;
  // }

  buildForm(): void {
    this.userForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')
      ]
      ],
      'password': ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(25)
      ]
      ],
    });

    this.userForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  

  formErrors = {
    'email': '',
    'password': ''
  };

  validationMessages = {
    'email': {
      'required': 'Email is required',
      'pattern': 'Email is invalid'
    },
    'password': {
      'required': 'Password is required',
      'minlength': 'Debe tener 6 caracteres como mínimo',
      'maxlength': 'Password cannot be more than 40 characters long.',
    }
  };

  // Updates validation state on form changes.
  onValueChanged(data?: any) {
    if (!this.userForm) { return; }
    const form = this.userForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.invalid && control.dirty) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
}
