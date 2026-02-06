import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: {
      DATABASE_URL: process.env.DATABASE_URL ? "✅ Set" : "❌ Missing",
      JWT_SECRET: process.env.JWT_SECRET ? "✅ Set" : "❌ Missing",
      NODE_ENV: process.env.NODE_ENV,
    },
    database: {
      connected: false,
      error: null as string | null,
    },
  };

  // Test database connection
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    client.release();

    health.database.connected = true;
    health.database.error = null;
  } catch (error) {
    health.database.connected = false;
    health.database.error = error instanceof Error ? error.message : String(error);
    health.status = "error";
  }

  return NextResponse.json(health, {
    status: health.status === "ok" ? 200 : 500
  });
}
