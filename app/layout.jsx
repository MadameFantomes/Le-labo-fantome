import './globals.css'

export const metadata = {
  title: 'Le Labo Fantômes',
  description: 'Formation TCI, outils et oracles poétiques.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-[#0b0f1a] text-zinc-100">
        {/* Fond */}
        <div className="fixed inset-0 -z-10">
          <img src="/background.png" className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
            style={{ backgroundImage: "url('/paper.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        </div>
        {children}
      </body>
    </html>
  )
}
