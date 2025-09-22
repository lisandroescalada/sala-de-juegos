import { Component } from '@angular/core';
import { Auth } from '../../../services/auth';
import { Modal } from '../../../services/modal';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: Auth, private modal: Modal) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  async signUp() {
    try {
      await this.auth.signUp(this.registerForm.value.email, this.registerForm.value.password)
      this.modal.showModal(
        'Registro exitoso', 
        'Recordá confirmar tu email para activar la cuenta.', 
        'success'
      );
    } catch (error: any) {
      this.modal.showModal(
        'Error en el registro', 
        'Ingrese un correo válido y una contraseña de al menos 6 caracteres.', 
        'error'
      );
    }
  }
}
