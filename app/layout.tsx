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
            <Link
              href="/"
              className="text-2xl font-bold text-primary"
            >
              Flight App ✈️
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-muted hover:text-white transition"
              >
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
      </body>
    </html>
  );
}