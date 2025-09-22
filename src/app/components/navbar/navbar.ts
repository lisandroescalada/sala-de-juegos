import { Component, OnInit } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { Auth } from '../../services/auth';
import { Modal } from '../../services/modal';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  currentUser: User | null = null;

  constructor(private auth: Auth, private modal: Modal) {}

  async ngOnInit(): Promise<void> {
    this.currentUser = await this.auth.getUser();

    this.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        this.currentUser = session.user;
      }
    });
  }

  signOut() {
    this.auth.signOut();
    this.currentUser = null;
    this.modal.showModal(
      'Cierre de sesión exitoso', 
      'Sesión cerrada correctamente. ¡Hasta la próxima!'
    );
  }
}
