import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const sans = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Hamadache Telecom",
	description: "Hamadache Telecom e-commerce",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
		<html lang="ar" dir="rtl" className={sans.className}>
			<body className="antialiased">
				<Providers>{children}</Providers>
      </body>
    </html>
  );
}
