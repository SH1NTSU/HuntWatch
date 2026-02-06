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
      `SELECT e.*,
              CASE WHEN ue.user_id IS NOT NULL THEN true ELSE false END as joined
       FROM volunteer_events e
       LEFT JOIN user_events ue ON e.id = ue.event_id AND ue.user_id = $1
       ORDER BY e.date ASC`,
      [userId]
    );

    return NextResponse.json(
      result.rows.map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        location: r.location,
        date: r.date,
        time: r.time,
        spotsLeft: r.spots_left,
        totalSpots: r.total_spots,
        scoreReward: r.score_reward,
        category: r.category,
        organizer: r.organizer,
        joined: r.joined,
      }))
    );
  } catch (err) {
    console.error("Events error:", err);
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

    const { eventId } = await req.json();

    await pool.query(
      `INSERT INTO user_events (user_id, event_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [payload.userId, eventId]
    );

    await pool.query(
      `UPDATE volunteer_events SET spots_left = GREATEST(0, spots_left - 1) WHERE id = $1`,
      [eventId]
    );

    await pool.query(
      `UPDATE users SET green_score = LEAST(100, green_score + 3) WHERE id = $1`,
      [payload.userId]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Join event error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
