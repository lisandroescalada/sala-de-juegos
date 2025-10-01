import { Component, Signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { User } from '@supabase/supabase-js';
import { Modal } from '../../services/modal';
import { Supabase } from '../../services/supabase';

@Component({
  selector: 'app-ahorcado',
  imports: [RouterLink],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css'
})
export class Ahorcado {
  startTime = Date.now();
  user: Signal<User | null>;
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  words = ['TYPESCRIPT', 'ANGULAR', 'PROGRAMACION', 'DESARROLLO', 'COMPUTADORA'];
  word = this.words[Math.floor(Math.random() * this.words.length)];
  
  displayWord = '';
  pressedLetters: string[] = [];
  mistakes = 0;

  hangmanStages: string[] = [
    '',
    '  O  ',
    '  O  \n  |  ',
    '  O  \n /|  ',
    '  O  \n /|\\ ',
    '  O  \n /|\\ \n  |  ',
    '  O  \n /|\\ \n  |  \n /   ',
    '  O  \n /|\\ \n  |  \n / \\ '
  ];

  constructor(private modal: Modal, private router: Router, private supabase: Supabase) {
    this.user = this.supabase.user;
  }

  async ngOnInit() {
    this.showGuessedLetters();
  }

  showGuessedLetters() {
    this.displayWord = this.word.split('').map(letter => 
      this.pressedLetters.includes(letter) ? letter : '_'
    ).join('');
  }

  pressLetter(letter: string) {
    this.pressedLetters.push(letter);

    if (!this.word.includes(letter)) {
      this.mistakes++;
    }

    this.showGuessedLetters();
    this.verifyVictory();
  }

  async verifyVictory() {
    const time = Math.floor((Date.now() - this.startTime) / 100);

    if (this.displayWord === this.word) {

      const data = { game: 'ahorcado', time: time, win: 1, user_email: this.user()?.email }
      try {
        await this.supabase.saveTable(data, 'stats');
      } catch (error) {
        console.log('Error al guardar los datos:', error)
      }

      this.modal.showModal(
        '¡Victoria!', 
        `Has adivinado la palabra "${this.word}" en ${time} segundos.`
      );

      this.router.navigate(['/home']);
    } else if (this.mistakes >= 7) {
      this.modal.showModal(
        'Game Over', 
        `La palabra era "${this.word}".`
      );

      this.router.navigate(['/home']);
    }
  }
}
