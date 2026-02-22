import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const rows = await sql`SELECT key, value FROM site_settings ORDER BY key`
    const settings: Record<string, string> = {}
    for (const row of rows) {
      settings[row.key as string] = row.value as string
    }
    return NextResponse.json(settings)
  } catch (error) {
    console.error("[v0] Settings GET error:", error)
    return NextResponse.json({}, { status: 200 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { settings } = body as { settings: Record<string, string> }

    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ error: "Invalid settings" }, { status: 400 })
    }

    for (const [key, value] of Object.entries(settings)) {
      await sql`
        INSERT INTO site_settings (key, value)
        VALUES (${key}, ${value})
        ON CONFLICT (key) DO UPDATE SET value = ${value}, updated_at = NOW()
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Settings PUT error:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
