import { CommonModule } from '@angular/common';
import { Component, OnInit, Signal, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '@supabase/supabase-js';
import { Supabase } from '../../services/supabase';

@Component({
  selector: 'app-chat',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat implements OnInit {
  user: Signal<User | null>;
  messages = signal<any[]>([]);
  chatForm: FormGroup;
  loading = signal(true);

  constructor(private formBuilder: FormBuilder, private supabase: Supabase) {
    this.user = this.supabase.user;

    this.chatForm = this.formBuilder.group({
      message: ['', [Validators.required]],
    })
  }

  async ngOnInit() {
    await this.supabase.loadTable('messages', this.messages);
    await this.supabase.setupRealtime('messages', this.messages);
    this.loading.set(false);
  }

  async sendMessage() {
    const text = this.chatForm.value.message?.trim();
    const time = Date.now();

    if (text) {
      const msg = { user_email: this.user()?.email, text, time };
      try {
        await this.supabase.saveTable(msg, 'messages');
        this.chatForm.reset();
      } catch (error) {
        console.log(error)
      }
    }
  }

  formatTime(time: number) {
    return new Date(time).toLocaleTimeString();
  }
}
