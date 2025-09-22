import { Component, OnInit } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { Modal } from '../../../services/modal';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-ahorcado',
  imports: [RouterLink],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css'
})
export class Ahorcado implements OnInit {
  currentUser: User | null = null;

  startTime = Date.now();
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  words = ['TYPESCRIPT', 'ANGULAR', 'PROGRAMACION', 'DESARROLLO', 'COMPUTADORA'];

  mistakes = 0;
  displayWord = '';
  guessedLetters: string[] = [];
  word = this.words[Math.floor(Math.random() * this.words.length)];

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

  constructor(private modal: Modal, private router: Router, private auth: Auth) {}

  async ngOnInit() {
    this.currentUser = await this.auth.getUser();
    this.updateGame();
  }

  updateGame() {
    this.displayWord = this.word.split('').map(letter =>
      this.guessedLetters.includes(letter) ? letter : '_'
    ).join(' ');
    this.verifyVictory();
  }

  guessLetter(letter: string) {
    this.guessedLetters.push(letter);
    if (!this.word.includes(letter)) {
      this.mistakes++;
    }
    this.updateGame();
  }

  verifyVictory() {
    const time = Math.floor((Date.now() - this.startTime) / 100);

    if (this.displayWord.replace(/ /g, '') === this.word) {

      this.auth.saveTable({
        game: 'ahorcado',
        time: time,
        won: true,
        player: this.currentUser?.email
      }, 'game_stats');

      this.modal.showModal(
        '¡Victoria!', 
        `Has adivinado la palabra "${this.word}" en ${time} segundos.`
      );

      this.router.navigate(['/home']);
    } else if (this.mistakes >= 7) {

      this.auth.saveTable({
        game: 'ahorcado',
        time: time,
        won: false,
        player: this.currentUser?.email
      }, 'game_stats');

      this.modal.showModal(
        'Game Over', 
        `La palabra era "${this.word}".`
      );

      this.router.navigate(['/home']);
    }
  }
}
