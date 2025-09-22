import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { QuienSoy } from './pages/quien-soy/quien-soy';
import { Ahorcado } from './pages/games/ahorcado/ahorcado';
import { Mayormenor } from './pages/games/mayormenor/mayormenor';
import { Chat } from './pages/chat/chat';

export const routes: Routes = [
    { path: '', redirectTo:'/home', pathMatch:'full' },
    { path: 'home', component: Home },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'quien-soy', component: QuienSoy },
    { path: 'ahorcado', component: Ahorcado },
    { path: 'mayormenor', component: Mayormenor },
    { path: 'chat', component: Chat },
];
