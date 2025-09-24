import { CommonModule } from '@angular/common';
import { Component, OnInit, Signal, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Modal } from '../../services/modal';
import { HttpClient } from '@angular/common/http';
import { Supabase } from '../../services/supabase';
import { User } from '@supabase/supabase-js';

interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

@Component({
  selector: 'app-preguntados',
  imports: [CommonModule, RouterLink],
  templateUrl: './preguntados.html',
  styleUrl: './preguntados.css'
})
export class Preguntados implements OnInit {
  startTime = Date.now();
  user: Signal<User | null>;

  questions = signal<Question[]>([]);
  options = signal<string[]>([]);

  currentQuestion = signal(0);
  score = signal(0);

  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private router: Router, private modal: Modal, private http: HttpClient, private supabase: Supabase) {
      this.user = this.supabase.user;
  }

  ngOnInit() {
    this.http.get<{ results: Question[] }>('https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple').subscribe({
      next: (response) => {
        this.questions.set(response.results);
        this.options.set(this.getOptions());
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error:', error);
        this.error.set('Demasiadas solicitudes, intentá de nuevo en otro momento.');
        this.loading.set(false);
      }
    });
  }

  async nextQuestion() {
    this.currentQuestion.set(this.currentQuestion() + 1);

    if (this.currentQuestion() >= this.questions().length) {
      const time = Math.floor((Date.now() - this.startTime) / 1000);
      this.router.navigate(['/home']);

      this.modal.showModal(
        'Juego Terminado',
        `Puntuación: ${this.score()}/${this.questions().length} en ${time} segundos`
      );

      const data = { game: 'preguntados', time: time, score: this.score(), user_email: this.user()?.email }
      try {
        await this.supabase.saveTable(data, 'stats');
      } catch (error) {
        console.log('Error al guardar los datos:', error)
      }

    } else {
      this.options.set(this.getOptions());
    }
  }

  async checkAnswer(index: number) {
    if (this.options()[index] === this.questions()[this.currentQuestion()].correct_answer) {
      this.score.set(this.score() + 1);
      await this.modal.showModal('Correcto', '¡Respuesta correcta!');
    } else {
      await this.modal.showModal('Incorrecto', `La respuesta correcta era: ${this.questions()[this.currentQuestion()].correct_answer}`);
    }
    this.nextQuestion();
  }

  getOptions(): string[] {
    const question = this.questions()[this.currentQuestion()];
    const options = [...question.incorrect_answers, question.correct_answer];
    return options.sort(() => Math.random() - 0.5);
  }

  decodeHtmlEntities(text: string): string {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }
}
