// app/page.js
"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";

/** --- Assets (doivent exister dans /public) --- */
const DOOR_CREAK_URL = "/door-creak.mp3";
const HALL_CHIME_URL = "/hall-chimes.mp3";
const BACKGROUND_MUSIC_URL = "/bg-music.mp3";

/** ========================================================================
 *  PAGE RACINE
 * =======================================================================*/
export default function Page() {
  const [entered, setEntered] = useState(false);
  const [room, setRoom] = useState(null); // "labo" | "etude" | "ghostbox" | null

  // Audio
  const creakRef = useRef(null);
  const chimeRef = useRef(null);
  const bgmRef = useRef(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const c = new Audio(DOOR_CREAK_URL);
    const h = new Audio(HALL_CHIME_URL);
    const b = new Audio(BACKGROUND_MUSIC_URL);
    c.volume = 0.6;
    h.volume = 0.25; h.loop = false;
    b.volume = 0.18; b.loop = true;

    const onChimeEnded = () => { if (!muted) b.play().catch(() => {}); };
    h.addEventListener("ended", onChimeEnded);

    creakRef.current = c;
    chimeRef.current = h;
    bgmRef.current  = b;

    return () => {
      try { h.removeEventListener("ended", onChimeEnded); } catch {}
      try { h.pause(); } catch {}
      try { b.pause(); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMute = () => {
    setMuted((m) => {
      const next = !m;
      try {
        if (next) { chimeRef.current?.pause(); bgmRef.current?.pause(); }
        else { bgmRef.current?.play().catch(() => {}); }
      } catch {}
      return next;
    });
  };

  const handleEnter = () => {
    try { if (!muted) creakRef.current?.play().catch(() => {}); } catch {}
    try { if (!muted) chimeRef.current?.play().catch(() => {}); } catch {}
    setTimeout(() => setEntered(true), 800);
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
        title={muted ? "Activer le son" : "Couper le son"}
      >
        {muted ? "🔇" : "🔊"}
      </button>
    </div>
  );
}

/** ========================================================================
 *  ACCUEIL (Landing)
 * =======================================================================*/
function Landing({ onEnter }) {
  const [opened, setOpened] = useState(false);

  const open = () => {
    if (opened) return;
    setOpened(true);
    onEnter();
  };

  return (
    <section aria-label="Accueil Porte du Labo" style={styles.screen}>
      {/* Fond */}
      <div style={{ ...styles.bg, backgroundImage: "url(/door-wall.jpg)" }} aria-hidden />
      <div style={styles.bgVeil} aria-hidden />

      {/* Porte + textes */}
      <div style={styles.doorLayer}>
        <div style={{ transform: "translateY(5vh)" }}>
          <div style={styles.doorWrap}>
            {/* Texte courbé au-dessus de la porte */}
            <div style={styles.curvedHintWrap} aria-hidden>
              <svg
                viewBox="0 0 400 120"
                style={styles.curvedHintSvg}
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  id="door-arc"
                  d="M 10 100 Q 200 10 390 100"
                  fill="none"
                  stroke="none"
                />
                <text style={styles.curvedHintText}>
                  <textPath href="#door-arc" startOffset="50%" textAnchor="middle">
                    Cliquer la porte pour entrer
                  </textPath>
                </text>
              </svg>
            </div>

            {/* Image de la porte */}
            <img
              src="/door-sprite.png"
              alt="Porte ancienne"
              onClick={open}
              onKeyDown={(e) => e.key === "Enter" && open()}
              role="button"
              tabIndex={0}
              style={{
                width: "100%",
                height: "auto",
                transformOrigin: "left center",
                transition: "transform .9s cubic-bezier(.2,.7,.1,1)",
                transform: opened
                  ? "perspective(1100px) rotateY(-72deg)"
                  : "perspective(1100px) rotateY(0deg)",
                cursor: "pointer",
                filter: "drop-shadow(0 18px 40px rgba(0,0,0,.45))",
                display: "block",
              }}
            />
          </div>

          {/* Bloc texte SOUS la porte */}
          <div style={styles.underDoorText} aria-hidden>
            <h1 style={styles.titleBig}>Le Labo Fantôme École</h1>
            <p style={styles.subtitleOld}>
              Une porte s&apos;entrouvre entre visible et invisible…
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** ========================================================================
 *  HALL
 * =======================================================================*/
function Hall({ room, setRoom }) {
  if (room === "labo") return <RoomLabo onBack={() => setRoom(null)} />;
  if (room === "etude") return <RoomEtude onBack={() => setRoom(null)} />;
  if (room === "ghostbox") return <RoomGhostBox onBack={() => setRoom(null)} />;

  const [hallSrc, setHallSrc] = useState("/hall.jpg");

  return (
    <section style={styles.hallScreen} aria-label="Hall Choisir une pièce">
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
          <MiniDoor
            title="Le Labo"
            subtitle="TCI & enregistrements"
            icon="🎙️"
            onClick={() => setRoom("labo")}
          />
          <MiniDoor
            title="Salle d'étude"
            subtitle="Bibliothèque, Livret, Booracle"
            icon="📚"
            onClick={() => setRoom("etude")}
          />
          <MiniDoor
            title="GhostBox"
            subtitle="Console en ligne"
            icon="📻"
            onClick={() => setRoom("ghostbox")}
          />
        </div>
      </div>
    </section>
  );
}

/** Mini porte */
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

/** ========================================================================
 *  ROOMS
 * =======================================================================*/
function RoomLabo({ onBack }) {
  return (
    <div style={{ ...styles.roomSection, ...bg("/lab.jpg") }}>
      <div style={styles.room}>
        <RoomHeader title="Le Labo" subtitle="Réception  Réflexion  Transmission" onBack={onBack} />
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
        <RoomHeader title="Salle d&apos;étude" subtitle="Bibliothèque  Livret  Booracle" onBack={onBack} />
        <div style={styles.roomContent}>
          <Card>
            <h3 style={styles.cardTitle}>Livret d&apos;étude</h3>
            <p style={styles.p}>Ton livret (PDF/flipbook) pourra être lié ici.</p>
            <button style={styles.primaryBtn} onClick={() => alert("Ajoute l'URL du livret ici quand prêt.")}>
              Ouvrir le livret
            </button>
          </Card>
          <Card>
            <h3 style={styles.cardTitle}>Booracle en ligne</h3>
            <p style={styles.p}>Intégration à venir (lien ou console embarquée).</p>
            <button style={styles.secondaryBtn} onClick={() => alert("Prévoir l'URL du Booracle/console.")}>
              Préparer l&apos;intégration
            </button>
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
            <button style={styles.secondaryBtn} onClick={() => alert("Prévoir l'URL/flux de la GhostBox.")}>
              Préparer l&apos;intégration
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}

/** Header commun des rooms */
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

/** Card basique */
function Card({ children }) { return <div style={styles.card}>{children}</div>; }

/** Bloc NotePad (localStorage) */
function NotePad({ storageKey, placeholder }) {
  const initial = useMemo(
    () => (typeof window !== "undefined" ? localStorage.getItem(storageKey) || "" : ""),
    [storageKey]
  );
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
        <button style={styles.primaryBtn} onClick={() => { localStorage.setItem(storageKey, v); setSaved(true); }}>
          Enregistrer
        </button>
        <button style={styles.secondaryBtn} onClick={() => { const s = localStorage.getItem(storageKey) || ""; setV(s); setSaved(false); }}>
          Recharger
        </button>
      </div>
      {saved && <p style={styles.saved}>Enregistré ✓</p>}
    </div>
  );
}

/** ========================================================================
 *  STYLES & HELPERS
 * =======================================================================*/
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

  /** Plein écran */
  screen: { minHeight: "100vh", position: "relative", overflow: "hidden" },

  /** Fond accueil */
  bg: { position: "absolute", inset: 0, backgroundSize: "cover", backgroundPosition: "center" },
  bgVeil: { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(11,15,26,.20), rgba(11,15,26,.55))" },

  /** Porte + textes */
  doorLayer: {
    position: "fixed", inset: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 2, pointerEvents: "auto",
  },

  doorWrap: {
    width: "clamp(220px, 34vw, 400px)",
    margin: "0 auto",
    position: "relative",
  },

  curvedHintWrap: {
    position: "absolute",
    left: 0, right: 0,
    top: "-62px",
    pointerEvents: "none",
  },
  curvedHintSvg: {
    display: "block",
    width: "100%",
    height: "62px",
  },
  curvedHintText: {
    fontFamily: "var(--font-oldenglish), serif",
    fontSize: "clamp(18px, 3.6vw, 38px)", // plus gros
    fill: "#fff",
    letterSpacing: "0.8px",
  },

  underDoorText: {
    marginTop: 18,
    textAlign: "center",
    pointerEvents: "none",
  },

  titleBig: {
    fontFamily: "var(--font-title), serif",
    fontSize: "clamp(40px, 6.8vw, 96px)",
    lineHeight: 1.05,
    margin: "8px 0 6px",
    textShadow: "0 1px 0 rgba(0,0,0,.8)",
  },

  subtitleOld: {
    fontFamily: "var(--font-oldenglish), serif",
    color: "#fff",
    opacity: 0.98,
    margin: "6px 0 10px",
    maxWidth: 900,
    display: "inline-block",
    textAlign: "center",
    lineHeight: 1.2,
  },

  /** Hall */
  hallScreen: { minHeight: "100vh", position: "relative", overflow: "hidden" },
  hallBgImg: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    zIndex: 0,
  },
  hallVeil: { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(11,15,26,.18), rgba(11,15,26,.55))", zIndex: 0 },
  hallInner: { position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "64px 16px" },

  hallHeader: { textAlign: "center", marginBottom: 24 },
  hallTitle: { fontFamily: "var(--font-title), serif", fontSize: 32, letterSpacing: 0.5 },
  hallSub: { opacity: 0.9, fontFamily: "var(--font-title), serif", letterSpacing: 0.3 },
  doorsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20, marginTop: 24 },

  miniDoorBtn: { background: "transparent", border: "none", color: "#fff", cursor: "pointer", textAlign: "center" },
  miniDoorBody: { border: "1px solid rgba(255,255,255,.25)", background: "rgba(0,0,0,.35)", borderRadius: 14, padding: 12, boxShadow: "0 10px 30px rgba(0,0,0,.35)" },
  miniDoorTop: { fontSize: 28, marginBottom: 8 },
  miniDoorIcon: { display: "inline-block" },
  miniDoorPlate: { fontWeight: 700, letterSpacing: 0.3, padding: "6px 10px", borderRadius: 8, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.2)" },
  miniDoorCaption: { marginTop: 8, opacity: 0.95 },

