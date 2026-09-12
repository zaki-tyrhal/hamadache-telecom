import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HtmlAttributes from "@/components/HtmlAttributes";
export const metadata: Metadata = {
	title: "Hamadache Telecom",
	description: "Hamadache Telecom - هواتف، إكسسوارات وشواحن بأفضل الأسعار في بومرداس",
};

export const locales = ["fr", "en", "ar"] as const;
export type Locale = (typeof locales)[number];

async function getMessages(locale: string) {
	try {
		const messages = (await import(`@/locales/${locale}/common.json`)).default;
		return messages;
	} catch (error) {
		return null;
	}
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	if (!locales.includes(locale as Locale)) notFound();
	const messages = await getMessages(locale);
	if (!messages) notFound();
	const dir = locale === "ar" ? "rtl" : "ltr";
	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			<HtmlAttributes locale={locale} dir={dir} />
			<Navbar />
			{children}
			<Footer />
		</NextIntlClientProvider>
	);
} 