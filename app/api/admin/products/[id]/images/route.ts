import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { put, del } from "@vercel/blob"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    const formData = await request.formData()
    const file = formData.get("image") as File | null
    const label = (formData.get("label") as string) || "View"

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 })
    }

    // Get current max sort order
    const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), -1) as max_order FROM product_images WHERE product_id = ${id}`
    const sortOrder = (maxOrder[0].max_order as number) + 1

    // Upload to Vercel Blob
    const blob = await put(`products/${id}/${Date.now()}-${file.name}`, file, {
      access: "public",
    })

    const imageUrl = blob.url

    await sql`
      INSERT INTO product_images (product_id, image_url, sort_order, label)
      VALUES (${id}, ${imageUrl}, ${sortOrder}, ${label})
    `

    return NextResponse.json({ success: true, image_url: imageUrl })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to upload image"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get("imageId")
    
    if (!imageId) {
      return NextResponse.json({ error: "Image ID required" }, { status: 400 })
    }

    const { id } = await params

    // Get the image URL before deleting so we can remove from Blob
    const images = await sql`SELECT image_url FROM product_images WHERE id = ${Number(imageId)} AND product_id = ${id}`
    if (images.length > 0 && images[0].image_url) {
      try {
        await del(images[0].image_url as string)
      } catch {
        // Continue even if blob deletion fails
      }
    }

    await sql`DELETE FROM product_images WHERE id = ${Number(imageId)} AND product_id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete image"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
