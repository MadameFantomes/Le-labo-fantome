// app/layout.jsx
import localFont from "next/font/local";

// Police TITRE (Misteri Caps)
const MisteriCaps = localFont({
  src: "./fonts/MisteriCapsRegular.woff2",
  variable: "--font-title",
  weight: "400",
  display: "swap",
});

// Police Old English (sous-titres / textes décoratifs)
const OldEnglish = localFont({
  src: "./fonts/Old_Englished_Boots.ttf",
  variable: "--font-oldenglish",
  weight: "400",
  display: "swap",
});

export const metadata = {
  title: "Le Labo Fantôme",
  description: "École TCI en ligne",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        {/* Curseur fantôme global + quelques fallbacks utiles */}
        <style>{`
          :root { color-scheme: dark; }

          html, body {
            margin: 0;
            background: #0b0f1a;
            color: #ffffff;
            /* 👻 curseur fantôme global (hotspot centré, ajuste si besoin) */
            cursor: url('/ghost-cursor.png') 16 16, auto;
          }

          /* Tous les éléments par défaut héritent du curseur fantôme */
          * { cursor: url('/ghost-cursor.png') 16 16, auto; }

          /* Eléments cliquables : garder "pointer" en fallback */
          a, button, [role="button"], label {
            cursor: url('/ghost-cursor.png') 16 16, pointer !important;
          }

          /* Zones de texte : garder l'I-beam en fallback pour la sélection */
          input, textarea, [contenteditable="true"] {
            cursor: url('/ghost-cursor.png') 16 16, text !important;
          }

          /* Améliore le rendu des images pleine largeur si besoin */
          img { max-width: 100%; height: auto; display: block; }
        `}</style>
      </head>
      <body className={`${MisteriCaps.variable} ${OldEnglish.variable}`}>
        {children}
      </body>
    </html>
  );
}
