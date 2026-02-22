// Database-backed site settings with fallback defaults
import { sql } from "@/lib/db"

export type SiteSettings = {
  // Contact
  phone: string
  email: string
  instagram_handle: string
  whatsapp_number: string
  location: string

  // Content
  hero_tagline: string
  hero_subtitle: string
  about_heading: string
  about_paragraph_1: string
  about_paragraph_2: string
  about_paragraph_3: string
  stat_authentic: string
  stat_states: string
  stat_customers: string

  // Delivery
  delivery_info: string

  // Theme
  theme_color: string
}

const DEFAULTS: SiteSettings = {
  phone: "+234 XXX XXX XXXX",
  email: "info@davidmollanni.com",
  instagram_handle: "@davidmollanni",
  whatsapp_number: "+2348000000000",
  location: "Lagos, Nigeria",
  hero_tagline: "Step ahead... Premium handmade footwear crafted with passion and precision.",
  hero_subtitle: "David Mollanni",
  about_heading: "Quality Handmade Shoe Maker",
  about_paragraph_1:
    "Welcome to David Mollanni, where we specialize in creating stylish and comfortable footwear for every occasion. Our collection includes a variety of shoes, sandals, and slippers, each meticulously crafted with quality materials and attention to detail.",
  about_paragraph_2:
    "At David Mollanni, we believe that great footwear should not only look good but also feel amazing to wear. Whether you're dressing up for a special event, enjoying a casual day out, or unwinding at home, our designs offer both style and comfort.",
  about_paragraph_3:
    "Explore our range and discover the perfect pair that fits your lifestyle. Welcome to David Mollanni, where quality meets craftsmanship in every step you take.",
  stat_authentic: "100%",
  stat_states: "36+",
  stat_customers: "500+",
  delivery_info: "We deliver nationwide across all 36 states in Nigeria. Orders are typically processed within 24-48 hours.",
  theme_color: "lime",
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const rows = await sql`SELECT key, value FROM site_settings`
    const settings = { ...DEFAULTS }

    for (const row of rows) {
      const key = row.key as keyof SiteSettings
      if (key in settings) {
        settings[key] = row.value
      }
    }
    return settings
  } catch {
    return DEFAULTS
  }
}

export async function getSetting(key: string): Promise<string> {
  try {
    const rows = await sql`SELECT value FROM site_settings WHERE key = ${key}`
    if (rows.length > 0) return rows[0].value
    return DEFAULTS[key as keyof SiteSettings] || ""
  } catch {
    return DEFAULTS[key as keyof SiteSettings] || ""
  }
}
