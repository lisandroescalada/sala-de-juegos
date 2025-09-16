import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { QuienSoy } from './components/quien-soy/quien-soy';
import { Ahorcado } from './games/ahorcado/ahorcado';
import { MayorMenor } from './games/mayor-menor/mayor-menor';
import { Preguntados } from './games/preguntados/preguntados';
import { SimonDice } from './games/simon-dice/simon-dice';

export const routes: Routes = [
    {path: '', redirectTo:'/home', pathMatch:'full'},
    {path: 'home', component: Home},
    {path: 'login', component: Login},
    {path: 'register', component: Register},
    {path: 'quien-soy', component: QuienSoy},
    {path: 'ahorcado', component: Ahorcado},
    {path: 'mayormenor', component: MayorMenor},
    {path: 'preguntados', component: Preguntados},
    {path: 'simon', component: SimonDice}
];
