import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Supabase } from '../../../services/supabase';
import { Alert } from '../../../services/alert';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private supabase: Supabase, private alert: Alert, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  async signIn(email = this.loginForm.value.email, password = this.loginForm.value.password) {
    try {
      const { user, session } = await this.supabase.signIn(email, password);
      if (user) {
        this.alert.showAlert('Inicio de sesión exitoso', `Bienvenido/a ${user.email}`, 'success');
        this.router.navigate(['/home'])
      };
    } catch (error: any) {
      this.alert.showAlert('Error en el inicio de sesión', error.message, 'error');
    }
  }
}
