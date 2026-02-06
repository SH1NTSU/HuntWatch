import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const payload = verifyToken(authHeader.split(" ")[1]);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const result = await pool.query(
      `SELECT month, your_impact, neighbor_avg, city_avg
       FROM impact_data WHERE user_id = $1
       ORDER BY id ASC`,
      [payload.userId]
    );

    return NextResponse.json(
      result.rows.map((r) => ({
        month: r.month,
        yourImpact: r.your_impact,
        neighborAvg: r.neighbor_avg,
        cityAvg: r.city_avg,
      }))
    );
  } catch (err) {
    console.error("Impact error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
