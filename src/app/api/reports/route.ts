import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, user_name, location, lat, lng, description, date, status, upvotes, image_url
       FROM deforestation_reports ORDER BY date DESC`
    );

    return NextResponse.json(
      result.rows.map((r) => ({
        id: r.id,
        userId: r.user_id,
        userName: r.user_name,
        location: r.location,
        coordinates: { lat: r.lat, lng: r.lng },
        description: r.description,
        date: r.date,
        status: r.status,
        upvotes: r.upvotes,
        imageUrl: r.image_url,
      }))
    );
  } catch (err) {
    console.error("Reports error:", err);
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
    const user = await pool.query("SELECT name FROM users WHERE id = $1", [payload.userId]);

    await pool.query(
      `INSERT INTO deforestation_reports (user_id, user_name, location, lat, lng, description)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [payload.userId, user.rows[0].name, body.location, body.lat || 0, body.lng || 0, body.description]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Report error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
