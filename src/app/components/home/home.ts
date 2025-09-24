import { Component, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Supabase } from '../../services/supabase';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  user: Signal<User | null>;

  constructor(private supabase: Supabase) {
    this.user = this.supabase.user;
  }
}
