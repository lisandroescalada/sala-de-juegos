import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Supabase } from '../../../services/supabase';
import { Modal } from '../../../services/modal';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  supabase = inject(Supabase);
  router = inject(Router);
  modal = inject(Modal);

  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20)]],
      lastname: ['', [Validators.required, Validators.maxLength(20)]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(99)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  async register() {
    try {
      const userFound = await this.supabase.findUser(this.registerForm.value.email);

      if (userFound) {
        this.modal.showModal(
          'Correo ya registrado',
          'Ese correo ya está en uso. Probá iniciar sesión.',
          'error'
        );            
        return;
      }

      const userData = await this.supabase.register(this.registerForm.value.email, this.registerForm.value.password);

      if ('user' in userData && userData.user) {
        this.supabase.insert('users', {
          id: userData.user.id,
          email: this.registerForm.value.email,
          name: this.registerForm.value.name,
          lastname: this.registerForm.value.lastname,
          age: this.registerForm.value.age
        });

        this.modal.showModal(
          'Registro exitoso',
          'Recordá confirmar tu email para activar la cuenta.',
          'success'
        );
        this.router.navigate(['/login']);
      }
    } catch (error: any) {
      this.modal.showModal(
        'Error en el registro', 
        'Ocurrió un error al registrarse. Intente nuevamente.', 
        'error'
      );
    }
  }
}
