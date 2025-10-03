import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  supabase = inject(Supabase);
  loading = signal(true);
  chatForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.chatForm = this.formBuilder.group({
      message: ['', [Validators.required, Validators.maxLength(40)]],
    })
  }

  async ngOnInit() {
    this.supabase.messages.set(await this.supabase.getAll('messages'));
    await this.supabase.setupRealtime();
    this.loading.set(false);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  async sendMessage() {
    try {
      await this.supabase.insert('messages', {
        user_email: this.supabase.user()?.email,
        text: this.chatForm.value.message?.trim(),
        time: Date.now()
      });
      this.chatForm.reset();
    } catch (e: any) {
      console.log('sendMessage error:', e);
    }
  }

  private scrollToBottom() {
    const container = this.chatContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }
}
