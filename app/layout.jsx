export const metadata = { title: "Le Labo Fantôme" };

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: "#0b0f1a", color: "white" }}>
        {children}
      </body>
    </html>
  );
}
