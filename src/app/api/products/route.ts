import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, name, brand, sustainability_score, deforestation_risk, palm_oil_free, certifications, alternatives, image_url
       FROM products ORDER BY name ASC`
    );

    return NextResponse.json(
      result.rows.map((r) => ({
        id: r.id,
        name: r.name,
        brand: r.brand,
        sustainabilityScore: r.sustainability_score,
        deforestationRisk: r.deforestation_risk,
        palmOilFree: r.palm_oil_free,
        certifications: r.certifications,
        alternatives: r.alternatives,
        imageUrl: r.image_url,
      }))
    );
  } catch (err) {
    console.error("Products error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
