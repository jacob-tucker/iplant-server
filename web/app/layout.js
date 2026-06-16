export const metadata = {
  title: "My Little Garden 🌿",
  description: "Live readings from the plant-reader, in a cozy garden.",
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
