"use client";

import React, { useState, useMemo } from "react";

/* ——— Réglages audio (facultatif) ——— */
const DOOR_CREAK_URL = "/door-creak.mp3";
const HALL_CHIME_URL = "/hall-chimes.mp3";
const BACKGROUND_MUSIC_URL = "/bg-music.mp3";
const BOORACLE_URL = "https://booracle.example.com"; // remplace quand prêt

export default function Site() {
  const [entered, setEntered] = useState(false);
  const [room, setRoom] = useState(null); // "labo" | "etude" | "ghostbox" | null
  const [muted, setMuted] = useState(false);

  // Audio simple
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
      {!entered ? (
        <Landing onEnter={handleEnter} />
      ) : (
        <Hall room={room} setRoom={setRoom} />
      )}

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

/* =========================
   LANDING — Porte vraiment centrée
   ========================= */
function Landing({ onEnter }) {
  const [opened, setOpened] = useState(false);

  const open = () => {
    if (opened) return;
    setOpened(true);
    setTimeout(() => onEnter(), 900);
  };

  return (
    <section aria-label="Accueil — Porte du Labo" style={styles.screen}>
      {/* Mur en pierre */}
      <div style={{ ...styles.bg, backgroundImage: "url(/door-wall.jpg)" }} aria-hidden />
      <div style={styles.bgVeil} aria-hidden />

      {/* TEXTE — couche fixe au-dessus, ne capte pas les clics */}
      <div style={styles.topTextLayer} aria-hidden>
        <h1 style={styles.title}>Le Labo Fantôme — École</h1>
        <p style={styles.subtitle}>Une porte s&apos;entrouvre entre visible et invisible…</p>
        <p style={styles.hint}>Cliquer la porte pour entrer</p>
      </div>

      {/* PORTE — couche FIXE centrée (flex). Clics actifs. */}
      <div style={styles.doorLayer}>
        <img
          src="/door-sprite.png"
          alt="Porte ancienne"
          onClick={open}
          onKeyDown={(e) => e.key === "Enter" && open()}
          role="button"
          tabIndex={0}
          style={{
            width: "clamp(200px, 30vw, 360px)", // ← petite et toujours visible
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
    </section>
  );
}

/* =========================
   Hall + pièces
   ========================= */
function Hall({ room, setRoom }) {
  if (room === "labo") return <RoomLabo onBack={() => setRoom(null)} />;
  if (room === "etude") return <RoomEtude onBack={() => setRoom(null)} />;
  if (room === "ghostbox") return <RoomGhostBox onBack={() => setRoom(null)} />;

  return (
    <section style={{ ...styles.hall, ...bg("/hall.jpg") }} aria-label="Hall — Choisir une pièce">
      <div style={styles.hallHeader}>
        <h2 style={styles.hallTitle}>Hall du Labo</h2>
        <p style={styles.hallSub}>Choisis une porte pour continuer</p>
      </div>
      <div style={styles.doorsGrid}>
        <MiniDoor title="Le Labo" subtitle="TCI & enregistrements" icon="🎙️" onClick={() => setRoom("labo")} />
        <MiniDoor title="Salle d'étude" subtitle="Bibliothèque, Livret, Booracle" icon="📚" onClick={() => setRoom("etude")} />
        <MiniDoor title="GhostBox" subtitle="Console en ligne" icon="📻" onClick={() => setRoom("ghostbox")} />
      </div>
    </section>
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

function RoomLabo({ onBack }) {
  return (
    <div style={{ ...styles.roomSection, ...bg("/lab.jpg") }}>
      <div style={styles.room}>
        <RoomHeader title="Le Labo" subtitle="Réception — Réflexion — Transmission" onBack={onBack} />
        <div style={styles.roomContent}>
          <Card>
            <h3 style={styles.cardTitle}>Protocole d&apos;enregistrement (démo)</h3>
            <ol style={styles.list}>
              <li>Préparer l&apos;espace : silence, intention, 10–15 min.</li>
              <li>Matériel : micro + casque ; noter la date/heure.</li>
              <li>Enregistrer ; marquer les timecodes notables.</li>
              <li>À l&apos;écoute : distinguer artefacts / voix / symboles.</li>
              <li>Consigner dans le carnet de labo.</li>
            </ol>
          </Card>
          <Card>
            <h3 style={styles.cardTitle}>Carnet de labo</h3>
            <NotePad storageKey="labo_note" placeholder="Hypothèses, timecodes, cartes Booracle…" />
          </Card>
        </div>
      </div>
    </div>
  );
}

function RoomEtude({ onBack }) {
  return (
    <div style={{ ...styles.roomSection, ...bg("/library.jpg") }}>
      <div style={styles.room}>
        <RoomHeader title="Salle d&apos;étude" subtitle="Bibliothèque — Livret — Booracle" onBack={onBack} />
        <div style={styles.roomContent}>
          <Card>
            <h3 style={styles.cardTitle}>Livret d&apos;étude</h3>
            <p style={styles.p}>Ton livret (PDF/flipbook) pourra être lié ici.</p>
            <button style={styles.primaryBtn} onClick={() => alert("Ajoute l'URL du livret ici quand prêt.")}>Ouvrir le livret</button>
          </Card>
          <Card>
            <h3 style={styles.cardTitle}>Booracle en ligne</h3>
            <div style={styles.iframeWrap}><iframe title="Booracle" src={BOORACLE_URL} style={styles.iframe} /></div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function RoomGhostBox({ onBack }) {
  return (
    <div style={{ ...styles.roomSection, ...bg("/ghostbox.jpg") }}>
      <div style={styles.room}>
        <RoomHeader title="GhostBox" subtitle="Console en ligne (bientôt)" onBack={onBack} />
        <div style={styles.roomContent}>
          <Card>
            <h3 style={styles.cardTitle}>Intégration prochaine</h3>
            <p style={styles.p}>On branchera l&apos;URL/flux de ta GhostBox ici.</p>
            <button style={styles.secondaryBtn} onClick={() => alert("Prévoir l'URL de la GhostBox.")}>Préparer l&apos;intégration</button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function RoomHeader({ title, subtitle, onBack }) {
  return (
    <div style={styles.roomHeader}>
      <button onClick={onBack} style={styles.backBtn} aria-label="Retour">← Retour</button>
      <div>
        <h3 style={styles.roomTitle}>{title}</h3>
        <p style={styles.roomSub}>{subtitle}</p>
      </div>
    </div>
  );
}

function Card({ children }) { return <div style={styles.card}>{children}</div>; }

function NotePad({ storageKey, placeholder }) {
  const initial = useMemo(() =>
    (typeof window !== "undefined" ? localStorage.getItem(storageKey) || "" : "")
  , [storageKey]);
  const [v, setV] = useState(initial);
  const [saved, setSaved] = useState(false);
  return (
    <div>
      <textarea value={v} onChange={(e)=>{setV(e.target.value); setSaved(false);}} placeholder={placeholder} style={styles.textarea}/>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button style={styles.primaryBtn} onClick={()=>{localStorage.setItem(storageKey, v); setSaved(true);}}>Enregistrer</button>
        <button style={styles.secondaryBtn} onClick={()=>{const s = localStorage.getItem(storageKey)||""; setV(s); setSaved(false);}}>Recharger</button>
      </div>
      {saved && <p style={styles.saved}>Enregistré ✓</p>}
    </div>
  );
}

/* ========== STYLES & HELPERS ========== */

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

  /* Plein écran */
  screen: { minHeight: "100vh", position: "relative", overflow: "hidden" },

  /* Fond pierre */
  bg: { position: "absolute", inset: 0, backgroundSize: "cover", backgroundPosition: "center" },
  bgVeil: { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(11,15,26,.20), rgba(11,15,26,.55))" },

  /* Couche texte fixe — devant, ne bloque pas les clics */
  topTextLayer: {
    position: "fixed", top: 0, left: 0, right: 0,
    display: "grid", placeItems: "center",
    paddingTop: "6vh",
    textAlign: "center",
    pointerEvents: "none", // les clics passent à la porte
    zIndex: 3,
  },
  title: { fontFamily: "serif", fontSize: 28, margin: 0, textShadow: "0 1px 0 #000" },
  subtitle: { opacity: 0.95, margin: "6px 0 10px", maxWidth: 720 },
  hint: {
    display: "inline-block",
    fontSize: 16, color: "#f7f7f7",
    background: "rgba(0,0,0,.45)", border: "1px solid rgba(255,255,255,.25)",
    borderRadius: 10, padding: "8px 12px", textShadow: "0 1px 0 rgba(0,0,0,.5)",
  },

  /* Couche PORTE — fixe, centrée via FLEX */
  doorLayer: {
    position: "fixed", inset: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 2, pointerEvents: "auto",
  },

  /* Hall, cards… */
  hall: { minHeight: "100vh", padding: "64px 16px", maxWidth: 1200, margin: "0 auto" },
  hallHeader: { textAlign: "center", marginBottom: 24 },
  hallTitle: { fontFamily: "serif", fontSize: 28 },
  hallSub: { opacity: 0.9 },
  doorsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20, marginTop: 24 },

  miniDoorBtn: { background: "transparent", border: "none", textAlign: "center", cursor: "pointer" },
  miniDoorBody: { position: "relative", height: 240, borderRadius: 12, border: "1px solid rgba(255,255,255,.15)", background: "linear-gradient(180deg, rgba(59,45,31,.9) 0%, rgba(46,36,25,.9) 40%, rgba(37,29,20,.9) 100%), repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 22px)", boxShadow: "inset 0 0 0 1px rgba(0,0,0,.8), 0 20px 50px rgba(0,0,0,.4)" },
  miniDoorTop: { position: "absolute", top: 12, left: 0, right: 0, display: "grid", placeItems: "center" },
  miniDoorIcon: { fontSize: 28 },
  miniDoorPlate: { position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", padding: "4px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,.25)", background: "rgba(0,0,0,.35)", fontFamily: "serif", letterSpacing: 1 },
  miniDoorCaption: { marginTop: 10, opacity: 0.95 },

  roomSection: { position: "relative", minHeight: "100vh", padding: "32px 16px" },
  room: { marginTop: 16, maxWidth: 1200, marginLeft: "auto", marginRight: "auto" },
  roomHeader: { display: "flex", alignItems: "center", gap: 12, marginBottom: 16 },
  backBtn: { background: "rgba(0,0,0,.35)", border: "1px solid rgba(255,255,255,.3)", color: "#fff", padding: "8px 12px", borderRadius: 10, cursor: "pointer" },
  roomTitle: { fontFamily: "serif", fontSize: 24 },
  roomSub: { opacity: 0.95 },
  roomContent: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 },

  card: { border: "1px solid rgba(255,255,255,.25)", background: "rgba(0,0,0,.35)", borderRadius: 14, padding: 16, boxShadow: "0 10px 30px rgba(0,0,0,.35)" },
  cardTitle: { fontFamily: "serif", fontSize: 18, margin: "0 0 8px" },
  p: { opacity: 0.95, lineHeight: 1.6 },
  list: { margin: 0, paddingLeft: 18, lineHeight: 1.6 },
  textarea: { width: "100%", minHeight: 140, background: "rgba(0,0,0,.35)", color: "#fff", border: "1px solid rgba(255,255,255,.25)", borderRadius: 10, padding: 10 },
  primaryBtn: { background: "#fff", color: "#111827", border: "1px solid rgba(255,255,255,.2)", padding: "8px 12px", borderRadius: 10, cursor: "pointer", fontWeight: 600 },
  secondaryBtn: { background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,.35)", padding: "8px 12px", borderRadius: 10, cursor: "pointer" },
  saved: { fontSize: 12, color: "#86efac", marginTop: 6 },

  muteFloating: { position: "fixed", right: 14, bottom: 14, zIndex: 10, width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,.1)", color: "#fff", border: "1px solid rgba(255,255,255,.25)", cursor: "pointer", boxShadow: "0 6px 18px rgba(0,0,0,.35)", fontSize: 22 },
};
