# 🎮 Sala de Juegos

## 📋 Descripción General

**Sala de Juegos** es una aplicación web interactiva diseñada para medir las capacidades cognitivas y motrices de los jugadores a través de diferentes juegos clásicos y modernos. La aplicación cuenta con un sistema completo de autenticación, estadísticas en tiempo real y una sala de chat para la interacción entre usuarios.

## 🚀 App en Vivo

[🔗 Ver App en Vivo](https://sala-de-juegos-two.vercel.app)

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Angular (HTML5, CSS3, TypeScript)
- **Framework CSS**: Bootstrap 5.3
- **Base de Datos**: Supabase
- **Deploy**: Vercel

## 📦 Instalación
 
### 1. Clonar el repositorio:
```bash
git clone https://github.com/lisandroescalada/sala-de-juegos.git
cd sala-de-juegos
```

### 2. Instalar dependencias:
```bash
npm install -g @angular/cli
npm install @supabase/supabase-js bootstrap @popperjs/core sweetalert2
```

### 3. Levantar el servidor:
```bash
ng serve -o
```

## 🔧 Configuración de Supabase

```typescript
export const environment = {
    production: false,
    supabaseUrl: 'TU_SUPABASE_URL',
    supabaseKey: 'TU_SUPABASE_ANON_KEY'
}
```

## 📸 Capturas de Pantalla

### Inicio:
![Home](public\Home.png)

### Quién Soy:
![QuienSoy](public\QuienSoy.png)

### Registro:
![Register](public\Register.png)

### Acceso:
![Login](public\Login.png)
