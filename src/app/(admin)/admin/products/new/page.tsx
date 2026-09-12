"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";

type Image = { url: string; width: number; height: number; alt: string };

function slugify(input: string) {
	return input
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
}

const inputClass = "w-full bg-surface-muted rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-foreground/20";
const labelClass = "text-sm font-medium mb-1.5 block";

export default function NewProductPage() {
	const router = useRouter();
	const [status, setStatus] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);
	const [form, setForm] = useState({ slug: "", name: "", description: "", priceCents: 0, compareAtPriceCents: "", category: "", brand: "", condition: "new", sizes: "64GB,128GB,256GB", colors: "Black,White", inStock: true });
	const [images, setImages] = useState<Image[]>([]);

	function onNameChange(v: string) {
		setForm((prev) => ({ ...prev, name: v, slug: prev.slug ? prev.slug : slugify(v) }));
	}

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setStatus(null);
		setBusy(true);
		try {
			const payload = {
				slug: form.slug || slugify(form.name),
				name: form.name,
				description: form.description,
				priceCents: Number(form.priceCents),
				compareAtPriceCents: form.compareAtPriceCents ? Number(form.compareAtPriceCents) : null,
				category: form.category,
				brand: form.brand,
				condition: form.condition,
				sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
				colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
				inStock: form.inStock,
				images,
			};
			const res = await fetch(`/api/products`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
			if (res.ok) {
				setStatus("Created");
				router.push("/admin/products");
				router.refresh();
			} else {
				const data = await res.json().catch(() => ({}));
				setStatus(data?.error ? String(data.error) : "Failed");
			}
		} finally {
			setBusy(false);
		}
	}

	return (
		<main className="min-h-screen px-4 md:px-10 py-10">
			<h1 className="text-3xl font-bold mb-8">New Product</h1>
			<form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-6 max-w-4xl">
				<label>
					<span className={labelClass}>Slug</span>
					<input value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} name="slug" placeholder="auto-generated from name" className={inputClass} />
				</label>
				<label>
					<span className={labelClass}>Name</span>
					<input value={form.name} onChange={(e) => onNameChange(e.target.value)} name="name" required className={inputClass} />
				</label>
				<label>
					<span className={labelClass}>Price (DA)</span>
					<input value={form.priceCents} onChange={(e) => setForm({ ...form, priceCents: Number(e.target.value) })} name="priceCents" type="number" required className={inputClass} />
				</label>
				<label>
					<span className={labelClass}>Original price (optional, for sale strike-through)</span>
					<input value={form.compareAtPriceCents} onChange={(e) => setForm({ ...form, compareAtPriceCents: e.target.value })} name="compareAtPriceCents" type="number" className={inputClass} />
				</label>
				<label>
					<span className={labelClass}>Category</span>
					<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} name="category" required className={inputClass}>
						<option value="">Select category</option>
						<option value="smartphones">Smartphones</option>
						<option value="chargers">Chargers & Cables</option>
						<option value="accessories">Accessories & Audio</option>
						<option value="protection">Cases & Protection</option>
					</select>
				</label>
				<label>
					<span className={labelClass}>Brand</span>
					<input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} name="brand" placeholder="e.g. Samsung, Apple, POCO" required className={inputClass} />
				</label>
				<label>
					<span className={labelClass}>Condition</span>
					<select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} name="condition" className={inputClass}>
						<option value="new">New</option>
						<option value="used">Used</option>
					</select>
				</label>
				<label className="flex items-center gap-2 mt-7">
					<input checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} type="checkbox" name="inStock" />
					<span className="text-sm">In stock</span>
				</label>
				<label>
					<span className={labelClass}>Storage / variants (comma separated)</span>
					<input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} name="sizes" className={inputClass} />
				</label>
				<label>
					<span className={labelClass}>Colors (comma separated)</span>
					<input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} name="colors" className={inputClass} />
				</label>
				<div className="md:col-span-2">
					<span className={labelClass}>Images</span>
					<ImageUploader value={images} onChange={setImages} />
				</div>
				<label className="md:col-span-2">
					<span className={labelClass}>Description</span>
					<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} name="description" required className={`${inputClass} h-32`} />
				</label>
				<div className="md:col-span-2 flex items-center gap-4">
					<button disabled={busy} type="submit" className="bg-foreground hover:bg-foreground/90 text-white rounded-lg px-6 py-2.5 font-medium transition-colors disabled:opacity-50">
						{busy ? "Creating…" : "Create"}
					</button>
					{status && <p className="text-sm text-muted">{status}</p>}
				</div>
			</form>
		</main>
	);
}
