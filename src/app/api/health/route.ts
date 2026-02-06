import { NextResponse } from "next/server";

export async function GET() {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: {
      DATABASE_URL: process.env.DATABASE_URL ? "✅ Set (length: " + process.env.DATABASE_URL.length + ")" : "❌ Missing",
      JWT_SECRET: process.env.JWT_SECRET ? "✅ Set" : "❌ Missing",
      NODE_ENV: process.env.NODE_ENV,
    },
    database: {
      connected: false,
      error: null as string | null,
      poolImport: "not attempted",
    },
  };

  // Test database connection
  try {
    // Import pool here to catch any import errors
    const { default: pool } = await import("@/lib/db");
    health.database.poolImport = "success";

    const client = await pool.connect();
    const result = await client.query("SELECT NOW() as time");
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
