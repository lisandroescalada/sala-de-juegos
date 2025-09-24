// Importa la interfaz Routes de Angular, que se usa para definir rutas en la aplicación
import { Routes } from '@angular/router';

// Importa los componentes que estarán directamente cargados en las rutas
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { QuienSoy } from './components/quien-soy/quien-soy';

// Importa un guard que protege rutas, asegurándose de que solo usuarios autenticados puedan acceder
import { authGuard } from './guards/auth-guard';

// Define todas las rutas de la aplicación
export const routes: Routes = [
    // Ruta por defecto: si el path está vacío, redirige a '/home'
    { path: '', redirectTo:'/home', pathMatch:'full' },

    // Ruta para la página principal
    { path: 'home', component: Home },

    // Ruta para la página de login
    { path: 'login', component: Login },

    // Ruta para la página de registro
    { path: 'register', component: Register },

    // Ruta para la página "Quién Soy"
    { path: 'quien-soy', component: QuienSoy },

    // Ruta para el juego Ahorcado
    {
        path: 'ahorcado',          // URL de la ruta
        canActivate: [authGuard],  // Solo accesible si pasa el authGuard
        loadComponent: () =>       // Lazy loading: carga el componente solo cuando se accede
            import('./components/ahorcado/ahorcado').then(m => m.Ahorcado)
    },

    // Ruta para el juego Mayor-Menor
    {
        path: 'mayor-menor',
        canActivate: [authGuard],  // Protegida con el guard
        loadComponent: () =>
            import('./components/mayor-menor/mayor-menor').then(m => m.MayorMenor)
    },

    // Ruta para el juego Preguntados
    {
        path: 'preguntados',
        canActivate: [authGuard],  // Protegida con el guard
        loadComponent: () =>
            import('./components/preguntados/preguntados').then(m => m.Preguntados)
    },

    // Ruta para el juego Simón Dice
    {
        path: 'simon-dice',
        canActivate: [authGuard],  // Protegida con el guard
        loadComponent: () =>
            import('./components/simon-dice/simon-dice').then(m => m.SimonDice)
    },

    // Ruta para el chat
    {
        path: 'chat',
        canActivate: [authGuard],  // Solo usuarios autenticados
        loadComponent: () =>
            import('./components/chat/chat').then(m => m.Chat)
    },

    // Ruta para estadísticas
    {
        path: 'stats',
        canActivate: [authGuard],  // Protegida
        loadComponent: () =>
            import('./components/stats/stats').then(m => m.Stats)
    }
];
