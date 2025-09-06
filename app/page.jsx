"use client";
import React, { useMemo, useState } from "react";

// ——————————————————————————————————————————————
// Labo Fantôme — École Mystique (one‑file React site)
// - TailwindCSS UI (no external component libs required)
// - Sections: Accueil, Le Labo, Booracle, Parcours, Journal, Communauté, Inscription, FAQ
// - "Harry Potter" vibe through gothic/mystic ambiance — sans contenu protégé
// - Replace BOORACLE_URL with your deployed app (e.g., Vercel)
// ——————————————————————————————————————————————

const BOORACLE_URL = "https://booracle.example.com"; // TODO: remplace par ton URL Vercel

const nav = [
  { id: "accueil", label: "Accueil" },
  { id: "labo", label: "Le Labo" },
  { id: "booracle", label: "Booracle" },
  { id: "parcours", label: "Parcours" },
  { id: "journal", label: "Journal" },
  { id: "communaute", label: "Communauté" },
  { id: "inscription", label: "Inscription" },
  { id: "faq", label: "FAQ" },
];

const curriculum = [
  {
    title: "Initiation — Les fondements",
    parts: [
      "Éthique & cadre d'une séance",
      "Préparation du praticien·ne (ancrage, intention)",
      "Matériel : micro, casque, spirit box, logiciel",
      "Rituel d'ouverture avec Booracle (intention)",
    ],
  },
  {
    title: "Pratique — Réception & écoute",
    parts: [
      "Protocoles d'enregistrement (EVP/DRV)",
      "Hygiène d'écoute, spectral vs symbolique",
      "Repérer les artefacts & écueils",
      "Journal de séance (carnet de labo)",
    ],
  },
  {
    title: "Analyse — Laboratoire de pensée",
    parts: [
      "Méthode R.R.T. : Réception — Réflexion — Transmission",
      "Relier message & symbole (Booracle)",
      "Doutes, hypothèses, validations croisées",
      "Écrire une note d'observation",
    ],
  },
  {
    title: "Transmission — Accompagnement",
    parts: [
      "Restituer avec justesse & douceur",
      "Accompagner l'endeuillé·e",
      "Cadre pro & rémunération éthique",
      "Supervision & communauté du Labo",
    ],
  },
];

const tiers = [
  {
    name: "Auditeur·rice libre",
    price: "Gratuit",
    perks: [
      "Accès public au Booracle (cartes limitées)",
      "News du Labo Fantôme",
    ],
    cta: "Essayer le Booracle",
    href: "#booracle",
  },
  {
    name: "Élève du Labo",
    price: "€€",
    perks: [
      "Accès complet à la formation TCI",
      "Booracle intégral + packs symboliques",
      "Carnet de labo téléchargeable",
      "Sessions collectives mensuelles",
    ],
    cta: "Rejoindre la formation",
    href: "#inscription",
  },
  {
    name: "Cercle de recherche",
    price: "€€€",
    perks: [
      "Ateliers avancés & supervision",
      "Projets participatifs (corpus anonymisé)",
      "Publication « Carnets du Labo »",
      "Accès prioritaire aux nouveautés",
    ],
    cta: "Candidater",
    href: "#inscription",
  },
];

function StarfieldBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900" />
      <div className="absolute inset-0 mix-blend-screen opacity-40" style={{
        backgroundImage:
          "radial-gradient(1px 1px at 20% 30%,#fff,transparent),radial-gradient(1px 1px at 60% 20%,#fff,transparent),radial-gradient(1px 1px at 80% 70%,#fff,transparent),radial-gradient(1px 1px at 30% 80%,#fff,transparent)",
        backgroundSize: "3px 3px, 3px 3px, 3px 3px, 3px 3px"
      }} />
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_60%)]" />
    </div>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-slate-950/40 border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="#accueil" className="group inline-flex items-center gap-3">
            <span className="h-8 w-8 rounded-full bg-white/10 shadow ring-1 ring-white/20 grid place-items-center">👻</span>
            <span className="font-serif text-lg text-white tracking-wide">
              Labo Fantôme <span className="text-white/60">— École Mystique</span>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-6">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="text-sm text-white/80 hover:text-white transition">
                {n.label}
              </a>
            ))}
            <a
              href="#inscription"
              className="rounded-2xl bg-white text-slate-900 px-4 py-2 text-sm font-medium shadow hover:shadow-lg transition"
            >
              Rejoindre
            </a>
          </nav>
          <button onClick={() => setOpen(!open)} className="md:hidden text-white" aria-label="Menu">☰</button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-4 grid gap-3">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="text-white/80" onClick={() => setOpen(false)}>
                {n.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="accueil" className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="font-serif text-4xl sm:text-5xl leading-tight text-white">
              Une école secrète… à ciel ouvert.
            </h1>
            <p className="mt-4 text-white/80 max-w-prose">
              Bienvenue au <strong>Labo Fantôme</strong>, un laboratoire de pensée et de pratique autour de la
              <em> Transcommunication Instrumentale (TCI)</em> :
              réception sensible, réflexion symbolique, transmission éthique. Ici, on apprend en cherchant.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#booracle" className="rounded-2xl bg-white text-slate-900 px-5 py-3 text-sm font-medium shadow">
                Ouvrir le Booracle
              </a>
              <a href="#parcours" className="rounded-2xl ring-1 ring-white/40 text-white px-5 py-3 text-sm font-medium">
                Découvrir le parcours
              </a>
            </div>
            <p className="mt-4 text-xs text-white/60">Univers doux, mystique et poétique — by @madamefantomes</p>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl ring-1 ring-white/20 p-1 bg-white/5 shadow-xl">
              <div className="h-full w-full rounded-2xl bg-gradient-to-br from-violet-900/40 via-fuchsia-900/30 to-slate-900 grid place-items-center">
                <div className="text-center p-8">
                  <div className="text-6xl">🔬👻</div>
                  <h3 className="mt-4 font-serif text-2xl text-white">Le laboratoire mystique</h3>
                  <p className="mt-2 text-white/75 max-w-sm mx-auto">
                    Protocole, intuition et symboles : une pédagogie hybride pour explorer l'invisible avec douceur.
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 rotate-[-4deg]">
              <Badge>Réception · Réflexion · Transmission</Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({ children }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/20 px-4 py-2 text-xs text-white shadow">
      <span>✨</span>
      <span>{children}</span>
    </div>
  );
}

function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow && <div className="text-white/50 text-xs tracking-widest uppercase">{eyebrow}</div>}
      <h2 className="mt-2 font-serif text-3xl text-white">{title}</h2>
      {subtitle && <p className="mt-3 text-white/75">{subtitle}</p>}
    </div>
  );
}

