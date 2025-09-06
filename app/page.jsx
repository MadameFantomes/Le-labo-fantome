import React, { useState, useMemo } from "react";

"use client";

// URLs externes (modifie si besoin)
const BOORACLE_URL = "https://booracle.example.com"; // ← à remplacer quand tu auras le lien

// Effets sonores (dépose tes mp3/ogg dans /public)
const DOOR_CREAK_URL = "/door-creak.mp3"; // grincement de porte
const HALL_CHIME_URL = "/hall-chimes.mp3";  // léger carillon en boucle

export default function Site() {
  const [entered, setEntered] = useState(false);
  const [room, setRoom] = useState(null); // "labo" | "etude" | "ghostbox" | null
  const [muted, setMuted] = useState(false);

  // Précharger les sons côté client
  const [creak, setCreak] = useState(null);
  const [chime, setChime] = useState(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const c = new Audio(DOOR_CREAK_URL);
    const h = new Audio(HALL_CHIME_URL);
    c.volume = 0.6; // grincement
    h.volume = 0.25; // carillon doux
    h.loop = true;
    setCreak(c);
    setChime(h);
  }, []);

  const handleEnter = () => {
    setEntered(true);
    if (creak && !muted) {
      try { creak.currentTime = 0; creak.play(); } catch {}
    }
  };

  // Lancer/arrêter le carillon dans le hall
  React.useEffect(() => {
    if (!entered || !chime) return;
    if (!muted) {
      try { chime.currentTime = 0; chime.play(); } catch {}
    } else {
      try { chime.pause(); } catch {}
    }
    return () => { try { chime.pause(); } catch {} };
  }, [entered, chime, muted]);

  const toggleMute = () => setMuted((m) => !m);

  return (
    <div style={styles.app}>
      <BackgroundFX />
      {!entered ? (
        <Landing onEnter={handleEnter} />
      ) : (
        <Hall room={room} setRoom={setRoom} />
      )}
      <button onClick={toggleMute} style={styles.muteFloating} aria-label={muted ? "Activer le son" : "Couper le son"}>
        {muted ? "🔇" : "🔊"}
      </button>
      <GlobalStyles />
    </div>
  );
}

// ——————————————————————————————————————————————
// Accueil — Porte ancienne sur fond image
function Landing({ onEnter }) {
  const [opened, setOpened] = useState(false);
  const handleClick = () => {
    if (opened) return;
    setOpened(true);
    setTimeout(() => onEnter(), 800);
  };
  return (
    <section style={{ ...styles.fullscreen, ...bg("/door.jpg") }} aria-label="Accueil — Porte du Labo Fantôme">
      <div style={styles.bgOverlay} />
      <div style={styles.centerCol}>
        <h1 style={styles.title}>Le Labo Fantôme — École</h1>
        <p style={styles.subtitle}>Une porte s'entrouvre entre visible et invisible…</p>
        <div
          style={styles.doorWrap}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter") handleClick(); }}
          aria-label="Entrer dans le Labo"
        >
          <div style={styles.doorShadow} />
          <div
            style={{
              ...styles.door,
              transform: opened ? "perspective(800px) rotateY(-70deg)" : "none",
            }}
            className="door"
          >
            <div style={styles.doorKnob} />
            <div style={styles.doorSign}>LABO</div>
          </div>
          <div style={styles.lightBeam} className="beam" />
        </div>
        <p style={styles.hint}>Cliquer la porte pour entrer</p>
      </div>
    </section>
  );
}

// ——————————————————————————————————————————————
// Hall — Choix des pièces
function Hall({ room, setRoom }) {
  return (
    <section style={{ ...styles.hall, ...bg("/lab.jpg") }} aria-label="Hall — Choisir une pièce">
      <div style={styles.bgOverlay} />
      <header style={styles.hallHeader}>
        <h2 style={styles.hallTitle}>Hall du Labo</h2>
        <p style={styles.hallSub}>Choisis une porte pour continuer</p>
      </header>

      {!room && (
        <div style={styles.doorsGrid}>
          <MiniDoor title="Le Labo" subtitle="TCI & enregistrements" icon="🎙️" onClick={() => setRoom("labo")} />
          <MiniDoor title="Salle d'étude" subtitle="Bibliothèque, Livret, Booracle" icon="📚" onClick={() => setRoom("etude")} />
          <MiniDoor title="GhostBox" subtitle="Console en ligne" icon="📻" onClick={() => setRoom("ghostbox")} />
        </div>
      )}

      {room === "labo" && <RoomLabo onBack={() => setRoom(null)} />}
      {room === "etude" && <RoomEtude onBack={() => setRoom(null)} />}
      {room === "ghostbox" && <RoomGhostBox onBack={() => setRoom(null)} />}
    </section>
  );
}

