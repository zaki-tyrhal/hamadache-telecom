"use client";
import { useState } from "react";

type Image = { url: string; width: number; height: number; alt: string };

type Props = {
	value: Image[];
	onChange: (images: Image[]) => void;
};

export default function ImageUploader({ value, onChange }: Props) {
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleFiles(files: FileList | null) {
		if (!files || files.length === 0) return;
		setBusy(true);
		setError(null);
		try {
			const sigRes = await fetch("/api/upload/sign");
			if (!sigRes.ok) {
				const data = await sigRes.json().catch(() => ({}));
				setError(data?.error || "Could not get upload signature");
				return;
			}
			const { cloudName, apiKey, timestamp, signature, folder } = await sigRes.json();
			const uploads: Image[] = [];
			const failed: string[] = [];
			for (const file of Array.from(files)) {
				const form = new FormData();
				form.append("file", file);
				form.append("api_key", apiKey);
				form.append("timestamp", String(timestamp));
				form.append("signature", signature);
				form.append("folder", folder);
				const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
					method: "POST",
					body: form,
				});
				if (!res.ok) {
					failed.push(file.name);
					continue;
				}
				const data = await res.json();
				uploads.push({ url: data.secure_url, width: data.width, height: data.height, alt: file.name });
			}
			if (failed.length > 0) setError(`Failed to upload: ${failed.join(", ")}`);
			if (uploads.length > 0) onChange([...(value || []), ...uploads]);
		} catch {
			setError("Upload failed. Check your connection and try again.");
		} finally {
			setBusy(false);
		}
	}

	function removeAt(i: number) {
		const next = [...value];
		next.splice(i, 1);
		onChange(next);
	}

	function setAlt(i: number, alt: string) {
		const next = [...value];
		next[i] = { ...next[i], alt };
		onChange(next);
	}

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-3">
				<input type="file" multiple accept="image/*" onChange={(e) => handleFiles(e.target.files)} className="text-sm" />
				{busy && <span className="text-xs text-muted">Uploading…</span>}
			</div>
			{error && <p className="text-sm text-red-500">{error}</p>}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
				{value?.map((img, i) => (
					<div key={i} className="border border-border rounded-lg p-2 bg-surface-muted">
						<img src={img.url} alt={img.alt} className="w-full h-32 object-contain rounded" />
						<input
							value={img.alt}
							onChange={(e) => setAlt(i, e.target.value)}
							placeholder="Alt text"
							className="mt-2 w-full bg-background border border-border rounded px-2 py-1 text-xs"
						/>
						<button type="button" onClick={() => removeAt(i)} className="mt-2 w-full border border-border rounded px-2 py-1 text-xs hover:bg-foreground hover:text-white transition-colors">Remove</button>
					</div>
				))}
			</div>
		</div>
	);
}
