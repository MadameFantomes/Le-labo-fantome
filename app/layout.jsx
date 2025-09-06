export const metadata = { title: "Labo Fantôme — École Mystique" };

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: "#0b0f1a", color: "white" }}>
        {children}
      </body>
    </html>
  );
}
