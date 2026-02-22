import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const products = await sql`
    SELECT p.*, 
      COALESCE(
        (SELECT json_agg(json_build_object('id', pi.id, 'image_url', pi.image_url, 'sort_order', pi.sort_order, 'label', pi.label) ORDER BY pi.sort_order) FROM product_images pi WHERE pi.product_id = p.id),
        '[]'::json
      ) as images
    FROM products p
    ORDER BY p.created_at DESC
  `
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const { name, price, description, category, sizes, colors, in_stock } = body

    if (!name || !price) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 })
    }

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

    await sql`
      INSERT INTO products (id, name, price, description, category, sizes, colors, in_stock)
      VALUES (${id}, ${name}, ${price}, ${description || ""}, ${category || ""}, ${sizes || ""}, ${colors || ""}, ${in_stock !== false})
    `

    return NextResponse.json({ id, success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create product"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
