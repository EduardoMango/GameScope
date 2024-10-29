import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/AuthService';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    // Inicializar el formulario reactivo
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Validación para el correo electrónico
      password: ['', [Validators.required, Validators.minLength(6)]] // Validación para la contraseña
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, rellena todos los campos correctamente';
      return;
    }

    const { email, password } = this.loginForm.value; // Obtener valores del formulario

    this.authService.login(email, password).subscribe(
      (response) => {
        if (response.length > 0) {
          // Inicio de sesión exitoso
          this.authService.setSessionActive(); // Marcar la sesión como activa
          alert('Inicio de sesión exitoso');
          this.router.navigate(['/']); // Redirigir a la homepage
        } else {
          // Credenciales inválidas
          this.errorMessage = 'Email o contraseña incorrectos';
        }
      },
      (error) => {
        this.errorMessage = 'Error en la autenticación';
      }
    );
  }

  emailError() {
    const control = this.loginForm.get('email');
    return control?.touched && control?.invalid ? 'Correo no válido' : null;
  }

  passwordError(){
    const control = this.loginForm.get('password');
    return control?.touched && control?.invalid ? 'La contraseña debe tener al menos 6 caracteres' : null;
  }
}

