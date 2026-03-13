# Decrypt_Game
Game to decrypt caesar cipher wor# 🔐 DECRYPT

> *A Caesar cipher word game. Crack the shift. Find the word.*

Decrypt is a browser-based word puzzle game inspired by Wordle, built with a dark CRT/hacker terminal aesthetic. A word is encrypted using a Caesar cipher — your job is to figure out the shift, decode it, and guess the word. You have **3 attempts**.

---

## 🎮 Gameplay

### What is a Caesar Cipher?
A Caesar cipher shifts every letter in a word forward by a fixed number. For example, with a **shift of +3**:

```
P → S
A → D
R → U
T → W
Y → B

PARTY  →  SDUWB
```

To decrypt, you reverse the shift. If `W → T`, the shift is 3 — and `SDUWB` decodes back to `PARTY`.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Caesar Cipher | Word is encrypted with a random shift (2–24) each round |
| 💡 Vowel Clue | One encrypted letter is matched to its decoded vowel — reveal on demand |
| 🔤 A–Z Scratchpad | Click any letter to cross it off as you work through the cipher |
| ⚡ Glitch Animation | Encrypted word glitches on load for the full hacker aesthetic |
| 📺 CRT Effects | Scanlines and vignette give an authentic retro terminal feel |
| 🔄 Shake on Wrong | Input field shakes on an incorrect guess |
| 🏆 Attempt Tracker | 3 attempts shown as colored dots — green for correct, red for wrong |

---

## 🧠 How to Solve (Example)

Say the encrypted word is **SDUWB** and the vowel clue tells you:

```
Encrypted W  →  Decoded A
```

**Step 1:** Count the shift.
`W` is the 23rd letter. `A` is the 1st. Going backwards: 23 → 1 = shift of **22** forward (or 4 backward).

**Step 2:** Apply to every letter.
```
S (19) - 22 = -3 → wraps to P (16) ✓
D (4)  - 22 = -18 → wraps to A (1)  ✓
U (21) - 22 = -1 → wraps to R (18) ✓
W (23) - 22 = 1  → A              ✓
B (2)  - 22 = -20 → wraps to Y (25) ✓
```

**Step 3:** Type **PARTY** and hit ENTER. ✓

Use the scratchpad to cross off letters you've eliminated as you work through it!

---

## 🛠 Tech Stack

- **React** (functional components + hooks)
- **JavaScript** — Caesar cipher logic, glitch animation, game state
- **CSS-in-JS** — all styling via inline styles and keyframe animations
- **No external dependencies** — pure React, no game libraries

---

## 📁 File Structure

```
decrypt-game.jsx     ← Single file, self-contained React component
README.md            ← This file
```

---

## 🚀 Running the Game

Drop `decrypt-game.jsx` into any React project:

```bash
# With Create React App
npx create-react-app decrypt
cd decrypt
# Replace src/App.js with:
# import DecryptGame from './decrypt-game';
# export default function App() { return <DecryptGame />; }
cp decrypt-game.jsx src/decrypt-game.jsx
npm start
```

Or use it directly in a sandbox like [CodeSandbox](https://codesandbox.io) or [StackBlitz](https://stackblitz.com) by importing the file as the root component.

---

## 🗺 Roadmap

- [ ] **Medium Mode** — Caesar cipher, harder shift range, no vowel clue
- [ ] **Hard Mode** — Unknown cipher type (Caesar, Vigenère, substitution) + unknown key
- [ ] **Daily Word** — Same encrypted word for everyone each day (Wordle-style)
- [ ] **Share Results** — Copy shareable result card to clipboard
- [ ] **Word Length Variety** — 4, 5, and 6-letter words
- [ ] **Streak Tracking** — Persistent daily win streak

---

## 👩‍💻 Built by

Lalitha — game design, mechanics, and product decisions.
Claude — implementation partner.

---

*DECRYPT — Crack the code. Find the word.*d
