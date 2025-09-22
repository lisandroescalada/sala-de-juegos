import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-quien-soy',
  imports: [],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css'
})
export class QuienSoy implements OnInit {
  gitGubData: any = {};
  loading = signal(true);
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getGitHubData()
  }

  getGitHubData() {    
    this.http.get('https://api.github.com/users/lisandroescalada')
      .subscribe({
        next: (data) => {
          this.gitGubData = data;
          this.loading.set(false);
          console.log('Datos de GitHun recibidos: ', data)
        },
        error: (error: any) => {
          this.error = 'No se pudo obtener el usuario: ', (error?.message || error);
          this.loading.set(false);
        }
    })
  }
}
