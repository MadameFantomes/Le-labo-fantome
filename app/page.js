"use client";

import React, { useState, useMemo } from "react";

/* ========= Réglages ========= */
const BOORACLE_URL = "https://booracle.example.com"; // à remplacer
const DOOR_CREAK_URL = "/door-creak.mp3";
const HALL_CHIME_URL = "/hall-chimes.mp3";
const BACKGROUND_MUSIC_URL = "/bg-music.mp3";

/* Porte : bornes confortables */
const DOOR_MAX_WIDTH = 420;  // largeur max porte
const DOOR_MIN_WIDTH = 200;  // largeur min porte

export default function Site() {
  const [entered, setEntered] = useState(false);
  const [room, setRoom] = useState(null); // "labo" | "etude" | "ghostbox" | null
  const [muted, setMuted] = useState(false);

  // audio
  const [creak, setCreak] = useState(null);
  const [chime, setChime] = useState(null);
  const [bgm, setBgm] = useState(null);
  const [chimeEnded, setChimeEnded] = useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const c = new Audio(DOOR_CREAK_URL);
    const h = new Audio(HALL_CHIME_URL);
    const b = new Audio(BACKGROUND_MUSIC_URL);

    c.volume = 0.6;
    h.volume = 0.25; h.loop = false;
    b.volume = 0.18; b.loop = true;

    const onEnded = () => {
      setChimeEnded(true);
      if (!muted) { try { b.play(); } catch {} }
    };
    h.addEventListener("ended", onEnded);

    setCreak(c); setChime(h); setBgm(b);
    return () => {
      try { h.removeEventListener("ended", onEnded); } catch {}
      try { h.pause(); } catch {}
      try { b.pause(); } catch {}
    };
  }, [muted]);

  const handleEnter = () => {
    setEntered(true);
    if (!muted && creak) { try { creak.currentTime = 0; creak.play(); } catch {} }
  };

  // chime (une fois) puis musique
  React.useEffect(() => {
    if (!entered || !chime) return;
    if (muted) { try { chime.pause(); } catch {}; try { bgm && bgm.pause(); } catch {}; return; }
    if (!chimeEnded) { try { chime.currentTime = 0; chime.play(); } catch {} }
    else if (bgm) { try { bgm.play(); } catch {} }
  }, [entered, muted, chime, bgm, chimeEnded]);

  const toggleMute = () => {
    setMuted(m => {
      const next = !m;
      try {
        if (next) { chime && chime.pause(); bgm && bgm.pause(); }
        else if (entered) { if (chimeEnded && bgm) bgm.play().catch(()=>{}); else if (chime) chime.play().catch(()=>{}); }
      } catch {}
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

/* =========================
   Landing : mur pierres + porte CENTRÉE (comme au début), 100% visible
   ========================= */
function Landing({ onEnter }) {
  const [opened, setOpened] = useState(false);
  const [ratio, setRatio] = useState(560 / 360); // sera mis à jour au onLoad
  const [width, setWidth] = useState(280);

  const clamp = (n, min, max) => Math.max(min, Math.min(n, max));

  // Calcule une largeur qui rentre dans l'écran (largeur ET hauteur) puis centre
  React.useEffect(() => {
    const compute = () => {
      const vw = typeof window !== "undefined" ? window.innerWidth : 1024;
      const vh = typeof window !== "undefined" ? window.innerHeight : 768;

      // On réserve un peu d'espace vertical pour le titre + le texte d'aide
      const reservedTop = clamp(vh * 0.20, 100, 180);
      const reservedBottom = clamp(vh * 0.12, 60, 120);

      // contraintes
      const byWidth = vw * 0.34;                                // 34% largeur écran (look “plus petit”)
      const byHeight = (vh - reservedTop - reservedBottom) * 0.98; // presque tout l'espace dispo
      const widthFromHeight = byHeight / ratio;

      const w = Math.min(byWidth, widthFromHeight);
      setWidth(Math.round(clamp(w, DOOR_MIN_WIDTH, DOOR_MAX_WIDTH)));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [ratio]);

  const height = Math.round(width * ratio);

  const handleClick = () => {
    if (opened) return;
    setOpened(true);
    setTimeout(() => onEnter(), 900);
  };

  return (
    <section style={styles.fullscreen} aria-label="Accueil — Porte du Labo Fantôme">
      {/* Fond mur + voile */}
      <div style={{ ...styles.bgImage, backgroundImage: 'url(/door-wall.jpg)' }} aria-hidden />
      <div style={styles.bgOverlay} aria-hidden />

      {/* Colonne centrée (titre → porte → hint), comme au début */}
      <div style={styles.centerCol}>
        <h1 style={styles.title}>Le Labo Fantôme — École</h1>

        {/* Porte centrée */}
        <div style={{ width, height, position: "relative", margin: "12px auto 10px" }}>
          <img
            src="/door-sprite.png"
            alt="Porte ancienne"
            onLoad={(e) => {
              const img = e.currentTarget;
              if (img.naturalWidth) setRatio(img.naturalHeight / img.naturalWidth);
            }}
            style={{
              position: "absolute",
              inset: 0,
              objectFit: "contain",
              transformOrigin: "left center",
              transition: "transform .9s cubic-bezier(.2,.7,.1,1)",
              transform: opened
                ? "perspective(1100px) rotateY(-72deg)"
                : "perspective(1100px) rotateY(0deg)",
              cursor: "pointer",
              filter: "drop-shadow(0 18px 40px rgba(0,0,0,.45))",
            }}
            onClick={handleClick}
            onKeyDown={(e) => e.key === "Enter" && handleClick()}
            role="button"
            tabIndex={0}
            aria-label="Entrer dans le Labo"
          />
          {/* Lueur optionnelle */}
          <div
            style={{
              position: "absolute",
              left: -2,
              top: 0,
              bottom: 0,
              width: 24,
              background:
                "linear-gradient(90deg, rgba(255,238,170,.50), rgba(255,238,170,0))",
              filter: "blur(8px)",
              opacity: 0.8,
              pointerEvents: "none",
            }}
            aria-hidden
          />
        </div>

        {/* Aide : lisible et centrée sous la porte */}
        <p style={styles.hintBig}>Cliquer la porte pour entrer</p>
      </div>
    </section>
  );
}

/* =========================
   Hall (puis les pièces)
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

/* ======= Rooms ======= */
function RoomLabo({ onBack }) {
  return (
    <div style={{ ...styles.roomSection, ...bg("/lab.jpg") }}>
      <div style={styles.room}>
        <RoomHeader title="Le Labo" subtitle="Réception — Réflexion — Transmission" onBack={onBack} />
        <div style={styles.roomContent}>
          <Card>
            <h3 style={styles.cardTitle}>Protocole d'enregistrement (démo)</h3>
            <ol style={styles.list}>
              <li>Prépare l'espace : silence, intention, timer 10–15 min.</li>
              <li>Matériel : micro + casque ; note la date/heure.</li>
              <li>Enregistre ; marque les timecodes notables.</li>
              <li>À l'écoute : sépare artefacts / voix / symboles.</li>
              <li>Consigne tout dans le carnet de labo.</li>
            </ol>
          </Card>
          <Card>
            <h3 style={styles.cardTitle}>Carnet de labo (bloc-notes local)</h3>
            <NotePad storageKey="labo_note" placeholder="Ex. Hypothèse: mot 'clairière' perçu; 03:12 chuchotement; Carte Booracle: 'Lumière'…" />
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
        <RoomHeader title="Salle d'étude" subtitle="Bibliothèque — Livret — Booracle" onBack={onBack} />
        <div style={styles.roomContent}>
          <Card>
            <h3 style={styles.cardTitle}>Livret d'étude</h3>
            <p style={styles.p}>Ton livret interactif (flipbook/PDF) pourra être lié ici (bouton ou aperçu). Donne-moi l'URL quand tu l'as.</p>
            <button style={styles.primaryBtn} onClick={() => alert("Ajoute l'URL du livret quand prêt.")}>Ouvrir le livret</button>
          </Card>
          <Card>
            <h3 style={styles.cardTitle}>Booracle en ligne</h3>
            <p style={styles.p}>Instrument de pensée : tirer une carte avant/après une séance.</p>
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
        <RoomHeader title="GhostBox" subtitle="Console en ligne (intégration à venir)" onBack={onBack} />
        <div style={styles.roomContent}>
          <Card>
            <h3 style={styles.cardTitle}>Intégration prochaine</h3>
            <p style={styles.p}>Quand tu auras une GhostBox web ou un lecteur/flux audio, on peut l'intégrer ici (iframe, audio HTML5, ou lien externe).</p>
            <button style={styles.secondaryBtn} onClick={() => alert("On branchera l'URL de la GhostBox ici.")}>Préparer l'intégration</button>
          </Card>
          <Card>
            <h3 style={styles.cardTitle}>Conseils d'usage</h3>
            <ul style={styles.list}>
              <li>Cadre juste & intention claire.</li>
              <li>Écoute prudente : noter, comparer, recouper.</li>
              <li>Jamais d'affirmations hâtives ; éthique avant tout.</li>
            </ul>
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
  const initial = useMemo(() => (typeof window !== "undefined" ? localStorage.getItem(storageKey) || "" : ""), [storageKey]);
  const [v, setV] = useState(initial);
  const [saved, setSaved] = useState(false);
  return (
    <div>
      <textarea value={v} onChange={(e) => { setV(e.target.value); setSaved(false); }} placeholder={placeholder} style={styles.textarea} />
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button style={styles.primaryBtn} onClick={() => { localStorage.setItem(storageKey, v); setSaved(true); }}>Enregistrer</button>
        <button style={styles.secondaryBtn} onClick={() => { const s = localStorage.getItem(storageKey) || ""; setV(s); setSaved(false); }}>Recharger</button>
      </div>
      {saved && <p style={styles.saved}>Enregistré ✓</p>}
    </div>
  );
}

/* =========================
   Helpers & Styles
   ========================= */
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

  /* Accueil plein écran */
  fullscreen: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    display: "grid",
    placeItems: "center", // ← centre le bloc (titre+porte+hint) verticalement & horizontalement
    textAlign: "center",
    padding: "24px 12px",
  },

  /* Fond + voile */
  bgImage: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    zIndex: 0,
  },
  bgOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, rgba(11,15,26,.18), rgba(11,15,26,.55))",
    zIndex: 0,
  },

  /* Colonne centrée (comme au début) */
  centerCol: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  title: { fontFamily: "serif", fontSize: 28, letterSpacing: 1, textShadow: "0 1px 0 #000", margin: 0 },

  /* Aide lisible sous la porte */
  hintBig: {
    fontSize: 16,
    lineHeight: 1.2,
    color: "#f7f7f7",
    background: "rgba(0,0,0,.45)",
    border: "1px solid rgba(255,255,255,.25)",
    borderRadius: 10,
    padding: "8px 12px",
    textShadow: "0 1px 0 rgba(0,0,0,.5)",
    marginTop: 10,
  },

  /* Hall & Rooms */
  hall: { minHeight: "100vh", padding: "64px 16px", maxWidth: 1200, margin: "0 auto" },
  hallHeader: { textAlign: "center", marginBottom: 24 },
  hallTitle: { fontFamily: "serif", fontSize: 28 },
  hallSub: { opacity: 0.9 },
  doorsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20, marginTop: 24 },

  miniDoorBtn: { background: "transparent", border: "none", textAlign: "center", cursor: "pointer" },
  miniDoorBody: { position: "relative", height: 240, borderRadius: 12, border: "1px solid rgba(255,255,255,.15)", background: "linear-gradient(180deg, rgba(59,45,31,.9) 0%, rgba(46,36,25,.9) 40%, rgba(37,29,20,.9) 100%), repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 22px)", boxShadow: "inset 0 0 0 1px rgba(0,0,0,.8), 0 20px 50px rgba(0,0,0,.4)", transition: "transform .35s ease, filter .35s ease" },
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

  // bouton son
  muteFloating: { position: "fixed", right: 14, bottom: 14, zIndex: 60, width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,.1)", color: "#fff", border: "1px solid rgba(255,255,255,.25)", cursor: "pointer", boxShadow: "0 6px 18px rgba(0,0,0,.35)", fontSize: 22 },
};
