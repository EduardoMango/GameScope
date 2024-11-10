

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { inject } from '@angular/core';
import { AuthService } from '../../services/AuthService';
import { User } from '../../Model/Interfaces/User';

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

  constructor(private router: Router, private fb: FormBuilder) {
    // Inicializar el formulario reactivo
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Validación para el correo electrónico
      password: ['', [Validators.required, Validators.minLength(6)]] // Validación para la contraseña
    });
  }

  ngOnInit(): void {}
  private authService = inject(AuthService);

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, rellena todos los campos correctamente';
      return;
    }

    const { email, password } = this.loginForm.value; // Obtener valores del formulario

    this.authService.login(email, password).subscribe(
      {
        next: (user: User) => {
          // Si el usuario existe, el inicio de sesión es exitoso y el usuario ya está guardado en LocalStorage
          alert('Inicio de sesión exitoso');
          this.router.navigate(['/']); // Redirigir a la homepage o a la ruta deseada
        },
        error: (error: Error) => {
          this.errorMessage = error.message === 'Credenciales incorrectas' ? 'Email o contraseña incorrectos' : 'Usuario inactivo'
          alert(this.errorMessage);
        }
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

