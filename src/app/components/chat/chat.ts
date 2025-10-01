import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, effect, ElementRef, OnInit, Signal, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '@supabase/supabase-js';
import { Supabase } from '../../services/supabase';
import { HighlightMessages } from '../../directives/highlight-messages'
import { FormatTimePipe } from '../../pipes/format-time-pipe';
import { FormatNamePipe } from '../../pipes/format-name-pipe';

@Component({
  selector: 'app-chat',
  imports: [ReactiveFormsModule, CommonModule, HighlightMessages, FormatTimePipe, FormatNamePipe],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat implements OnInit, AfterViewChecked {
  user: Signal<User | null>;
  messages = signal<any[]>([]);
  chatForm: FormGroup;
  loading = signal(true);

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  constructor(private formBuilder: FormBuilder, private supabase: Supabase) {
    this.user = this.supabase.user;

    this.chatForm = this.formBuilder.group({
      message: ['', [Validators.required, Validators.maxLength(40)]],
    })
  }

  async ngOnInit() {
    await this.supabase.setupRealtime('messages', this.messages);
    await this.supabase.loadTable('messages', this.messages);
    this.loading.set(false);

    effect(() => {
      this.messages();
      console.log('Mensaje nuevo')
    })
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  async sendMessage() {
    const text = this.chatForm.value.message?.trim();
    const time = Date.now();

    if (text) {
      const msg = { user_email: this.user()?.email, text, time };
      try {
        await this.supabase.saveTable(msg, 'messages');
        await this.supabase.loadTable('messages', this.messages);
        this.chatForm.reset();
      } catch (error) {
        console.log(error)
      }
    }
  }

  private scrollToBottom() {
    const container = this.chatContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }
}
