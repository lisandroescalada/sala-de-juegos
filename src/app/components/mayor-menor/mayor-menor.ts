import { Component, Signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Modal } from '../../services/modal';
import { Supabase } from '../../services/supabase';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-mayor-menor',
  imports: [RouterLink],
  templateUrl: './mayor-menor.html',
  styleUrl: './mayor-menor.css'
})
export class MayorMenor {
  currentCard: number = Math.floor(Math.random() * 13) + 1;
  score: number = 0;
  startTime: number = Date.now();
  user: Signal<User | null>;

  cardSymbols = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  constructor(private router: Router, private modal: Modal, private supabase: Supabase) {
      this.user = this.supabase.user;
  }
  
  async makeGuess(guess: 'mayor' | 'menor') {
    const nextCard = Math.floor(Math.random() * 13) + 1;

    console.log(`Carta actual: ${this.currentCard}, Siguiente carta: ${nextCard}, Adivinanza: ${guess}`);

    if ((guess === 'mayor' && nextCard > this.currentCard) || (guess === 'menor' && nextCard < this.currentCard)) {
      this.score++;
      this.currentCard = nextCard;
    } else if (nextCard === this.currentCard) {
      this.modal.showModal('Empate', 'La siguiente carta es igual a la actual. Intenta de nuevo.');
    } else {
      const time = Math.floor((Date.now() - this.startTime) / 1000);
      this.modal.showModal('Game Over', `Tu puntuación final: ${this.score} en ${time} segundos.`)

      const data = { game: 'mayormenor', time: time, score: this.score, user_email: this.user()?.email }
      try {
        await this.supabase.saveTable(data, 'stats');
      } catch (error) {
        console.log('Error al guardar los datos:', error)
      }

      this.router.navigate(['/home']);
    }
  }
}
