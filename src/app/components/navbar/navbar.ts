import { Component, OnInit } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { Supabase } from '../../services/supabase';
import { Alert } from '../../services/alert';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  currentUser: User | null = null;

  constructor(private supabase: Supabase, private alert: Alert, private router: Router) {}

  async ngOnInit(): Promise<void> {
    this.currentUser = await this.supabase.getUser();

    this.supabase.onAuthStateChange((_event, session) => {
      if (session?.user) {
        this.currentUser = session.user;
      }
    });
  }

  signOut() {
      this.supabase.signOut();
      this.currentUser = null;
      this.alert.showAlert('Cierre de sesión exitoso', 'Sesión cerrada correctamente. ¡Hasta la próxima!');
  }
}
