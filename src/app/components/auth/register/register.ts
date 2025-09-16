import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Supabase } from '../../../services/supabase';
import { Alert } from '../../../services/alert';


@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private supabase: Supabase, private alert: Alert) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  async signUp() {
    try {
      await this.supabase.signUp(this.registerForm.value.email, this.registerForm.value.password)
      this.alert.showAlert(
        'Registro exitoso', 'Recordá confirmar tu email para activar la cuenta.', 'success');
    } catch (error: any) {
      this.alert.showAlert('Error en el registro', error.message, 'error');
    }
  }
}
