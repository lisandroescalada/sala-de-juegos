import { Component, OnInit, signal, Signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { User } from '@supabase/supabase-js';
import { Supabase } from '../../services/supabase';
import { Modal } from '../../services/modal';
import { FormatNamePipe } from '../../pipes/format-name-pipe';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, FormatNamePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  user: Signal<User | null>;

  constructor(private supabase: Supabase, private router: Router, private modal: Modal) {
    this.user = this.supabase.user;
  }

  signOut() {
    try {
      this.supabase.signOut();
      this.modal.showModal('Cierre de sesión exitoso', 'Sesión cerrada correctamente. ¡Hasta la próxima!');
      this.router.navigate(['home']);
    } catch {
      this.modal.showModal('Error en el cierre de sesión', 'Intente nuevamente.', 'error');
    }
  }
}
