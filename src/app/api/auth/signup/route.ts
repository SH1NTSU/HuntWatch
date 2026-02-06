import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Check if user exists
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const initials = name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name, avatar, location, workplace, green_score, weekly_score, streak, rank, total_members, trees_equivalent, co2_saved)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING id, email, name, avatar`,
      [email, passwordHash, name, initials, "Petaling Jaya", "", 50, 0, 0, 1000, 1200, 0, 0]
    );

    const user = result.rows[0];
    const token = signToken({ userId: user.id, email: user.email });

    // Seed default notifications for new user
    await pool.query(
      `INSERT INTO notifications (user_id, type, message, time, read)
       VALUES ($1, 'achievement', 'Welcome to HijauKita! Start your green journey 🌱', 'Just now', false)`,
      [user.id]
    );

    // Seed default impact data
    const months = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
    for (const m of months) {
      await pool.query(
        `INSERT INTO impact_data (user_id, month, your_impact, neighbor_avg, city_avg)
         VALUES ($1, $2, $3, $4, $5)`,
        [user.id, m, 0, 1.5, 2.5]
      );
    }

    return NextResponse.json({ token, user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar } });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
