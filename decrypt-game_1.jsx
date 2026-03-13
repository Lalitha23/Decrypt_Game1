import { useState, useEffect, useCallback } from "react";

const WORDS = [
  "party", "brave", "craft", "dream", "earth", "fable", "grace", "heart",
  "ivory", "joker", "knife", "lemon", "magic", "noble", "ocean", "piano",
  "queen", "radar", "stone", "tiger", "ultra", "vapor", "waltz", "xenon",
  "yacht", "zebra", "amber", "blaze", "chest", "dance", "eagle", "flame",
  "giant", "haven", "inlet", "jewel", "karma", "light", "mango", "night",
  "orbit", "pearl", "quest", "river", "solar", "tower", "unity", "vixen",
  "worth", "zonal"
];

const MAX_ATTEMPTS = 3;
const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");
const VOWELS = "aeiou";
const GLITCH_CHARS = "!@#$%^&*<>?/\\|~`";

function caesarEncrypt(word, shift) {
  return word.split("").map(c => {
    const code = c.charCodeAt(0);
    if (code >= 97 && code <= 122)
      return String.fromCharCode(((code - 97 + shift) % 26) + 97);
    return c;
  }).join("");
}

function getRandomShift() {
  return Math.floor(Math.random() * 23) + 2;
}

function pickWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function getVowelRevealIndex(word) {
  const indices = [...word].map((c, i) => VOWELS.includes(c) ? i : -1).filter(i => i !== -1);
  if (!indices.length) return -1;
  return indices[Math.floor(Math.random() * indices.length)];
}

function glitchText(text, intensity = 0.3) {
  return text.split("").map(c =>
    Math.random() < intensity ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)] : c
  ).join("");
}

