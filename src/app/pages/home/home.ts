import { Component, OnInit } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { Auth } from '../../services/auth';
import { Modal } from '../../services/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  currentUser: User | null = null;

  constructor(private auth: Auth, private modal: Modal, private router: Router) {}

  async ngOnInit(): Promise<void> {
    this.currentUser = await this.auth.getUser();
    this.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        this.currentUser = session.user;
      }
    });
  }

  restrictedNavigation(page: string) {
    if (this.currentUser) {
      this.router.navigate([`/${page}`]);
    } else {
      this.modal.showModal(
        'Acceso restringido',
        'Debes iniciar sesión para acceder a esta sección.'
      );
    }
  }
}
