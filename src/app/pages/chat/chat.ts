import { Component, OnInit, Signal, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '@supabase/supabase-js';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat implements OnInit {
  currentUser: User | null = null;
  chatForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: Auth) {
    this.chatForm = this.fb.group({
      message: ['', [Validators.required]],
    })
  }

  get messages() {
    return this.auth.items;
  }

  async ngOnInit() {
    this.currentUser = await this.auth.getUser();
    await this.auth.setupRealtime('chat_messages');
  }

  sendMessage() {
    const text = this.chatForm.value.message?.trim();
    const time = Date.now();

    if (text) {
      const msg = { player: this.currentUser?.email, text, time };
      this.auth.saveTable(msg, 'chat_messages');
      this.auth.items.update(arr => [...arr, msg]);
      this.chatForm.reset();
    }
  }

  formatTime(time: number) {
    return new Date(time).toLocaleTimeString();
  }
}
