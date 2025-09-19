// app/layout.jsx
import "./globals.css";
import localFont from "next/font/local";

// Titre (déjà en place)
const MisteriCaps = localFont({
  src: [{ path: "./fonts/MisteriCapsRegular.woff2", weight: "400", style: "normal" }],
  variable: "--font-title",
  display: "swap",
});

// Nouvelle police pour les phrases Old English
const OldEnglish = localFont({
  src: [{ path: "./fonts/Old_Englished_Boots.ttf", weight: "400", style: "normal" }],
  variable: "--font-oldenglish",
  display: "swap",
});

export const metadata = {
  title: "Le Labo Fantôme",
  description: "École TCI en ligne",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${MisteriCaps.variable} ${OldEnglish.variable}`}>
        {children}
      </body>
    </html>
  );
}
