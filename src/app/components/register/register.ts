import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Supabase } from '../../services/supabase';
import { Modal } from '../../services/modal';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private supabase: Supabase, private modal: Modal, private router: Router) {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  async signUp() {
    try {
      await this.supabase.signUp(this.registerForm.value.email, this.registerForm.value.password)
      this.modal.showModal('Registro exitoso', 'Recordá confirmar tu email para activar la cuenta.', 'success');
    } catch (error: any) {
      this.modal.showModal('Error en el registro', 'Ingrese un correo válido y una contraseña de al menos 6 caracteres.', 'error');
    }
  }
  
  
}
