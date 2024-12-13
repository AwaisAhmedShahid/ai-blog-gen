import "react-day-picker/dist/style.css";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <Toaster richColors closeButton />
        {children}
      </body>
    </html>
  );
}
