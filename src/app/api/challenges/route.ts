import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    let userId: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      const payload = verifyToken(authHeader.split(" ")[1]);
      if (payload) userId = payload.userId;
    }

    const result = await pool.query(
      `SELECT c.*,
              CASE WHEN uc.user_id IS NOT NULL THEN true ELSE false END as joined
       FROM challenges c
       LEFT JOIN user_challenges uc ON c.id = uc.challenge_id AND uc.user_id = $1
       ORDER BY c.deadline ASC`,
      [userId]
    );

    return NextResponse.json(
      result.rows.map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        community: r.community,
        target: r.target,
        current: r.current,
        unit: r.unit,
        deadline: r.deadline,
        participants: r.participants,
        joined: r.joined,
        category: r.category,
      }))
    );
  } catch (err) {
    console.error("Challenges error:", err);
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

    const { challengeId } = await req.json();

    await pool.query(
      `INSERT INTO user_challenges (user_id, challenge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [payload.userId, challengeId]
    );

    await pool.query(
      `UPDATE challenges SET participants = participants + 1 WHERE id = $1`,
      [challengeId]
    );

    await pool.query(
      `UPDATE users SET green_score = LEAST(100, green_score + 2) WHERE id = $1`,
      [payload.userId]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Join challenge error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