function LaboSection() {
  const pillars = [
    {
      icon: "🎙️",
      name: "Réception",
      desc: "Protocole TCI, enregistrements, hygiène d'écoute et cadre juste.",
    },
    {
      icon: "🃏",
      name: "Réflexion",
      desc: "Booracle comme instrument de pensée : symboles, résonances, hypothèses.",
    },
    {
      icon: "🕊️",
      name: "Transmission",
      desc: "Restituer avec douceur, accompagner le deuil, éthique et supervision.",
    },
  ];
  return (
    <section id="labo" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Méthode R·R·T"
          title="Le Labo Fantôme : une pédagogie hybride"
          subtitle="Réception — Réflexion — Transmission. Une école qui fonctionne comme un laboratoire : on observe, on relie, on transmet."
        />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((p) => (
            <div key={p.name} className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-6 text-white/90 shadow-xl">
              <div className="text-4xl">{p.icon}</div>
              <h3 className="mt-3 font-serif text-xl text-white">{p.name}</h3>
              <p className="mt-2 text-sm text-white/80">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BooracleSection() {
  return (
    <section id="booracle" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Instrument de pensée"
          title="Le Booracle en ligne"
          subtitle="Tire une carte pour poser une intention avant l'écoute, ou pour éclairer l'analyse après."
        />
        <div className="mt-10 grid lg:grid-cols-2 gap-8 items-start">
          <div className="rounded-3xl overflow-hidden ring-1 ring-white/10 bg-white/5 shadow-xl">
            <div className="aspect-[4/3]">
              {/* Remplace l'iframe par ton app réelle quand elle est publiée */}
              <iframe title="Booracle" src={BOORACLE_URL} className="h-full w-full" />
            </div>
          </div>
          <div className="text-white/85">
            <h3 className="font-serif text-2xl text-white">Rituel d'utilisation</h3>
            <ol className="mt-4 space-y-3 text-sm list-decimal list-inside">
              <li>Respire, pose ton intention, ouvre ton espace.</li>
              <li>Tire une carte : note mots, images, émotions.</li>
              <li>Enregistre ta séance TCI (protocole choisi).</li>
              <li>Relis la carte : fait‑elle écho à un passage ?</li>
              <li>Consigne tout dans le <em>carnet de labo</em>.</li>
            </ol>
            <div className="mt-6">
              <a href="#journal" className="inline-flex items-center gap-2 rounded-2xl bg-white text-slate-900 px-4 py-2 text-sm font-medium shadow">
                Ouvrir mon carnet de labo →
              </a>
            </div>
            <p className="mt-6 text-xs text-white/60">Astuce : intègre le Booracle via QR code dans tes supports imprimés.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ParcoursSection() {
  return (
    <section id="parcours" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Curriculum"
          title="Le parcours pédagogique"
          subtitle="De l'initiation à la recherche collaborative. Chaque module inclut vidéo, fiches, rituels et exercices."
        />
        <div className="mt-10 grid lg:grid-cols-2 gap-8">
          {curriculum.map((c) => (
            <div key={c.title} className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-6 text-white/85 shadow-xl">
              <h3 className="font-serif text-xl text-white">{c.title}</h3>
              <ul className="mt-3 space-y-2 text-sm list-disc list-inside">
                {c.parts.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function JournalSection() {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  return (
    <section id="journal" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Carnet de labo"
          title="Journal de séance (démo locale)"
          subtitle="Saisis tes hypothèses, observations, extraits de messages et liens avec la carte tirée. (Dans cette démo, la note reste en mémoire locale du navigateur.)"
        />
        <div className="mt-8 grid lg:grid-cols-2 gap-8 items-start">
          <div className="rounded-3xl p-6 ring-1 ring-white/10 bg-white/5 shadow-xl">
            <label className="block text-sm text-white/80 mb-2">Ma note d'observation</label>
            <textarea
              value={note}
              onChange={(e) => { setNote(e.target.value); setSaved(false); }}
              className="w-full h-56 rounded-xl bg-black/30 text-white placeholder-white/40 p-4 ring-1 ring-white/15 focus:ring-2 focus:ring-white/30 outline-none"
              placeholder="Ex. Hypothèse: mot 'clairière' perçu; Booracle: carte 'Lumière' ; recoupe avec chuchotement à 03:12…"
            />
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => { localStorage.setItem("labo_note", note); setSaved(true); }}
                className="rounded-2xl bg-white text-slate-900 px-4 py-2 text-sm font-medium shadow"
              >
                Enregistrer en local
              </button>
              <button
                onClick={() => { const v = localStorage.getItem("labo_note") || ""; setNote(v); setSaved(false); }}
                className="rounded-2xl ring-1 ring-white/40 text-white px-4 py-2 text-sm"
              >
                Recharger
              </button>
            </div>
            {saved && <p className="mt-2 text-xs text-emerald-300">Enregistré dans le navigateur ✓</p>}
          </div>
          <div className="rounded-3xl p-6 ring-1 ring-white/10 bg-white/5 text-white/80 shadow-xl">
            <h4 className="font-serif text-lg text-white">Grille d'observation</h4>
            <ul className="mt-3 space-y-2 text-sm list-disc list-inside">
              <li><strong>Réception</strong> : contexte, durée, matériel, timecodes notables.</li>
              <li><strong>Réflexion</strong> : mots-clés, symboles, carte Booracle, hypothèses.</li>
              <li><strong>Transmission</strong> : à qui ? quel besoin ? quelle forme juste ?</li>
              <li><strong>Éthique</strong> : cadre, consentement, limites, ressources.</li>
            </ul>
            <p className="mt-4 text-xs text-white/60">Astuce : exporte ensuite ta note dans ton carnet PDF officiel.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CommunitySection() {
  const items = [
    {
      title: "Tirage hebdo du Labo",
      desc: "Chaque lundi, une carte commune + discussion sur les résonances.",
    },
    {
      title: "Écoutes croisées",
      desc: "S'entraîner à repérer les artefacts, comparer sans s'influencer.",
    },
    {
      title: "Supervision douce",
      desc: "Présenter un cas délicat, réfléchir au cadre juste ensemble.",
    },
  ];
  return (
    <section id="communaute" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="L'école vivante"
          title="La communauté du Labo Fantôme"
          subtitle="Un espace accueillant pour pratiquer, réfléchir, et publier des recherches collectives."
        />
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {items.map((it) => (
            <div key={it.title} className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-6 text-white/85 shadow-xl">
              <h4 className="font-serif text-lg text-white">{it.title}</h4>
              <p className="mt-2 text-sm">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="inscription" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="S'inscrire"
          title="Choisir sa porte d'entrée"
          subtitle="Commence gratuitement, puis rejoins la formation quand tu te sens appelée."
        />
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <div key={t.name} className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-6 text-white/85 shadow-xl flex flex-col">
              <h4 className="font-serif text-xl text-white">{t.name}</h4>
              <div className="mt-2 text-3xl text-white">{t.price}</div>
              <ul className="mt-4 space-y-2 text-sm list-disc list-inside flex-1">
                {t.perks.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <a href={t.href} className="mt-6 rounded-2xl bg-white text-slate-900 px-4 py-2 text-sm font-medium text-center shadow">
                {t.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "Est‑ce une école 'Harry Potter' ?",
      a: "Non. On s'inspire d'une ambiance gothique‑poétique (laboratoire mystique), sans utiliser d'éléments protégés. C'est une pédagogie unique centrée sur la TCI et l'éthique.",
    },
    {
      q: "Comment accéder au Booracle complet ?",
      a: "La version publique est limitée. L'accès intégral (avec packs symboliques) est inclus pour les élèves inscrits.",
    },
    {
      q: "Puis‑je pratiquer si je suis débutant·e ?",
      a: "Oui. L'initiation couvre le cadre, le matériel, et des exercices progressifs. L'important est la douceur et la rigueur.",
    },
    {
      q: "Y a‑t‑il un accompagnement ?",
      a: "Oui : lives mensuels, écoutes croisées, supervision douce, et publications collectives.",
    },
  ];
  return (
    <section id="faq" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Questions" title="FAQ" />
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-6 text-white/85 shadow-xl">
              <h4 className="font-serif text-lg text-white">{f.q}</h4>
              <p className="mt-2 text-sm">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-white/70">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm">© {new Date().getFullYear()} Madame Fantômes — Labo Fantôme</p>
          <div className="flex items-center gap-4 text-sm">
            <a href="https://www.instagram.com/madamefantomes" target="_blank" rel="noreferrer" className="hover:text-white">@madamefantomes</a>
            <a href="#" className="hover:text-white">Mentions légales</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Site() {
  // Charger une éventuelle note sauvegardée pour la démo Journal
  const initial = useMemo(() => (typeof window !== 'undefined' ? localStorage.getItem("labo_note") || "" : ""), []);
  const [boot, setBoot] = useState(false);

  React.useEffect(() => {
    setBoot(true);
  }, []);

  return (
    <div className="min-h-screen font-[ui-sans-serif,system-ui,Segoe_UI,Roboto,Helvetica,Arial] antialiased">
      <StarfieldBackground />
      <Navbar />
      <Hero />
      <LaboSection />
      <BooracleSection />
      <ParcoursSection />
      {/* Hydrate Journal with any initial note */}
      {boot && <JournalSection key={initial.length} />}
      <CommunitySection />
      <PricingSection />
      <FAQ />
      <Footer />
    </div>
  );
}
