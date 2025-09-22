# 🎮 Sala de Juegos

## 🛠️ Tecnologías

- **Frontend**: Angular
- **Framework CSS**: Bootstrap
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

### Ahorcado:
![Ahorcado](public\Ahorcado.png)
