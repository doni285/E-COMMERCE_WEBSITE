import { sql } from "@/lib/db"

export interface Product {
  id: string
  name: string
  price: number
  description: string
  category: string
  images: string[]
  sizes: number[]
  colors: string[]
  in_stock: boolean
}

export async function getProducts(): Promise<Product[]> {
  const rows = await sql`
    SELECT p.*, 
      COALESCE(
        (SELECT json_agg(pi.image_url ORDER BY pi.sort_order) FROM product_images pi WHERE pi.product_id = p.id),
        '[]'::json
      ) as images
    FROM products p
    ORDER BY p.created_at DESC
  `
  return rows.map(mapRowToProduct)
}

export async function getProduct(id: string): Promise<Product | null> {
  const rows = await sql`
    SELECT p.*, 
      COALESCE(
        (SELECT json_agg(pi.image_url ORDER BY pi.sort_order) FROM product_images pi WHERE pi.product_id = p.id),
        '[]'::json
      ) as images
    FROM products p
    WHERE p.id = ${id}
  `
  if (rows.length === 0) return null
  return mapRowToProduct(rows[0])
}

function mapRowToProduct(row: Record<string, unknown>): Product {
  const sizes = typeof row.sizes === "string"
    ? (row.sizes as string).split(",").map(Number).filter(Boolean)
    : []
  const colors = typeof row.colors === "string"
    ? (row.colors as string).split(",").filter(Boolean)
    : []
  const images = Array.isArray(row.images) ? row.images as string[] : []

  return {
    id: row.id as string,
    name: row.name as string,
    price: Number(row.price),
    description: (row.description as string) || "",
    category: (row.category as string) || "",
    images,
    sizes,
    colors,
    in_stock: row.in_stock as boolean,
  }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price)
}
