"use client";

import React, { useState, useMemo } from "react";

const DOOR_CREAK_URL = "/door-creak.mp3";
const HALL_CHIME_URL = "/hall-chimes.mp3";
const BACKGROUND_MUSIC_URL = "/bg-music.mp3";
const BOORACLE_URL = "https://booracle.example.com"; // remplace quand prêt

export default function Site() {
  const [entered, setEntered] = useState(false);
  const [room, setRoom] = useState(null); // "labo" | "etude" | "ghostbox" | null
  const [muted, setMuted] = useState(false);

  const [creak, setCreak] = useState(null);
  const [chime, setChime] = useState(null);
  const [bgm, setBgm] = useState(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const c = new Audio(DOOR_CREAK_URL);
    const h = new Audio(HALL_CHIME_URL);
    const b = new Audio(BACKGROUND_MUSIC_URL);
    c.volume = 0.6;
    h.volume = 0.25; h.loop = false;
    b.volume = 0.18; b.loop = true;
    h.addEventListener("ended", () => { if (!muted) b.play().catch(()=>{}); });
    setCreak(c); setChime(h); setBgm(b);
    return () => { try{h.pause()}catch{}; try{b.pause()}catch{}; };
  }, [muted]);

  const handleEnter = () => {
    setEntered(true);
    if (!muted && creak) creak.play().catch(()=>{});
    if (!muted && chime) chime.play().catch(()=>{});
  };

  const toggleMute = () => {
    setMuted(m => {
      const next = !m;
      try { if (next) { chime?.pause(); bgm?.pause(); } } catch {}
      return next;
    });
  };

  return (
    <div style={styles.app}>
      {!entered ? <Landing onEnter={handleEnter} /> : <Hall room={room} setRoom={setRoom} />}

      <button
        onClick={toggleMute}
        style={styles.muteFloating}
        aria-label={muted ? "Activer le son" : "Couper le son"}
      >
        {muted ? "🔇" : "🔊"}
      </button>
    </div>
  );
}

/* ==================== LANDING (accueil) ==================== */
function Landing({ onEnter }) {
  const [opened, setOpened] = useState(false);

  const open = () => {
    if (opened) return;
    setOpened(true);
    setTimeout(() => onEnter(), 900);
  };

  return (
    <section aria-label="Accueil — Porte du Labo" style={styles.screen}>
      {/* Fond mur en pierre */}
      <div style={{ ...styles.bg, backgroundImage: "url(/door-wall.jpg)" }} aria-hidden />
      <div style={styles.bgVeil} aria-hidden />

      {/* Texte — devant */}
      <div style={styles.topTextLayer} aria-hidden>
        <h1 style={styles.title}>Le Labo Fantôme École</h1>
        <p style={styles.subtitle}>Une porte s&apos;entrouvre entre visible et invisible…</p>
        <p style={styles.hint}>Cliquer la porte pour entrer</p>
      </div>

      {/* Porte centrée */}
      <div style={styles.doorLayer}>
        <div style={{ transform: "translateY(5vh)" }}>
          <img
            src="/door-sprite.png"
            alt="Porte ancienne"
            onClick={open}
            onKeyDown={(e) => e.key === "Enter" && open()}
            role="button"
            tabIndex={0}
            style={{
              width: "clamp(220px, 34vw, 400px)",
              height: "auto",
              transformOrigin: "left center",
              transition: "transform .9s cubic-bezier(.2,.7,.1,1)",
              transform: opened
                ? "perspective(1100px) rotateY(-72deg)"
                : "perspective(1100px) rotateY(0deg)",
              cursor: "pointer",
              filter: "drop-shadow(0 18px 40px rgba(0,0,0,.45))",
            }}
          />
        </div>
      </div>
    </section>
  );
}

/* ======================= HALL + autres rooms (inchangés) ======================= */
// ... ton code Hall / Rooms reste identique

/* ======================= STYLES ======================= */
const styles = {
  app: { minHeight: "100vh", background: "#0b0f1a", color: "#f6f6f6" },
  screen: { minHeight: "100vh", position: "relative", overflow: "hidden" },
  bg: { position: "absolute", inset: 0, backgroundSize: "cover", backgroundPosition: "center" },
  bgVeil: { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(11,15,26,.20), rgba(11,15,26,.55))" },

  topTextLayer: {
    position: "fixed", top: 0, left: 0, right: 0,
    display: "grid", placeItems: "center",
    paddingTop: "6vh",
    textAlign: "center",
    pointerEvents: "none",
    zIndex: 3,
  },
  title: { fontSize: 28, margin: 0, textShadow: "0 1px 0 #000" },
  subtitle: { opacity: 0.95, margin: "6px 0 10px", maxWidth: 720 },
  hint: {
    display: "inline-block",
    fontSize: 16, color: "#f7f7f7",
    background: "rgba(0,0,0,.45)", border: "1px solid rgba(255,255,255,.25)",
    borderRadius: 10, padding: "8px 12px", textShadow: "0 1px 0 rgba(0,0,0,.5)",
  },

  doorLayer: {
    position: "fixed", inset: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 2, pointerEvents: "auto",
  },

  muteFloating: {
    position: "fixed", right: 14, bottom: 14,
    zIndex: 10, width: 44, height: 44,
    borderRadius: 12, background: "rgba(255,255,255,.1)",
    color: "#fff", border: "1px solid rgba(255,255,255,.25)",
    cursor: "pointer", boxShadow: "0 6px 18px rgba(0,0,0,.35)",
    fontSize: 22,
  },
};
