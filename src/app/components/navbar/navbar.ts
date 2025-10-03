import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
  sb = inject(Supabase);

  items = [
    { title: 'Inicio', route: 'home' },
    { title: 'Quién soy', route: 'quien-soy' },
    { title: 'Chat', route: 'chat' },
    { title: 'Estadísticas', route: 'stats' }
  ]

  constructor(private modal: Modal, private router: Router) {}

  logout() {
    this.sb.logout();
    this.modal.showModal(
      'Cierre de sesión exitoso',
      'Sesión cerrada correctamente.'
    );
    this.router.navigate(['/home']);
  }
}