function MiniDoor({ title, subtitle, icon, onClick }) {
  return (
    <button onClick={onClick} style={styles.miniDoorBtn} aria-label={title}>
      <div style={styles.miniDoorBody}>
        <div style={styles.miniDoorTop}>
          <span style={styles.miniDoorIcon}>{icon}</span>
        </div>
        <div style={styles.miniDoorPlate}>{title}</div>
      </div>
      <div style={styles.miniDoorCaption}>{subtitle}</div>
    </button>
  );
}

// ——————————————————————————————————————————————
// Pièces
function RoomLabo({ onBack }) {
  return (
    <div style={{ ...styles.roomSection, ...bg("/lab.jpg") }}>
      <div style={styles.bgOverlay} />
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
      <div style={styles.bgOverlay} />
      {/* Lampe vacillante */}
      <div style={styles.lamp} />
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
            <div style={styles.iframeWrap}>
              <iframe title="Booracle" src={BOORACLE_URL} style={styles.iframe} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function RoomGhostBox({ onBack }) {
  return (
    <div style={{ ...styles.roomSection, ...bg("/ghostbox.jpg") }}>
      <div style={styles.bgOverlay} />
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

function Card({ children }) {
  return <div style={styles.card}>{children}</div>;
}

function NotePad({ storageKey, placeholder }) {
  const initial = useMemo(() => (typeof window !== "undefined" ? localStorage.getItem(storageKey) || "" : ""), [storageKey]);
  const [v, setV] = useState(initial);
  const [saved, setSaved] = useState(false);
  return (
    <div>
      <textarea
        value={v}
        onChange={(e) => { setV(e.target.value); setSaved(false); }}
        placeholder={placeholder}
        style={styles.textarea}
      />
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button style={styles.primaryBtn} onClick={() => { localStorage.setItem(storageKey, v); setSaved(true); }}>Enregistrer</button>
        <button style={styles.secondaryBtn} onClick={() => { const s = localStorage.getItem(storageKey) || ""; setV(s); setSaved(false); }}>Recharger</button>
      </div>
      {saved && <p style={styles.saved}>Enregistré ✓</p>}
    </div>
  );
}

function BackgroundFX() {
  return (
    <div aria-hidden>
      <div style={styles.bgGradient} />
      <div style={styles.stars} />
      <div style={styles.fog} />
    </div>
  );
}

function GlobalStyles() {
  return (
    <style>{`
      @keyframes twinkle { 0%,100% { opacity:.3 } 50% { opacity:.8 } }
      .door:hover { filter: brightness(1.08); }
      .beam { animation: glow 2.6s ease-in-out infinite; }
      @keyframes glow { 0%,100% { opacity: .15 } 50% { opacity: .35 } }
      @keyframes lampFlicker { 0%,19%,21%,23%,25%,54%,56%,100% { opacity: .9; filter: drop-shadow(0 0 18px rgba(255,242,200,.55)); } 20%,24%,55% { opacity: .6; filter: drop-shadow(0 0 6px rgba(255,242,200,.25)); } }
    `}</style>
  );
}

// ——————————————————————————————————————————————
// Helpers & styles
function bg(url) {
  return {
    backgroundImage: `url(${url})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
  };
}

const styles = {
  // petite lampe vacillante dans la salle d'étude
  lamp: {
    position: "absolute",
    top: 40,
    right: 60,
    width: 18,
    height: 18,
    borderRadius: 999,
    background: "radial-gradient(circle at 50% 50%, #ffe9b0, #e9b76a 60%, rgba(0,0,0,0) 70%)",
    animation: "lampFlicker 2.6s infinite",
    zIndex: 1,
  },

  app: { minHeight: "100vh", background: "#0b0f1a", color: "#f6f6f6", position: "relative", overflowX: "hidden" },
  fullscreen: { minHeight: "100vh", display: "grid", placeItems: "center", position: "relative", padding: "48px 16px" },
  centerCol: { display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center", zIndex: 1 },
  title: { fontFamily: "serif", fontSize: 32, letterSpacing: 1, textShadow: "0 1px 0 #000" },
  subtitle: { opacity: 0.9, maxWidth: 700 },
  hint: { fontSize: 12, opacity: 0.7, marginTop: 10 },

  // Overlay doux au-dessus des fonds photos
  bgOverlay: { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(11,15,26,.4), rgba(11,15,26,.65))", backdropFilter: "blur(1px)" },

  // Porte
  doorWrap: { position: "relative", width: 260, height: 420, marginTop: 12, cursor: "pointer", zIndex: 1 },
  doorShadow: { position: "absolute", inset: -12, borderRadius: 18, background: "rgba(255,255,255,0.05)", filter: "blur(6px)" },
  door: {
    position: "absolute",
    inset: 0,
    borderRadius: 14,
    background: `linear-gradient(180deg, #3b2d1f 0%, #2e2419 40%, #251d14 100%),
      repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 24px)`,
    border: "1px solid rgba(255,255,255,0.18)",
    boxShadow: "inset 0 0 0 1px rgba(0,0,0,.8), 0 30px 80px rgba(0,0,0,.6)",
    display: "grid",
    placeItems: "center",
    transformOrigin: "left center",
    transition: "transform .8s cubic-bezier(.2,.7,.1,1)",
  },
  doorKnob: { position: "absolute", right: 24, top: "50%", width: 16, height: 16, borderRadius: 999, background: "radial-gradient(circle at 30% 30%, #e0c16d, #8a6b2a)", boxShadow: "0 0 6px rgba(255,220,120,.6)" },
  doorSign: { position: "absolute", top: 18, left: "50%", transform: "translateX(-50%)", padding: "4px 10px", borderRadius: 8, fontFamily: "serif", letterSpacing: 2, fontSize: 14, background: "rgba(0,0,0,.35)", border: "1px solid rgba(255,255,255,.25)" },
  lightBeam: { position: "absolute", left: 0, top: 0, bottom: 0, width: 24, background: "linear-gradient(90deg, rgba(255,238,170,.45), rgba(255,238,170,0))", filter: "blur(4px)" },

  // Hall & pièces
  hall: { minHeight: "100vh", padding: "64px 16px", maxWidth: 1200, margin: "0 auto", position: "relative" },
  hallHeader: { textAlign: "center", marginBottom: 24, position: "relative", zIndex: 1 },
  hallTitle: { fontFamily: "serif", fontSize: 28 },
  hallSub: { opacity: 0.9 },
  doorsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20, marginTop: 24, position: "relative", zIndex: 1 },
  miniDoorBtn: { background: "transparent", border: "none", textAlign: "center", cursor: "pointer" },
  miniDoorBody: {
    position: "relative",
    height: 240,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,.15)",
    background: `linear-gradient(180deg, rgba(59,45,31,.9) 0%, rgba(46,36,25,.9) 40%, rgba(37,29,20,.9) 100%),
      repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 22px)`,
    boxShadow: "inset 0 0 0 1px rgba(0,0,0,.8), 0 20px 50px rgba(0,0,0,.4)",
    transition: "transform .35s ease, filter .35s ease",
  },
  miniDoorTop: { position: "absolute", top: 12, left: 0, right: 0, display: "grid", placeItems: "center" },
  miniDoorIcon: { fontSize: 28 },
  miniDoorPlate: { position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", padding: "4px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,.25)", background: "rgba(0,0,0,.35)", fontFamily: "serif", letterSpacing: 1 },
  miniDoorCaption: { marginTop: 10, opacity: 0.95 },

  roomSection: { position: "relative", minHeight: "100vh", padding: "32px 16px" },
  room: { marginTop: 16, position: "relative", zIndex: 1, maxWidth: 1200, marginLeft: "auto", marginRight: "auto" },
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

  muteFloating: { position: "fixed", right: 14, bottom: 14, zIndex: 60, width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,.1)", color: "#fff", border: "1px solid rgba(255,255,255,.25)", cursor: "pointer", boxShadow: "0 6px 18px rgba(0,0,0,.35)", fontSize: 22 },

  bgGradient: { position: "fixed", inset: 0, zIndex: -3, background: `radial-gradient(1200px 600px at 50% -10%, rgba(99,102,241,.25), transparent),
                radial-gradient(1000px 700px at 120% 10%, rgba(236,72,153,.12), transparent),
                linear-gradient(180deg, #0b0f1a 10%, #0b0f1a)` },
  stars: { position: "fixed", inset: 0, zIndex: -2, opacity: 0.35, backgroundImage: `radial-gradient(1px 1px at 12% 18%, #ffffff, transparent),
     radial-gradient(1px 1px at 72% 8%, #ffffff, transparent),
     radial-gradient(1px 1px at 22% 78%, #ffffff, transparent),
     radial-gradient(1px 1px at 88% 66%, #ffffff, transparent)`, backgroundRepeat: "no-repeat", animation: "twinkle 6s ease-in-out infinite" },
  fog: { position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none", background: `radial-gradient(60% 30% at 50% 10%, rgba(255,255,255,.08), transparent),
     radial-gradient(40% 20% at 30% 80%, rgba(255,255,255,.06), transparent)` },
};
