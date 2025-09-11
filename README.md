# React Quiz — `useReducer` Demo (Educational)
Demo version - https://zesty-liger-69f6fe.netlify.app/

A small React app that demonstrates **state management with `useReducer`** using a quiz as the example. It includes a **finite-state flow** (`loading → ready → active → finished`), a **countdown timer**, scoring, a **highscore**, and **static data loading** from `public/questions.json` (so it deploys cleanly to Netlify without any server).

> Built for my portfolio to showcase clean `useReducer` patterns and component composition.

---

## ✨ Features

- `useReducer` for predictable state transitions
- Finite-state UI (`loading`, `error`, `ready`, `active`, `finished`)
- Countdown timer per quiz (configurable)
- Points & highscore tracking
- Progress indicator & next button guard (prevents skipping without an answer)
- Static data fetch from `/questions.json` (no backend)

---

## 🧠 Why `useReducer` here?

The quiz has multiple **events** that change state in different ways (start, answer, next, finish, restart, tick). A reducer:

- centralizes **all updates** in one pure function,
- makes transitions explicit and testable,
- avoids tangled `useState` calls spread across components.

**Action types used:**

- `dataReceived`, `dataFailed`
- `start`
- `newAnswer`
- `nextQuestion`
- `finish`
- `restart`
- `tick`

---

## 🗂 Project Structure

```
react-quiz/
├─ public/
│  ├─ index.html
│  ├─ questions.json          ← static quiz data (served by Netlify)
│  └─ favicon.ico / logos...
├─ src/
│  ├─ components/
│  │  ├─ App.js               ← reducer + app shell
│  │  ├─ Header.js
│  │  ├─ Main.js
│  │  ├─ Loader.js
│  │  ├─ Error.js
│  │  ├─ StartScreen.js
│  │  ├─ Question.js
│  │  ├─ Options.js
│  │  ├─ NextButton.js
│  │  ├─ Progress.js
│  │  ├─ FinishScreen.js
│  │  ├─ Timer.js
│  │  └─ Footer.js
│  ├─ index.css
│  └─ index.js
├─ package.json
└─ README.md
```

---

## 🚀 Getting Started (Local)

**Requirements**

- Node.js ≥ 18
- npm (or yarn)

**Install & run**

```bash
npm install
npm start
```

**Build**

```bash
npm run build
```

This project uses **Create React App** (`react-scripts`).

---

## 📦 Data Loading (Static, Serverless)

Questions are loaded from a static JSON file in **`public/questions.json`**:

```json
{
  "questions": [
    {
      "question": "Which is the most popular JavaScript framework?",
      "options": ["Angular", "React", "Svelte", "Vue"],
      "correctOption": 1,
      "points": 10
    }
    // ...
  ]
}
```

The app fetches it at runtime:

```js
useEffect(() => {
  fetch('/questions.json')
    .then((res) => res.json())
    .then((data) => dispatch({ type: 'dataReceived', payload: data.questions }))
    .catch(() => dispatch({ type: 'dataFailed' }));
}, []);
```

> Because the file sits in `/public`, Netlify (or any static host) serves it directly. No API/server needed.

---

## 🧩 Core Reducer (excerpt)

```js
const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  status: 'loading', // 'loading' | 'error' | 'ready' | 'active' | 'finished'
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return { ...state, questions: action.payload, status: 'ready' };

    case 'dataFailed':
      return { ...state, status: 'error' };

    case 'start':
      return {
        ...state,
        status: 'active',
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };

    case 'newAnswer': {
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    }

    case 'nextQuestion':
      return { ...state, index: state.index + 1, answer: null };

    case 'finish':
      return {
        ...state,
        status: 'finished',
        highscore: Math.max(state.points, state.highscore),
      };

    case 'restart':
      return {
        ...initialState,
        questions: state.questions,
        highscore: state.highscore,
        status: 'ready',
      };

    case 'tick': {
      const next = state.secondsRemaining - 1;
      return {
        ...state,
        secondsRemaining: next,
        status: next <= 0 ? 'finished' : state.status,
      };
    }

    default:
      throw new Error('Action is unknown');
  }
}
```

---

## 📊 Derived Values

Inside `App.js`:

```js
const numQuestions = questions.length;
const maxPoints = questions.reduce((acc, q) => acc + q.points, 0);
```

These are derived from `state.questions` and passed to UI components (`Progress`, `FinishScreen`, etc.).

---

## 🌐 Deploying to Netlify

1. Push the repo to GitHub.
2. In Netlify, **New site → Import from Git**.
3. **Build command:** `npm run build`
4. **Publish directory:** `build`
5. Ensure `public/questions.json` exists (Netlify will serve it at `/questions.json`).

> No React Router here, so no special SPA redirects are required.

---

## 🛠 Tech Stack

- React 19
- Create React App (`react-scripts`)
- Static JSON fetch from `/public`

---

## 📄 License

MIT — free to use and adapt.

---

## 👤 Author

**Dmytro Zuiev**
Portfolio: _to be added_
GitHub: [zdvman](https://github.com/zdvman)

> This project is part of my learning path and a portfolio example demonstrating clean `useReducer` usage in React.
