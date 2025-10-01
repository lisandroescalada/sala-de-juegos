import { Directive, ElementRef, HostListener, inject, Input, OnInit, Renderer2, Signal } from '@angular/core';
import { Supabase } from '../services/supabase';
import { User } from '@supabase/supabase-js';

@Directive({
  selector: '[appHighlightMessages]'
})
export class HighlightMessages implements OnInit {
  private supabase = inject(Supabase);
  user: Signal<User | null>;

  @Input() appHighlightMessages: string | undefined;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.user = this.supabase.user;
  }

  ngOnInit() {
    if (this.appHighlightMessages === this.user()?.email) {
      this.renderer.setStyle(this.el.nativeElement, 'color', '#fff');
      this.renderer.setStyle(this.el.nativeElement, 'text-align', 'right');
      this.renderer.setStyle(this.el.nativeElement, 'margin-left', 'auto');
      this.renderer.setStyle(this.el.nativeElement, 'background', 'linear-gradient(to right, #7FFFD4 0%, #4B0082 100%)');
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'background', '#e9ecef');
    }
  }
}
