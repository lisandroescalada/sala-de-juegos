import { Component, signal } from '@angular/core';
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
  users = signal<any[]>([]);

  constructor(private formBuilder: FormBuilder, private supabase: Supabase, private modal: Modal, private router: Router) {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(20)]],
      lastname: ['', [Validators.required, Validators.maxLength(20)]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(99)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  async ngOnInit() {
    await this.supabase.loadTable('users', this.users);
  }

  async signUp() {
    try {
      for (let user of this.users()) {
        if (this.registerForm.value.email === user.email) {
          this.modal.showModal(
            'Correo ya registrado',
            'Ese correo ya está en uso. Probá iniciar sesión.',
            'error'
          );            
          return;
        }
      }

      const userData = await this.supabase.signUp(this.registerForm.value.email, this.registerForm.value.password);

      const newUser = {
        id: userData?.id,
        email: this.registerForm.value.email,
        name: this.registerForm.value.name,
        lastname: this.registerForm.value.lastname,
        age: this.registerForm.value.age
      }

      this.supabase.saveTable(newUser, 'users');
      this.modal.showModal(
        'Registro exitoso',
        'Recordá confirmar tu email para activar la cuenta.',
        'success'
      );
    } catch (error: any) {
      this.modal.showModal('Error en el registro', 'Ingrese un correo válido y una contraseña de al menos 6 caracteres.', 'error');
    }
  }
}
