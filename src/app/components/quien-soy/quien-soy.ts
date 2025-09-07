import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quien-soy',
  imports: [],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.scss'
})
export class QuienSoy implements OnInit {
  githubData: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('https://api.github.com/users/lisandroescalada')
      .subscribe(data => {
        this.githubData = data;
      });
  }
}
