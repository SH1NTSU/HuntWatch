import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const result = await pool.query(
      `SELECT id, email, name, avatar, location, workplace, age_group, green_score, weekly_score, streak, rank, total_members, joined_date, trees_equivalent, co2_saved
       FROM users WHERE id = $1`,
      [payload.userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const u = result.rows[0];
    return NextResponse.json({
      id: u.id,
      name: u.name,
      email: u.email,
      avatar: u.avatar,
      location: u.location,
      workplace: u.workplace,
      ageGroup: u.age_group,
      greenScore: u.green_score,
      weeklyScore: u.weekly_score,
      streak: u.streak,
      rank: u.rank,
      totalMembers: u.total_members,
      joinedDate: u.joined_date,
      treesEquivalent: u.trees_equivalent,
      co2Saved: u.co2_saved,
    });
  } catch (err) {
    console.error("Me error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
