import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, user_id, user_name, user_avatar, pledge, brand, start_date, days_kept, total_days, is_active, supporters, category
       FROM pledges ORDER BY created_at DESC`
    );

    return NextResponse.json(
      result.rows.map((r) => ({
        id: r.id,
        userId: r.user_id,
        userName: r.user_name,
        userAvatar: r.user_avatar,
        pledge: r.pledge,
        brand: r.brand,
        startDate: r.start_date,
        daysKept: r.days_kept,
        totalDays: r.total_days,
        isActive: r.is_active,
        supporters: r.supporters,
        category: r.category,
      }))
    );
  } catch (err) {
    console.error("Pledges error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const payload = verifyToken(authHeader.split(" ")[1]);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const user = await pool.query("SELECT name, avatar FROM users WHERE id = $1", [payload.userId]);
    if (user.rows.length === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const result = await pool.query(
      `INSERT INTO pledges (user_id, user_name, user_avatar, pledge, brand, total_days, category)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [payload.userId, user.rows[0].name, user.rows[0].avatar, body.pledge, body.brand || null, body.totalDays || 90, body.category || "General"]
    );

    await pool.query(
      `UPDATE users SET green_score = LEAST(100, green_score + 5) WHERE id = $1`,
      [payload.userId]
    );

    return NextResponse.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error("Add pledge error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
