# sala-de-juegos

A web-based **game room** built with **Angular** and **Supabase**, featuring multiple classic games, real-time chat, user authentication, and a statistics panel.

---

## 🚀 Tech Stack

- [Angular](https://angular.io/) - Frontend framework
- [Supabase](https://supabase.com/) - Backend as a Service (authentication, real-time database)
- [TypeScript](https://www.typescriptlang.org/)
- CSS per component

---

## 📁 Project Structure
```
src/
├── app/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── chat/
│   │   ├── games/
│   │   │   ├── ahorcado/        # Hangman
│   │   │   ├── mayor-menor/     # Higher or Lower
│   │   │   ├── preguntados/     # Trivia Quiz
│   │   │   └── simon-dice/      # Simon Says
│   │   ├── home/
│   │   ├── navbar/
│   │   ├── quien-soy/           # About Me
│   │   └── stats/
│   ├── directives/
│   │   └── highlight-messages.ts
│   ├── environments/
│   │   └── environment.ts
│   ├── guards/
│   │   ├── age-guard.ts
│   │   └── auth-guard.ts
│   ├── pipes/
│   │   ├── decode-question-pipe.ts
│   │   ├── format-name-pipe.ts
│   │   └── format-time-pipe.ts
│   ├── services/
│   │   ├── modal.ts
│   │   └── supabase.ts
│   ├── app.config.ts
│   ├── app.routes.ts
│   ├── app.ts
│   ├── app.html
│   └── app.css
├── index.html
├── main.ts
└── styles.css
```

---

## 🎮 Games

| Game | Description |
|---|---|
| **Hangman** *(Ahorcado)* | Guess the hidden word letter by letter before running out of attempts |
| **Higher or Lower** *(Mayor o Menor)* | Guess whether the next card will be higher or lower |
| **Trivia Quiz** *(Preguntados)* | Answer trivia questions loaded from a local JSON file |
| **Simon Says** *(Simón Dice)* | Repeat the color sequence before time runs out |

---

## 📦 Features

### 🔐 Authentication
Login and registration powered by **Supabase Auth**.

### 💬 Real-time Chat
Global chat room for all logged-in users.

### 📊 Statistics
Dedicated stats panel displaying player scores and game history.

### 👤 About Me
Personal page with information about the developer.

### 🔒 Guards
- **Auth Guard** – Restricts access to routes requiring authentication.
- **Age Guard** – Restricts access based on user age.

### 🛠️ Pipes
| Pipe | Description |
|---|---|
| `decode-question-pipe` | Decodes HTML entities from trivia questions |
| `format-name-pipe` | Formats and capitalizes user names |
| `format-time-pipe` | Formats elapsed time for display |

### 🔧 Directives
- **Highlight Messages** – Highlights specific messages in the chat.

---

## ⚙️ Installation
```bash
# Clone the repository
git clone https://github.com/lisandroescalada/sala-de-juegos.git
cd sala-de-juegos

# Install dependencies
npm install
```

---

## 🔧 Environment Setup

Configure your Supabase credentials in `src/app/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  supabaseUrl: 'https://your-project.supabase.co',
  supabaseKey: 'your-anon-key'
};
```

---

## ▶️ Running the App
```bash
# Development server
ng serve

# Production build
ng build

# Run tests
ng test
```

---

## 🧪 Tests

Unit tests are included for all major components, guards, pipes, and services:

- `login.spec.ts`, `register.spec.ts`
- `chat.spec.ts`
- `ahorcado.spec.ts`, `mayor-menor.spec.ts`, `preguntados.spec.ts`, `simon-dice.spec.ts`
- `stats.spec.ts`, `home.spec.ts`, `navbar.spec.ts`
- `auth-guard.spec.ts`, `age-guard.spec.ts`
- `decode-question-pipe.spec.ts`, `format-name-pipe.spec.ts`, `format-time-pipe.spec.ts`
- `modal.spec.ts`, `supabase.spec.ts`
```bash
ng test
```

---

## 👤 Author

**Lisandro Escalada** – [@lisandroescalada](https://github.com/lisandroescalada)
