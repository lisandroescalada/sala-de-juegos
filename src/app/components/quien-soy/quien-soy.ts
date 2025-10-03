import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-quien-soy',
  imports: [],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css'
})
export class QuienSoy implements OnInit {
  data = signal<any>(null)
  loading = signal(true);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('https://api.github.com/users/lisandroescalada').subscribe({
      next: (res) => {
        this.data.set(res);
        this.loading.set(false);
      },
      error: (e: any) => {
        console.log('Error fetching data:', e);
        this.loading.set(false);
      }
    });
  }
}
