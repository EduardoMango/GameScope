import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {RegistrationService} from '../../services/registration.service';
import {User} from '../../Interfaces/User';

@Component({
  selector: 'app-form-register',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './form-register.component.html',
  styleUrls: ['./form-register.component.css'] // Corrige el typo 'styleUrl' a 'styleUrls'
})
export class FormRegisterComponent {
  registrationForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private registrationService: RegistrationService) {
    // Definir el formulario usando FormBuilder
    this.registrationForm = this.fb.group({
      mail: ['', [Validators.required, Validators.email]],
      pass: ['', [Validators.required, Validators.minLength(6)]],
      repeatpass: ['', [Validators.required]],
      username: ['', Validators.required],
      privacyPolicy: [false, Validators.requiredTrue] // Debe ser true para ser válido
    }, { validators: this.passwordsMatchValidator });
  }

  // Validador para verificar que las contraseñas coincidan
  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('pass')?.value;
    const repeatPassword = form.get('repeatpass')?.value;
    return password === repeatPassword ? null : { mismatch: true };
  }

  // Validación para enviar el formulario
  onSubmit() {
    if (this.registrationForm.valid) {

      const formValues = this.registrationForm.value;

      // Selecciona solo los campos necesarios para crear el objeto User
      const user: User = {
        id: formValues.id,
        username: formValues.username,
        password: formValues.pass,
        email: formValues.mail,
      };
      // Lógica para manejar el envío del formulario
      this.registrationService.registerUser(user).subscribe({
          next: () => {
            alert("Registro exitoso");
          this.router.navigate(['login'])}, // Remplazar por home
          error: (error) => {alert("Ha habido un error en su registro. Por favor vuelva a intentarlo mas tarde")}
      }

      );
    } else {
      console.log('Formulario inválido');
      this.registrationForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores
    }
  }

  // Métodos para mostrar mensajes de error
  get emailError() {
    const control = this.registrationForm.get('mail');
    return control?.touched && control?.invalid ? 'Correo no válido' : null;
  }

  get passwordError() {
    const control = this.registrationForm.get('pass');
    const formError = this.registrationForm.errors?.['mismatch'];
    if (control?.touched && control?.invalid) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return formError ? 'Las contraseñas no coinciden' : null;
  }

  get usernameError() {
    const control = this.registrationForm.get('username');
    return control?.touched && control?.invalid ? 'El nombre de usuario es obligatorio' : null;
  }

  openLogin() {
    this.router.navigate(['login']);
  }
}
