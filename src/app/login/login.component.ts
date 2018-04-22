import { Component, OnInit, Inject } from '@angular/core';
import { AuthserviceService } from "../services/authservice.service";
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms'

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

  ngOnInit() {
    this.buildForm();
  }

  toggleForm(): void {
    this.newUser = !this.newUser;
  }

  buildForm(): void {
    this.userForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]
      ],
      'password': ['', [
        //Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25)
      ]
      ],
    });

    this.userForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }

  // Updates validation state on form changes.
  onValueChanged(data?: any) {
    if (!this.userForm) { return; }
    const form = this.userForm;
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
    'email': '',
    'password': ''
  };

  validationMessages = {
    'email': {
      'required': 'El correo es obligatorio',
      'email': 'Ingresa un correo válido'
    },
    'password': {
      'required': 'La contraseña es obligatoria',
      //'pattern': 'Password must be include at one letter and one number.',
      'minlength': 'Debe tener 6 caracteres como mínimo',
      'maxlength': 'Password cannot be more than 40 characters long.',
    }
  };
}
