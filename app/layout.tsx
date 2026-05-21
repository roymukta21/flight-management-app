import Link from "next/link";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav className="border-b border-zinc-800 bg-card">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              Flight App ✈️
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/" className="text-muted hover:text-white transition">
                Flights
              </Link>

              <Link
                href="/bookings"
                className="text-muted hover:text-white transition"
              >
                Bookings
              </Link>
            </div>
          </div>
        </nav>

        {children}

        <footer className="mt-16 border-t border-zinc-800">
          <div className="max-w-6xl mx-auto px-6 py-14 flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl font-bold text-primary mb-3">
              Flight App ✈️
            </h2>

            <p className="text-muted max-w-md mb-8">
              Book flights easily and manage your journey with a modern airline
              experience.
            </p>

            <div className="flex items-center gap-8 text-sm text-muted mb-8">
              <Link href="/" className="hover:text-white transition">
                Homepage
              </Link>

              <a href="/bookings" className="hover:text-white transition">
                Bookings
              </a>

              <a href="#" className="hover:text-white transition">
                Services
              </a>

              <a href="#" className="hover:text-white transition">
                Contact
              </a>
            </div>

            <div className="flex items-center gap-5 text-2xl text-muted">
              <a href="#" className="hover:text-primary transition">
                ✈️
              </a>

              <a href="#" className="hover:text-primary transition">
                🌍
              </a>

              <a href="#" className="hover:text-primary transition">
                📍
              </a>

              <a href="#" className="hover:text-primary transition">
                ☁️
              </a>
            </div>

            <p className="text-xs text-zinc-600 mt-10">
              © 2026 Flight App. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
