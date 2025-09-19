// app/layout.jsx
import "./globals.css";
import localFont from "next/font/local";

const MisteriCaps = localFont({
  src: "./fonts/MisteriCapsRegular.woff2",
  variable: "--font-title",
  display: "swap",
});

const OldEnglish = localFont({
  src: "./fonts/Old_Englished_Boots.ttf",
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
      <body
        className={`${MisteriCaps.variable} ${OldEnglish.variable}`}
        style={{
          margin: 0,
          background: "#0b0f1a",
          color: "white",
          cursor: 'url("/ghost-cursor.png") 16 16, auto', // 👻 Curseur fantôme global
        }}
      >
        {children}
      </body>
    </html>
  );
}
