import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get("category") || "neighborhood";

    const result = await pool.query(
      `SELECT id, name, avatar, score, change, location, workplace
       FROM leaderboard_entries
       WHERE category = $1
       ORDER BY score DESC`,
      [category]
    );

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("Leaderboard error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
