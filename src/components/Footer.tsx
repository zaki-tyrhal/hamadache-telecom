"use client";
import { useTranslations } from "next-intl";
import { SITE, whatsappLink } from "@/lib/site";

export default function Footer() {
	const t = useTranslations();
	return (
		<footer id="contact" className="mt-20 bg-dark text-white/60">
			<div className="px-4 md:px-10 py-14 grid gap-10 md:grid-cols-3 text-sm">
				<div>
					<div className="text-white font-bold text-xl mb-4">{t("brand")}</div>
					<p className="max-w-xs">{t("tagline")}</p>
				</div>
				<div>
					<div className="text-white font-semibold mb-4">{t("contact_title")}</div>
					<ul className="space-y-3">
						<li><a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hover:text-white transition-colors">{SITE.phone}</a></li>
						<li><a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a></li>
						<li>{SITE.address}</li>
					</ul>
				</div>
				<div>
					<div className="text-white font-semibold mb-4">{t("follow_us")}</div>
					<ul className="space-y-3">
						<li><a href={SITE.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a></li>
						<li><a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a></li>
					</ul>
				</div>
			</div>
			<div className="border-t border-white/10 px-4 md:px-10 py-6 flex items-center justify-between text-xs">
				<span>© {new Date().getFullYear()} {t("brand")}</span>
			</div>
		</footer>
	);
}
