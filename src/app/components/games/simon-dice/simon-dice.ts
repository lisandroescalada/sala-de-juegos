import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Modal } from '../../../services/modal';
import { Supabase } from '../../../services/supabase';

@Component({
  selector: 'app-simon-dice',
  imports: [RouterLink],
  templateUrl: './simon-dice.html',
  styleUrl: './simon-dice.css'
})
export class SimonDice {
  startTime = Date.now();
  colors = ['red', 'blue', 'green', 'yellow'];
  level = signal(0);

  isPlaying = false;
  canClick = false;

  sequence: string[] = [];

  playerSequence: string[] = [];
  activeButton = '';

  constructor(private modal: Modal, private router: Router, private supabase: Supabase) {}

  clickButton(color: string) {
    this.playerSequence.push(color);
    this.flashButton(color);

    console.log('playerSequence:', this.playerSequence);

    if (this.playerSequence[this.playerSequence.length - 1] !== this.sequence[this.playerSequence.length - 1]) {
      this.gameOver();
      return;
    }

    if (this.playerSequence.length === this.sequence.length) {
      this.canClick = false;
      setTimeout(() => this.nextLevel(), 1000);
    }
  }

  // startGame() {
  //   this.nextLevel();
  // }

  flashButton(color: string) {
    this.activeButton = color;
    setTimeout(() => this.activeButton = '', 300);
  }

  nextLevel() {
    this.isPlaying = true;
    this.level.set(this.level() + 1);
    this.playerSequence = [];
    this.sequence.push(this.colors[Math.floor(Math.random() * 4)]);

    console.log('sequence:', this.sequence);

    this.playSequence();
  }

  playSequence() {
    this.canClick = false;
    let index = 0;

    const showNext = () => {
      if (index < this.sequence.length) {
      this.flashButton(this.sequence[index]);
      index++;
      setTimeout(showNext, 700);
    } else {
        this.canClick = true;
      }
    };

    setTimeout(showNext, 500);
  }

  async gameOver() {
    const time = Math.floor((Date.now() - this.startTime) / 1000);

    this.isPlaying = false;
    this.canClick = false;

    try {
      await this.supabase.insert('stats', {
        game: 'simon',
        user_email: this.supabase.user()?.email,
        win: null,
        score: null,
        level: this.level(),
        time: time
      });
    } catch (e: any) {
      console.log('insert error:', e);
    }

    this.modal.showModal(
      '¡Game Over!', 
      `Nivel alcanzado: ${this.level()}`
    );
    this.router.navigate(['/home']);
  }
}
