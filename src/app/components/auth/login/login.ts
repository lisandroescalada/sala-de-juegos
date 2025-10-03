import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Supabase } from '../../../services/supabase';
import { Modal } from '../../../services/modal';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  supabase = inject(Supabase);
  router = inject(Router);
  modal = inject(Modal);

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  async login(email = this.loginForm.value.email, password = this.loginForm.value.password) {
    try {
      await this.supabase.login(email, password);

      this.modal.showModal(
        'Inicio de sesión exitoso',
        '¡Bienvenido/a! Has iniciado sesión correctamente.',
        'success'
      );

      this.router.navigate(['/home'])
    } catch (err: any) {
      this.modal.showModal(
        'Error en el inicio de sesión',
        'Correo o contraseña incorrectos.',
        'error'
      );
    }
  }
}
