// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
    }

    // Check if user already exists
    const existing = await db.selectFrom("users").where("email", "=", email).selectAll().executeTakeFirst();
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newId = crypto.randomUUID?.() ?? Date.now().toString();
    await db
      .insertInto("users")
      .values({ id: newId, name, email, password_hash: passwordHash })
      .execute();

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
