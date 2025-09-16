import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quien-soy',
  imports: [],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css'
})
export class QuienSoy implements OnInit {
  gitGubData: any = {};
  loading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getGitHubData()
  }

  getGitHubData() {    
    this.http.get('https://api.github.com/users/lisandroescalada')
      .subscribe({
        next: data => {
          this.gitGubData = data;
          this.loading = false;
        },
        error: error => {
          this.error = '⚠️ No se pudo obtener el usuario: ', error;
          this.loading = false;
        }
    })
  }
}
