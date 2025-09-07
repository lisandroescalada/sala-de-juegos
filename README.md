# Sala de Juegos
Aplicación para medir habilidades cognitivas y motrices de los jugadores, con estadísticas y juegos interactivos.

## 📦 Instalación

### Proyecto
- `npm install -g @angular/cli`
- `ng start sala-de-juegos`
- `ng build -c production`

### Dependencias
- `npm i bootstrap`
- `npm i @supabase/supabase-js`

### Componentes
- `ng g c components/home`
- `ng g c components/quien-soy`
- `ng g c components/auth/registro`
- `ng g c components/auth/login`
 
### Servicios 
- `ng g service services/supabase`

## ⚙️ Configurar environments

```typescript
export const environment = {
  production: false,
  supabaseUrl: 'SUPABASE_URL',
  supabaseKey: 'SUPABASE_KEY'
}
```

## 🎮 Componente: Quién Soy

### Simón Dice
Es un juego clásico de memoria y reflejos que he implementado para esta sala de juegos. El juego consiste en memorizar y repetir secuencias de colores que van aumentando en complejidad.

#### ¿Cómo jugar?
- El juego muestra una secuencia de colores iluminándolos en orden
- El jugador debe repetir la secuencia haciendo clic en los botones de colores
- Cada vez que aciertas, se añade un nuevo color a la secuencia
- El juego termina cuando cometes un error
- Tu puntuación se basa en el nivel alcanzado y el tiempo jugado