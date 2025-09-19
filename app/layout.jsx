// app/layout.jsx
import "./globals.css";
import localFont from "next/font/local";

const MisteriCaps = localFont({
  src: [{ path: "./fonts/MisteriCapsRegular.woff2", weight: "400", style: "normal" }],
  variable: "--font-title",
  display: "swap",
});

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
      {/* IMPORTANT : on applique les variables de police au body */}
      <body className={`${MisteriCaps.variable} ${OldEnglish.variable}`} style={{ margin: 0, background: "#0b0f1a", color: "white" }}>
        {children}
      </body>
    </html>
  );
}
