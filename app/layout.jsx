// app/layout.jsx
import localFont from "next/font/local";

const MisteriCaps = localFont({
  src: "./fonts/MisteriCapsRegular.woff2",
  variable: "--font-title",
  weight: "400",
  display: "swap",
});

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
        {/* Précharge les deux curseurs pour éviter le clignotement */}
        <link rel="preload" as="image" href="/ghost-cursor.png" />
        <link rel="preload" as="image" href="/ghost-cursor-glow.png" />
        <style>{`
          :root { color-scheme: dark; }
          html, body { margin: 0; background:#0b0f1a; color:#ffffff; }

          /* 👻 Curseur fantôme par défaut partout */
          html, body, * {
            cursor: url('/ghost-cursor.png') 16 16, auto !important;
          }

          /* États cliquables → curseur lumineux */
          a:hover,
          button:hover,
          [role="button"]:hover,
          label:hover,
          summary:hover,
          .clickable:hover {
            cursor: url('/ghost-cursor-glow.png') 16 16, pointer !important;
          }

          /* Navigation clavier : curseur lumineux aussi */
          a:focus-visible,
          button:focus-visible,
          [role="button"]:focus-visible,
          label:focus-visible,
          summary:focus-visible,
          .clickable:focus-visible {
            cursor: url('/ghost-cursor-glow.png') 16 16, pointer !important;
          }

          /* Zones de saisie : garde l'I-beam en fallback pour la sélection */
          input, textarea, [contenteditable="true"] {
            cursor: url('/ghost-cursor.png') 16 16, text !important;
          }

          /* Images: rendu propre par défaut */
          img { max-width:100%; height:auto; display:block; }
        `}</style>
      </head>
      <body className={`${MisteriCaps.variable} ${OldEnglish.variable}`}>
        {children}
      </body>
    </html>
  );
}
