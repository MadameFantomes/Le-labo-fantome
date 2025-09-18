// app/layout.jsx
import "./globals.css";
import localFont from "next/font/local";

const MisteriCaps = localFont({
  src: [{ path: "./fonts/MisteriCapsRegular.woff2", weight: "400", style: "normal" }],
  variable: "--font-title",
  display: "swap",
});

export const metadata = {
  title: "Le Labo Fantôme",
  description: "École TCI en ligne",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={MisteriCaps.variable} style={{ margin: 0, background: "#0b0f1a", color: "white" }}>
        {children}
      </body>
    </html>
  );
}
