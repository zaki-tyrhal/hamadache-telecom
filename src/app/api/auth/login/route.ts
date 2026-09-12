import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { createJwt, setAuthCookie, verifyPassword, hashPassword } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({ email: z.string().email(), password: z.string().min(8) });

export async function POST(req: NextRequest) {
	const body = await req.json();
	const parsed = schema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
	}
	const email = parsed.data.email.trim().toLowerCase();
	const { password } = parsed.data;

	const allAdmins = await db.select().from(admins).all();
	const admin = allAdmins.find((a) => a.email.trim().toLowerCase() === email);

	// One-time bootstrap: only when no admin exists yet at all.
	if (!admin && allAdmins.length === 0) {
		const envEmail = (process.env.ADMIN_EMAIL || "admin@amigo.com").trim().toLowerCase();
		const envPass = (process.env.ADMIN_PASSWORD || "ChangeMe_123").trim();
		if (email === envEmail && password === envPass) {
			const passwordHash = await hashPassword(envPass);
			const res = await db.insert(admins).values({ email: envEmail, passwordHash }).run();
			const id = Number(res?.lastInsertRowid ?? 0);
			const token = await createJwt({ sub: String(id), email: envEmail });
			await setAuthCookie(token);
			return NextResponse.json({ ok: true });
		}
		return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
	}

	if (!admin) {
		return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
	}

	const ok = await verifyPassword(password, admin.passwordHash);
	if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

	const token = await createJwt({ sub: String(admin.id), email: admin.email });
	await setAuthCookie(token);
	return NextResponse.json({ ok: true });
}
