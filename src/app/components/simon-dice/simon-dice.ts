import { Component, Signal, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Modal } from '../../services/modal';
import { Supabase } from '../../services/supabase';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-simon-dice',
  imports: [RouterLink],
  templateUrl: './simon-dice.html',
  styleUrl: './simon-dice.css'
})
export class SimonDice {
  startTime = Date.now();
  colors = ['red', 'blue', 'green', 'yellow'];
  sequence: string[] = [];
  playerSequence: string[] = [];
  level = signal(0);
  isPlaying = false;
  canClick = false;
  activeButton = '';
  user: Signal<User | null>;

  constructor(private modal: Modal, private router: Router, private supabase: Supabase) {
      this.user = this.supabase.user;
  }

  startGame() {
    this.sequence = [];
    this.playerSequence = [];
    this.level.set(0);
    this.isPlaying = true;

    this.nextLevel();
  }

  playerClick(color: string) {
    if (!this.canClick) return;
    
    this.playerSequence.push(color);
    this.flashButton(color);
    
    if (this.playerSequence[this.playerSequence.length - 1] !== this.sequence[this.playerSequence.length - 1]) {
      this.gameOver();
      return;
    }
    
    if (this.playerSequence.length === this.sequence.length) {
      this.canClick = false;
      setTimeout(() => this.nextLevel(), 1000);
    }
  }

  nextLevel() {
    this.level.set(this.level() + 1);
    this.playerSequence = [];
    this.sequence.push(this.colors[Math.floor(Math.random() * 4)]);
    this.playSequence();
  }

  playSequence() {
    this.canClick = false;
    let i = 0;
    
    const showNext = () => {
      if (i < this.sequence.length) {
        this.flashButton(this.sequence[i]);
        i++;
        setTimeout(showNext, 700);
      } else {
        this.canClick = true;
      }
    };
    
    setTimeout(showNext, 500);
  }

  flashButton(color: string) {
    this.activeButton = color;
    setTimeout(() => this.activeButton = '', 300);
  }

  async gameOver() {
    const time = Math.floor((Date.now() - this.startTime) / 1000);
    this.isPlaying = false;
    this.canClick = false;
    this.modal.showModal('¡Game Over!', `Nivel alcanzado: ${this.level()}`);
    this.router.navigate(['/home']);

    const data = { game: 'simon', time: time, level: this.level(), user_email: this.user()?.email }
      try {
        await this.supabase.saveTable(data, 'stats');
      } catch (error) {
        console.log('Error al guardar los datos:', error)
      }
  }
}
