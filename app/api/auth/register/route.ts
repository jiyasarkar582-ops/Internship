export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Check if user already exists
    const existing = await db.get(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newId = crypto.randomUUID();

    await db.run(
      "INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)",
      [newId, name, email, passwordHash]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
