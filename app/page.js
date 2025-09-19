// app/page.js
"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";

const DOOR_CREAK_URL = "/door-creak.mp3";
const HALL_CHIME_URL = "/hall-chimes.mp3";
const BACKGROUND_MUSIC_URL = "/bg-music.mp3";

export default function Page() {
  const [entered, setEntered] = useState(false);
  const [room, setRoom] = useState(null);

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

    document.body.style.cursor = "url('/ghost-cursor.png'), auto"; // 👻 curseur global

    return () => {
      h.removeEventListener("ended", onChimeEnded);
      h.pause(); b.pause();
    };
  }, []);

  const toggleMute = () => {
    setMuted((m) => {
      const next = !m;
      if (next) { chimeRef.current?.pause(); bgmRef.current?.pause(); }
      else { bgmRef.current?.play().catch(() => {}); }
      return next;
    });
  };

  const handleEnter = () => {
    if (!muted) {
      creakRef.current?.play().catch(() => {});
      chimeRef.current?.play().catch(() => {});
    }
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

/* --- Landing --- */
function Landing({ onEnter }) {
  const [opened, setOpened] = useState(false);
  const open = () => { if (!opened) { setOpened(true); onEnter(); } };

  return (
    <section aria-label="Accueil Porte du Labo" style={styles.screen}>
      <div style={{ ...styles.bg, backgroundImage: "url(/door-wall.jpg)" }} aria-hidden />
      <div style={styles.bgVeil} aria-hidden />

      <div style={styles.doorLayer}>
        <div style={{ transform: "translateY(5vh)" }}>
          <div style={styles.doorWrap}>
            <div style={styles.curvedHintWrap} aria-hidden>
              <svg viewBox="0 0 400 120" style={styles.curvedHintSvg} preserveAspectRatio="none">
                <path id="door-arc" d="M 10 100 Q 200 10 390 100" fill="none" stroke="none" />
                <text style={styles.curvedHintText}>
                  <textPath href="#door-arc" startOffset="50%" textAnchor="middle">
                    Cliquer la porte pour entrer
                  </textPath>
                </text>
              </svg>
            </div>

            <img
              src="/door-sprite.png"
              alt="Porte ancienne"
              onClick={open}
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
              }}
            />
          </div>

          <div style={styles.underDoorText}>
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

/* --- Hall --- */
function Hall({ room, setRoom }) {
  if (room === "labo") return <RoomLabo onBack={() => setRoom(null)} />;
  if (room === "etude") return <RoomEtude onBack={() => setRoom(null)} />;
  if (room === "ghostbox") return <RoomGhostBox onBack={() => setRoom(null)} />;

  const [hallSrc, setHallSrc] = useState("/hall.jpg");

  return (
    <section style={styles.hallScreen}>
      <img src={hallSrc} onError={() => setHallSrc("/background.png")} style={styles.hallBgImg} />
      <div style={styles.hallVeil} />

      <div style={styles.hallInner}>
        <div style={styles.hallHeader}>
          <h2 style={styles.hallTitle}>Hall du Labo</h2>
          <p style={styles.hallSub}>Choisis une porte pour continuer</p>
        </div>

        <div style={styles.doorsGrid}>
          <MiniDoor title="Le Labo" subtitle="TCI & enregistrements" onClick={() => setRoom("labo")} />
          <MiniDoor title="Salle d'étude" subtitle="Bibliothèque, Livret, Booracle" onClick={() => setRoom("etude")} />
          <MiniDoor title="GhostBox" subtitle="Console en ligne" onClick={() => setRoom("ghostbox")} />
        </div>
      </div>
    </section>
  );
}

/* --- MiniDoor --- */
function MiniDoor({ title, subtitle, onClick }) {
  const [hover, setHover] = useState(false);

  const handleClick = () => {
    const audio = new Audio("/door-creak.mp3");
    audio.volume = 0.6;
    audio.play().catch(() => {});
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={styles.miniDoorBtn}
    >
      <div style={styles.miniDoorBody}>
        <div
          style={{
            ...styles.miniDoorBg,
            boxShadow: hover
              ? "0 0 25px rgba(255,255,200,0.8)"
              : "0 10px 24px rgba(0,0,0,.45)",
            transform: hover ? "scale(1.05)" : "scale(1)",
          }}
        >
          <span style={styles.miniDoorText}>{title}</span>
        </div>
      </div>
      <div style={styles.miniDoorCaption}>{subtitle}</div>
    </button>
  );
}

/* --- Rooms (inchangées, raccourcies ici pour lisibilité) --- */
function RoomLabo({ onBack }) { return <div>...</div>; }
function RoomEtude({ onBack }) { return <div>...</div>; }
function RoomGhostBox({ onBack }) { return <div>...</div>; }

/* --- Styles --- */
function bg(url) {
  return { backgroundImage: `url(${url})`, backgroundSize: "cover", backgroundPosition: "center" };
}

const styles = {
  app: { minHeight: "100vh", background: "#0b0f1a", color: "#f6f6f6" },
  screen: { minHeight: "100vh", position: "relative", overflow: "hidden" },
  bg: { position: "absolute", inset: 0 },
  bgVeil: { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(11,15,26,.2), rgba(11,15,26,.55))" },
  doorLayer: { position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" },
  doorWrap: { width: "clamp(220px, 34vw, 400px)", margin: "0 auto", position: "relative" },
  curvedHintWrap: { position: "absolute", left: 0, right: 0, top: "-62px" },
  curvedHintSvg: { width: "100%", height: "62px" },
  curvedHintText: { fontFamily: "var(--font-oldenglish), serif", fontSize: "clamp(16px, 3vw, 34px)", fill: "#fff" },
  underDoorText: { marginTop: 18, textAlign: "center" },
  titleBig: { fontFamily: "var(--font-title), serif", fontSize: "clamp(40px, 6.8vw, 96px)" },
  subtitleOld: { fontFamily: "var(--font-oldenglish), serif", color: "#fff" },

  hallScreen: { minHeight: "100vh", position: "relative" },
  hallBgImg: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" },
  hallVeil: { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(11,15,26,.18), rgba(11,15,26,.55))" },
  hallInner: { position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "64px 16px" },
  hallHeader: { textAlign: "center", marginBottom: 24 },
  hallTitle: { fontFamily: "var(--font-title), serif", fontSize: 32 },
  hallSub: { opacity: 0.9 },
  doorsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20 },

  miniDoorBtn: { background: "transparent", border: "none", color: "#fff", cursor: "pointer", textAlign: "center" },
  miniDoorBody: { position: "relative", width: 200, height: 300, margin: "0 auto" }, // agrandi
  miniDoorBg: {
    backgroundImage: "url(/minidoor.png)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "100%",
    height: "100%",
    display: "flex", alignItems: "center", justifyContent: "center",
    borderRadius: 8, transition: "all 0.3s ease",
  },
  miniDoorText: { fontFamily: "var(--font-title), serif", fontSize: 24, color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,.7)" },
  miniDoorCaption: { marginTop: 10, opacity: 0.95, fontSize: 15, fontFamily: "serif" },

  muteFloating: {
    position: "fixed", right: 14, bottom: 14,
    zIndex: 10, width: 44, height: 44,
    borderRadius: 12, background: "rgba(255,255,255,.1)",
    border: "1px solid rgba(255,255,255,.25)", color: "#fff",
    cursor: "pointer", fontSize: 22,
  },
};
