import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../services/auth';
import { Modal } from '../../../services/modal';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: Auth, private modal: Modal, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  async signIn(email = this.loginForm.value.email, password = this.loginForm.value.password) {
    try {
      const { user, session } = await this.auth.signIn(email, password);
      if (user) {
        this.modal.showModal(
          'Inicio de sesión exitoso', 
          `Bienvenido/a ${user.email}`, 
          'success'
        );
        this.router.navigate(['/home'])
      };
    } catch {
      this.modal.showModal(
        'Error en el inicio de sesión',
        'Correo o contraseña incorrectos. Intente nuevamente.',
        'error'
      );
    }
  }
}
