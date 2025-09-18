// app/page.js
"use client";

import React, { useState, useEffect } from "react";

const DOOR_CREAK_URL = "/door-creak.mp3";   // doit exister dans /public
const HALL_CHIME_URL = "/hall-chimes.mp3";  // idem (optionnel)
const BACKGROUND_MUSIC_URL = "/bg-music.mp3"; // idem (optionnel)

// ---------- Error Boundary (pour afficher l’erreur réelle) ----------
class Boundary extends React.Component {
  constructor(p){ super(p); this.state={err:null}; }
  static getDerivedStateFromError(err){ return {err}; }
  componentDidCatch(err, info){ console.error("UI Error:", err, info); }
  render(){
    if(this.state.err){
      return (
        <div style={{padding:24,color:"#fff",background:"#111"}}>
          <h2 style={{marginTop:0}}>Une erreur est survenue dans cette section</h2>
          <pre style={{whiteSpace:"pre-wrap"}}>{String(this.state.err?.message||this.state.err)}</pre>
          <button onClick={()=>location.reload()}>Recharger la page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Page() {
  const [entered, setEntered] = useState(false);

  return (
    <div style={styles.app}>
      <Boundary>
        {!entered ? (
          <Landing onEnter={() => setEntered(true)} />
        ) : (
          <Hall />
        )}
      </Boundary>
    </div>
  );
}

/* ==================== LANDING ==================== */
function Landing({ onEnter }) {
  const [opened, setOpened] = useState(false);
  const [creak, setCreak] = useState(null);
  const [chime, setChime] = useState(null);
  const [bgm, setBgm] = useState(null);

  useEffect(() => {
    // Sécurise TOUT l’audio
    try {
      const c = new Audio(DOOR_CREAK_URL);
      const h = new Audio(HALL_CHIME_URL);
      const b = new Audio(BACKGROUND_MUSIC_URL);
      c.volume = 0.6;
      h.volume = 0.25; h.loop = false;
      b.volume = 0.18; b.loop = true;
      h.addEventListener("ended", () => { b.play().catch(()=>{}); });
      setCreak(c); setChime(h); setBgm(b);
      return () => { try{h.pause()}catch{}; try{b.pause()}catch{}; };
    } catch (e) {
      console.warn("Init audio error:", e);
    }
  }, []);

  const open = () => {
    if (opened) return;
    setOpened(true);
    // on joue les sons mais on capture toute erreur d’autoplay
    try { creak?.play().catch(()=>{}); } catch {}
    try { chime?.play().catch(()=>{}); } catch {}
    // on passe au hall après l’anim
    setTimeout(() => {
      try { onEnter(); } catch (e) { console.error("Enter error:", e); }
    }, 800);
  };

  return (
    <section aria-label="Accueil — Porte du Labo" style={styles.screen}>
      {/* Fond */}
      <div style={{ ...styles.bg, backgroundImage: "url(/door-wall.jpg)" }} aria-hidden />
      <div style={styles.bgVeil} aria-hidden />

      {/* Texte */}
      <div style={styles.topTextLayer} aria-hidden>
        <h1 style={styles.title}>Le Labo Fantôme — École</h1>
        <p style={styles.subtitle}>Une porte s&apos;entrouvre entre visible et invisible…</p>
        <p style={styles.hint}>Cliquer la porte pour entrer</p>
      </div>

      {/* Porte */}
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
              transition: "transform .8s cubic-bezier(.2,.7,.1,1)",
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

/* ======================= HALL ======================= */
function Hall() {
  const [hallSrc, setHallSrc] = useState("/hall.jpg");

  return (
    <Boundary>
      <section style={styles.hallScreen} aria-label="Hall — Choisir une pièce">
        <img
          src={hallSrc}
          alt=""
          aria-hidden
          onError={() => setHallSrc("/background.png")}
          style={styles.hallBgImg}
        />
        <div style={styles.hallVeil} aria-hidden />

        <div style={styles.hallInner}>
          <div style={styles.hallHeader}>
            <h2 style={styles.hallTitle}>Hall du Labo</h2>
            <p style={styles.hallSub}>Choisis une porte pour continuer</p>
          </div>
          <div style={styles.doorsGrid}>
            <MiniDoor title="Le Labo" subtitle="TCI & enregistrements" icon="🎙️" onClick={()=>alert("Section Labo (OK)")} />
            <MiniDoor title="Salle d'étude" subtitle="Bibliothèque, Livret, Booracle" icon="📚" onClick={()=>alert("Section Étude (OK)")} />
            <MiniDoor title="GhostBox" subtitle="Console en ligne" icon="📻" onClick={()=>alert("Section GhostBox (OK)")} />
          </div>
        </div>
      </section>
    </Boundary>
  );
}

function MiniDoor({ title, subtitle, icon, onClick }) {
  return (
    <button onClick={onClick} style={styles.miniDoorBtn} aria-label={title}>
      <div style={styles.miniDoorBody}>
        <div style={styles.miniDoorTop}><span style={styles.miniDoorIcon}>{icon}</span></div>
        <div style={styles.miniDoorPlate}>{title}</div>
      </div>
      <div style={styles.miniDoorCaption}>{subtitle}</div>
    </button>
  );
}

/* ======================= STYLES & HELPERS ======================= */
function bg(url) {
  return {
    backgroundImage: `url(${url})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
}

const styles = {
  app: { minHeight: "100vh", background: "#0b0f1a", color: "#f6f6f6" },

  // Accueil
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

  // Hall
  hallScreen: { minHeight: "100vh", position: "relative", overflow: "hidden" },
  hallBgImg: {
    position: "absolute", inset: 0, width: "100%", height: "100%",
    objectFit: "cover", objectPosition: "center", zIndex: 0,
  },
  hallVeil: { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(11,15,26,.18), rgba(11,15,26,.55))", zIndex: 0 },
  hallInner: { position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "64px 16px" },
  hallHeader: { textAlign: "center", marginBottom: 24 },
  hallTitle: { fontFamily: "serif", fontSize: 28 },
  hallSub: { opacity: 0.9 },
  doorsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20, marginTop: 24 },

  // Mini portes
  miniDoorBtn: { background: "transparent", border: "none", color: "#fff", cursor: "pointer", textAlign: "center" },
  miniDoorBody: { border: "1px solid rgba(255,255,255,.25)", background: "rgba(0,0,0,.35)", borderRadius: 14, padding: 12, boxShadow: "0 10px 30px rgba(0,0,0,.35)" },
  miniDoorTop: { fontSize: 28, marginBottom: 8 },
  miniDoorIcon: { display: "inline-block" },
  miniDoorPlate: { fontWeight: 700, letterSpacing: .3, padding: "6px 10px", borderRadius: 8, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.2)" },
  miniDoorCaption: { marginTop: 8, opacity: .95 },
};
