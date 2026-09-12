"use client";
import { create } from "zustand";
import { get as idbGet, set as idbSet } from "idb-keyval";

type CartItem = {
	productId: number;
	slug: string;
	name: string;
	priceCents: number;
	qty: number;
	size?: string;
	color?: string;
	imageUrl?: string;
};

type CartState = {
	items: CartItem[];
	hydrated: boolean;
	addItem: (item: CartItem) => void;
	removeItem: (productId: number, size?: string, color?: string) => void;
	updateQty: (productId: number, size: string | undefined, color: string | undefined, qty: number) => void;
	clear: () => void;
	load: () => Promise<void>;
};

const STORAGE_KEY = "amigo_cart";

function matches(item: CartItem, productId: number, size?: string, color?: string) {
	return item.productId === productId && item.size === size && item.color === color;
}

export const useCartStore = create<CartState>((set, get) => ({
	items: [],
	hydrated: false,
	addItem: (item) => {
		const items = [...get().items];
		const idx = items.findIndex((i) => matches(i, item.productId, item.size, item.color));
		if (idx >= 0) items[idx] = { ...items[idx], qty: items[idx].qty + item.qty }; else items.push(item);
		set({ items });
		void idbSet(STORAGE_KEY, items);
	},
	removeItem: (productId, size, color) => {
		const items = get().items.filter((i) => !matches(i, productId, size, color));
		set({ items });
		void idbSet(STORAGE_KEY, items);
	},
	updateQty: (productId, size, color, qty) => {
		const clamped = Math.max(1, Math.min(99, qty));
		const items = get().items.map((i) => (matches(i, productId, size, color) ? { ...i, qty: clamped } : i));
		set({ items });
		void idbSet(STORAGE_KEY, items);
	},
	clear: () => {
		set({ items: [] });
		void idbSet(STORAGE_KEY, []);
	},
	load: async () => {
		const saved = (await idbGet(STORAGE_KEY)) as CartItem[] | undefined;
		if (Array.isArray(saved)) set({ items: saved, hydrated: true }); else set({ hydrated: true });
	},
}));
