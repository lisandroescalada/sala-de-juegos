import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { QuienSoy } from './components/quien-soy/quien-soy';
import { authGuard } from './guards/auth-guard';
import { ageGuard } from './guards/age-guard';

export const routes: Routes = [
    { 
        path: '', redirectTo:'/home', 
        pathMatch:'full' 
    },
    { 
        path: 'home', 
        component: Home 
    },
    { 
        path: 'login', 
        component: Login 
    },
    { 
        path: 'register',
        component: Register
    },
    { 
        path: 'quien-soy', 
        component: QuienSoy
    },
    {
        path: 'ahorcado',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./components/games/ahorcado/ahorcado').then(m => m.Ahorcado)
    },
    {
        path: 'mayor-menor',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./components/games/mayor-menor/mayor-menor').then(m => m.MayorMenor)
    },
    {
        path: 'preguntados',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./components/games/preguntados/preguntados').then(m => m.Preguntados)
    },
    {
        path: 'simon-dice',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./components/games/simon-dice/simon-dice').then(m => m.SimonDice)
    },
    {
        path: 'chat',
        canActivate: [authGuard, ageGuard],
        loadComponent: () =>
            import('./components/chat/chat').then(m => m.Chat)
    },
    {
        path: 'stats',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./components/stats/stats').then(m => m.Stats)
    }
];
