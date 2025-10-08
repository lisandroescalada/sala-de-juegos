import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Modal } from '../../../services/modal';
import { HttpClient } from '@angular/common/http';
import { Supabase } from '../../../services/supabase';
import { DecodeQuestionPipe } from '../../../pipes/decode-question-pipe';

interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

@Component({
  selector: 'app-preguntados',
  imports: [CommonModule, RouterLink, DecodeQuestionPipe],
  templateUrl: './preguntados.html',
  styleUrl: './preguntados.css'
})
export class Preguntados implements OnInit {
  start = performance.now();

  questions = signal<Question[]>([]);
  options = signal<string[]>([]);

  currentQuestion = signal(0);
  score = signal(0);

  loading = signal(true);
  error = signal<string | null>(null);

  decodeQuestion = new DecodeQuestionPipe();

  constructor(private router: Router, private modal: Modal, private http: HttpClient, private supabase: Supabase) {}

  ngOnInit() {
    this.http.get<{ results: Question[] }>('questions.json')
      .subscribe({
        next: (res) => {
          this.questions.set(res.results);
          this.options.set(this.getOptions());
          this.loading.set(false);
        },
        error: (e: any) => {
          this.error.set('Demasiadas solicitudes, intentá de nuevo en otro momento.');
          this.loading.set(false);
        }
    });
  }

  async nextQuestion() {
    this.currentQuestion.set(this.currentQuestion() + 1);

    if (this.currentQuestion() >= this.questions().length) {
      this.router.navigate(['/home']);

      const end = performance.now();
      const time = Math.floor((end - this.start) / 1000);

      this.modal.showModal(
        'Juego Terminado',
        `Puntuación: ${this.score()}/${this.questions().length} en ${time} segundos`
      );

      try {
        await this.supabase.insert('stats', {
          game: 'preguntados',
          user_email: this.supabase.user()?.email,
          win: null,
          score: this.score(),
          level: null,
          time: time
        });
      } catch (error) {
        console.log('insert error:', error)
      }
    } else {
      this.options.set(this.getOptions());
    }
  }

  async checkAnswer(index: number) {
    if (this.options()[index] === this.questions()[this.currentQuestion()].correct_answer) {
      this.score.set(this.score() + 1);
      await this.modal.showModal(
        'Correcto', 
        '¡Respuesta correcta!'
      );
    } else {
      await this.modal.showModal(
        'Incorrecto',
        `La respuesta correcta era: ${this.decodeQuestion.transform(this.questions()[this.currentQuestion()].correct_answer)}`
      );
    }
    this.nextQuestion();
  }

  getOptions(): string[] {
    let options: string[] = [];

    try {
      const question = this.questions()[this.currentQuestion()];
      options = [...question.incorrect_answers, question.correct_answer];
    } catch (e: any) {
      console.log('question error:', e);
    }

    return options.sort(() => Math.random() - 0.5);
  }
}
