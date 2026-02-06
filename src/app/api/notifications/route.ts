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
      `SELECT id, type, message, from_user, time, read
       FROM notifications WHERE user_id = $1
       ORDER BY created_at DESC`,
      [payload.userId]
    );

    return NextResponse.json(
      result.rows.map((r) => ({
        id: r.id,
        type: r.type,
        message: r.message,
        from: r.from_user,
        time: r.time,
        read: r.read,
      }))
    );
  } catch (err) {
    console.error("Notifications error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const payload = verifyToken(authHeader.split(" ")[1]);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { notificationId, markAll } = await req.json();

    if (markAll) {
      await pool.query(
        `UPDATE notifications SET read = true WHERE user_id = $1`,
        [payload.userId]
      );
    } else if (notificationId) {
      await pool.query(
        `UPDATE notifications SET read = true WHERE id = $1 AND user_id = $2`,
        [notificationId, payload.userId]
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Notification update error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
