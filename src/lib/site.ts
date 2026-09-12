export const SITE = {
	name: "Hamadache Telecom",
	phone: "+213 XXX XX XX XX", // TODO: replace with real phone number
	whatsapp: "213XXXXXXXXX", // TODO: replace with real WhatsApp number (international format, no + or spaces)
	address: "Boumerdès, Algérie", // TODO: replace with real street address
	city: "Boumerdès",
	facebook: "#", // TODO: replace with real Facebook page URL
	instagram: "#", // TODO: replace with real Instagram profile URL
};

export function whatsappLink(message?: string) {
	const base = `https://wa.me/${SITE.whatsapp}`;
	return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const CATEGORIES = [
	{ slug: "smartphones", icon: "📱", labelKey: "category_smartphones" },
	{ slug: "chargers", icon: "🔋", labelKey: "category_chargers" },
	{ slug: "accessories", icon: "🎧", labelKey: "category_accessories" },
	{ slug: "protection", icon: "🛡", labelKey: "category_protection" },
] as const;