export default function DecryptGame() {
  const [word, setWord] = useState("");
  const [shift, setShift] = useState(0);
  const [encrypted, setEncrypted] = useState("");
  const [revealIdx, setRevealIdx] = useState(-1);
  const [input, setInput] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [gameState, setGameState] = useState("playing");
  const [shakeInput, setShakeInput] = useState(false);
  const [glitchDisplay, setGlitchDisplay] = useState("");
  const [scanline, setScanline] = useState(0);
  const [crossedLetters, setCrossedLetters] = useState(new Set());
  const [clueRevealed, setClueRevealed] = useState(false);

  const initGame = useCallback(() => {
    const w = pickWord();
    const s = getRandomShift();
    const e = caesarEncrypt(w, s);
    const ri = getVowelRevealIndex(w);
    setWord(w);
    setShift(s);
    setEncrypted(e);
    setRevealIdx(ri);
    setGlitchDisplay(e);
    setInput("");
    setAttempts([]);
    setGameState("playing");
    setCrossedLetters(new Set());
    setClueRevealed(false);
  }, []);

  useEffect(() => { initGame(); }, [initGame]);

  useEffect(() => {
    if (gameState !== "playing" || !encrypted) return;
    let count = 0;
    const interval = setInterval(() => {
      count++;
      if (count < 10) setGlitchDisplay(glitchText(encrypted, 0.5 - count * 0.04));
      else { setGlitchDisplay(encrypted); clearInterval(interval); }
    }, 55);
    return () => clearInterval(interval);
  }, [encrypted, gameState]);

  useEffect(() => {
    const interval = setInterval(() => setScanline(s => (s + 1) % 100), 30);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    const guess = input.trim().toLowerCase();
    if (!guess || guess.length !== word.length) { triggerShake(); return; }
    const isCorrect = guess === word;
    const newAttempts = [...attempts, { guess, correct: isCorrect }];
    setAttempts(newAttempts);
    setInput("");
    if (isCorrect) setGameState("won");
    else if (newAttempts.length >= MAX_ATTEMPTS) setGameState("lost");
    else triggerShake();
  };

  const triggerShake = () => {
    setShakeInput(true);
    setTimeout(() => setShakeInput(false), 500);
  };

  const toggleLetter = (letter) => {
    if (gameState !== "playing") return;
    setCrossedLetters(prev => {
      const next = new Set(prev);
      next.has(letter) ? next.delete(letter) : next.add(letter);
      return next;
    });
  };

  const attemptsLeft = MAX_ATTEMPTS - attempts.length;
  const encryptedVowel = revealIdx !== -1 ? encrypted[revealIdx]?.toUpperCase() : null;
  const decodedVowel = revealIdx !== -1 ? word[revealIdx]?.toUpperCase() : null;

  return (
    <div style={{
      minHeight: "100vh", background: "#060a06",
      fontFamily: "'Courier New', Courier, monospace", color: "#00ff41",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "20px",
      position: "relative", overflow: "hidden",
    }}>
      {/* CRT effects */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 100,
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)" }} />
      <div style={{ position: "fixed", left: 0, right: 0, height: "2px", zIndex: 101,
        top: `${scanline}%`, background: "rgba(0,255,65,0.05)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 99,
        background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.75) 100%)" }} />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "26px" }}>
        <div style={{ fontSize: "10px", letterSpacing: "6px", color: "#00cc44", marginBottom: "5px" }}>
          ▸ EASY MODE · CAESAR CIPHER ◂
        </div>
        <h1 style={{
          fontSize: "clamp(32px, 8vw, 56px)", fontWeight: "bold",
          letterSpacing: "12px", margin: 0, color: "#00ff41",
          textShadow: "0 0 20px #00ff41, 0 0 50px #00aa2a, 0 0 100px #003310",
          animation: "flicker 5s infinite",
        }}>DECRYPT</h1>
        <div style={{ fontSize: "10px", letterSpacing: "4px", color: "#00aa33", marginTop: "4px" }}>
          CRACK THE CODE · FIND THE WORD
        </div>
      </div>

      {/* Main terminal */}
      <div style={{
        width: "100%", maxWidth: "500px",
        border: "1px solid #00ff4120", borderRadius: "4px",
        background: "rgba(0,14,0,0.9)",
        boxShadow: "0 0 50px #00ff410e, inset 0 0 60px rgba(0,0,0,0.4)",
        overflow: "hidden",
      }}>
        {/* Title bar */}
        <div style={{ background: "#001000", borderBottom: "1px solid #00ff4133",
          padding: "8px 16px", display: "flex", alignItems: "center", gap: "8px" }}>
          {["#ff5f56","#ffbd2e","#27c93f"].map((c,i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
          ))}
          <span style={{ marginLeft: "8px", fontSize: "10px", color: "#00cc44", letterSpacing: "2px" }}>
            decrypt_v1.0 — easy.exe
          </span>
        </div>

        <div style={{ padding: "22px 20px" }}>

          {/* CLUE - hidden until clicked */}
          {revealIdx !== -1 && gameState === "playing" && (
            <div style={{ marginBottom: "18px" }}>
              {!clueRevealed ? (
                <button onClick={() => setClueRevealed(true)} style={{
                  width: "100%", padding: "12px 16px",
                  background: "transparent", border: "1px dashed #00ffcc66",
                  borderRadius: "4px", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                  fontFamily: "'Courier New', monospace", transition: "all 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#00ffccaa"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#00ffcc66"}
                >
                  <span style={{ fontSize: "14px" }}>⚡</span>
                  <span style={{ fontSize: "10px", color: "#00ffcccc", letterSpacing: "3px" }}>
                    REVEAL VOWEL CLUE
                  </span>
                  <span style={{ fontSize: "14px" }}>⚡</span>
                </button>
              ) : (
                <div style={{
                  padding: "12px 16px",
                  background: "rgba(0,255,200,0.04)", border: "1px solid #00ffcc28",
                  borderRadius: "4px", display: "flex", alignItems: "center", gap: "14px",
                  animation: "fadeIn 0.3s ease",
                }}>
                  <span style={{ fontSize: "20px", flexShrink: 0 }}>⚡</span>
                  <div>
                    <div style={{ fontSize: "9px", color: "#00ffccaa", letterSpacing: "3px", marginBottom: "5px" }}>
                      VOWEL CLUE
                    </div>
                    <div style={{ fontSize: "13px", color: "#00ffccaa", letterSpacing: "0.5px" }}>
                      Encrypted{" "}
                      <span style={{
                        fontWeight: "bold", fontSize: "16px", color: "#ddd",
                        border: "1px solid #ffffff33", padding: "2px 8px", borderRadius: "3px",
                      }}>{encryptedVowel}</span>
                      {"  →  "}
                      <span style={{
                        fontWeight: "bold", fontSize: "20px", color: "#00ffcc",
                        textShadow: "0 0 14px #00ffcc88",
                        border: "1px solid #00ffcc44", padding: "2px 10px", borderRadius: "3px",
                      }}>{decodedVowel}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ENCRYPTED WORD */}
          <div style={{ marginBottom: "18px", textAlign: "center" }}>
            <div style={{ fontSize: "9px", color: "#00aa33", letterSpacing: "3px", marginBottom: "10px" }}>
              ▸ ENCRYPTED SEQUENCE
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "7px" }}>
              {(gameState === "lost" ? word : glitchDisplay).toUpperCase().split("").map((char, i) => (
                <div key={i} style={{
                  width: "50px", height: "58px",
                  border: `2px solid ${gameState === "lost" ? "#ff4444aa" : "#00ff41aa"}`,
                  borderRadius: "4px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: gameState === "lost" ? "rgba(255,68,68,0.12)" : "rgba(0,255,65,0.10)",
                  boxShadow: gameState === "lost" ? "0 0 10px #ff444422" : "0 0 10px #00ff4122",
                }}>
                  <span style={{
                    fontSize: "26px", fontWeight: "bold",
                    color: gameState === "lost" ? "#ff6666" : "#ccffcc",
                    textShadow: gameState === "lost" ? "0 0 12px #ff4444" : "0 0 12px #00ff41",
                  }}>{char}</span>
                </div>
              ))}
            </div>
            {gameState === "lost" && (
              <div style={{ fontSize: "10px", color: "#ff5555aa", letterSpacing: "2px", marginTop: "8px" }}>
                WORD REVEALED · SHIFT WAS +{shift}
              </div>
            )}
            {gameState === "won" && (
              <div style={{ fontSize: "10px", color: "#00ff41aa", letterSpacing: "2px", marginTop: "8px", animation: "pulse 1.2s infinite" }}>
                ✓ DECRYPTED · SHIFT WAS +{shift}
              </div>
            )}
          </div>

          {/* ATTEMPTS TRACKER */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: "14px", padding: "8px 14px",
            background: "rgba(0,255,65,0.04)", border: "1px solid #00ff4133", borderRadius: "3px",
            fontSize: "10px", letterSpacing: "2px",
          }}>
            <span style={{ color: attemptsLeft === 1 ? "#ff7755" : "#00cc44" }}>
              ATTEMPTS LEFT: {attemptsLeft}/{MAX_ATTEMPTS}
            </span>
            <div style={{ display: "flex", gap: "6px" }}>
              {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                <div key={i} style={{
                  width: "11px", height: "11px", borderRadius: "50%",
                  background: i < attempts.length
                    ? (attempts[i].correct ? "#00ff41" : "#ff4444")
                    : "#00ff4118",
                  boxShadow: i < attempts.length && attempts[i].correct ? "0 0 6px #00ff41" : "none",
                  transition: "all 0.3s",
                }} />
              ))}
            </div>
          </div>

          {/* ATTEMPT HISTORY */}
          {attempts.length > 0 && (
            <div style={{ marginBottom: "14px" }}>
              {attempts.map((a, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "5px 0", borderBottom: "1px solid #00ff4133", fontSize: "13px",
                }}>
                  <span style={{ color: "#00aa33", minWidth: "20px" }}>{i + 1}.</span>
                  <span style={{
                    letterSpacing: "5px", flex: 1,
                    color: a.correct ? "#00ff41" : "#ff4444",
                    textShadow: a.correct ? "0 0 8px #00ff41" : "0 0 8px #ff4444",
                  }}>{a.guess.toUpperCase()}</span>
                  <span style={{ fontSize: "15px" }}>{a.correct ? "✓" : "✗"}</span>
                </div>
              ))}
            </div>
          )}

          {/* WIN BANNER */}
          {gameState === "won" && (
            <div style={{
              marginBottom: "14px", padding: "14px", textAlign: "center",
              background: "rgba(0,255,65,0.08)", border: "1px solid #00ff4155", borderRadius: "3px",
            }}>
              <div style={{ fontSize: "14px", color: "#00ff41", letterSpacing: "4px", marginBottom: "4px" }}>
                ACCESS GRANTED
              </div>
              <div style={{ fontSize: "11px", color: "#00cc44" }}>
                Solved in {attempts.length} attempt{attempts.length !== 1 ? "s" : ""}
              </div>
            </div>
          )}

          {/* INPUT */}
          {gameState === "playing" && (
            <div style={{
              display: "flex", gap: "8px", marginBottom: "18px",
              animation: shakeInput ? "shake 0.4s ease" : "none",
            }}>
              <div style={{ position: "relative", flex: 1 }}>
                <span style={{
                  position: "absolute", left: "12px", top: "50%",
                  transform: "translateY(-50%)", color: "#00aa33", fontSize: "14px",
                }}>▸</span>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value.toLowerCase().replace(/[^a-z]/g, ""))}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  maxLength={word.length}
                  placeholder={`${word.length}-letter word...`}
                  autoFocus
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: "rgba(0,255,65,0.06)", border: "1px solid #00ff4155",
                    borderRadius: "3px", padding: "12px 12px 12px 30px",
                    color: "#00ff41", fontSize: "16px", letterSpacing: "5px",
                    outline: "none", fontFamily: "'Courier New', monospace", caretColor: "#00ff41",
                  }}
                />
              </div>
              <button onClick={handleSubmit} style={{
                background: "transparent", border: "1px solid #00ff4135",
                color: "#00ff41", padding: "12px 16px", cursor: "pointer",
                fontSize: "11px", letterSpacing: "2px", borderRadius: "3px",
                fontFamily: "'Courier New', monospace", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.target.style.background = "rgba(0,255,65,0.09)"; }}
                onMouseLeave={e => { e.target.style.background = "transparent"; }}
              >ENTER</button>
            </div>
          )}

          {/* A–Z SCRATCHPAD */}
          <div style={{
            padding: "14px 14px 12px",
            background: "rgba(0,255,65,0.03)",
            border: "1px solid #00ff4133",
            borderRadius: "4px",
          }}>
            <div style={{ fontSize: "9px", color: "#00aa33", letterSpacing: "3px", marginBottom: "10px" }}>
              ▸ SCRATCHPAD · CLICK TO CROSS OFF
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {ALPHABET.map(letter => {
                const crossed = crossedLetters.has(letter);
                return (
                  <button key={letter} onClick={() => toggleLetter(letter)} style={{
                    width: "28px", height: "28px",
                    background: crossed ? "rgba(255,68,68,0.12)" : "rgba(0,255,65,0.08)",
                    border: `1px solid ${crossed ? "#ff444466" : "#00ff4155"}`,
                    borderRadius: "3px",
                    color: crossed ? "#ff444466" : "#00ff41",
                    fontSize: "12px", fontWeight: "bold",
                    cursor: gameState === "playing" ? "pointer" : "default",
                    fontFamily: "'Courier New', monospace",
                    textDecoration: crossed ? "line-through" : "none",
                    transition: "all 0.12s",
                  }}>
                    {letter.toUpperCase()}
                  </button>
                );
              })}
            </div>
            {crossedLetters.size > 0 && gameState === "playing" && (
              <button onClick={() => setCrossedLetters(new Set())} style={{
                marginTop: "9px", background: "transparent", border: "none",
                color: "#ff666688", fontSize: "10px", letterSpacing: "2px",
                cursor: "pointer", fontFamily: "'Courier New', monospace", padding: 0,
              }}>↺ RESET SCRATCHPAD</button>
            )}
          </div>

          {/* NEW GAME */}
          {(gameState === "won" || gameState === "lost") && (
            <button onClick={initGame} style={{
              width: "100%", marginTop: "14px",
              background: "rgba(0,255,65,0.06)", border: "1px solid #00ff4140",
              color: "#00ff41", padding: "13px", cursor: "pointer",
              fontSize: "12px", letterSpacing: "4px", borderRadius: "3px",
              fontFamily: "'Courier New', monospace",
              textShadow: "0 0 10px #00ff41", transition: "all 0.2s",
            }}>▸ NEW GAME</button>
          )}
        </div>
      </div>

      {/* How to play */}
      <div style={{
        marginTop: "18px", maxWidth: "500px", width: "100%",
        padding: "11px 16px", border: "1px solid #00ff4133", borderRadius: "3px",
        fontSize: "11px", color: "#00bb44", letterSpacing: "1px", lineHeight: "1.8",
      }}>
        <span style={{ color: "#00ff41", letterSpacing: "3px" }}>▸ HOW TO PLAY  </span>
        The word is Caesar-shifted. Try to crack it yourself — or reveal the vowel clue if you're stuck.
        Cross off letters in the scratchpad as you work it out. {MAX_ATTEMPTS} attempts only.
      </div>

      <style>{`
        @keyframes flicker {
          0%,94%,100%{opacity:1} 95%{opacity:0.75} 96%{opacity:1} 97.5%{opacity:0.6} 98%{opacity:1}
        }
        @keyframes shake {
          0%,100%{transform:translateX(0)} 20%{transform:translateX(-7px)}
          40%{transform:translateX(7px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)}
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder { color: #00662299; }
        input:focus { border-color: #00ff4188 !important; box-shadow: 0 0 12px #00ff4133; }
      `}</style>
    </div>
  );
}