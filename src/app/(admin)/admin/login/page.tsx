"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
	const [error, setError] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);
	const router = useRouter();
	async function onSubmit(formData: FormData) {
		setError(null);
		setBusy(true);
		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ email: formData.get("email"), password: formData.get("password") }),
			});
			if (res.ok) router.push("/admin/products"); else setError("Invalid credentials");
		} finally {
			setBusy(false);
		}
	}
	return (
		<main dir="ltr" lang="en" className="min-h-screen bg-dark flex items-center justify-center px-6">
			<form action={onSubmit} className="w-full max-w-sm bg-surface rounded-2xl shadow-xl p-8 space-y-4">
				<div className="text-center mb-2">
					<div className="text-2xl font-bold text-foreground">Hamadache Telecom</div>
					<div className="text-sm text-muted mt-1">Admin Panel</div>
				</div>
				<input name="email" type="email" required placeholder="Email" className="w-full bg-background border border-border rounded-lg px-4 py-3" />
				<input name="password" type="password" required placeholder="Password" className="w-full bg-background border border-border rounded-lg px-4 py-3" />
				<button disabled={busy} className="w-full bg-foreground hover:bg-foreground/90 text-white rounded-lg px-6 py-3 font-medium transition-colors disabled:opacity-50">
					{busy ? "Signing in…" : "Login"}
				</button>
				{error && <p className="text-sm text-red-500 text-center">{error}</p>}
			</form>
		</main>
	);
}
