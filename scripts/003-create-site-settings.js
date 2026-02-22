import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  // Create site_settings table
  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  console.log("Created site_settings table");

  // Seed with default values
  const defaults = [
    ["phone_number", "+234 000 000 0000"],
    ["email", "info@davidmollanni.com"],
    ["instagram_handle", "@davidmollanni"],
    ["whatsapp_number", "2340000000000"],
    ["location", "Lagos, Nigeria"],
    ["delivery_info", "We deliver nationwide across all 36 states in Nigeria. Delivery typically takes 2-5 business days depending on your location."],
    ["hero_tagline", "Step ahead... Premium handmade footwear crafted with passion and precision."],
    ["about_title", "Quality Handmade Shoe Maker"],
    ["about_paragraph_1", "Welcome to David Mollanni, where we specialize in creating stylish and comfortable footwear for every occasion. Our collection includes a variety of shoes, sandals, and slippers, each meticulously crafted with quality materials and attention to detail."],
    ["about_paragraph_2", "At David Mollanni, we believe that great footwear should not only look good but also feel amazing to wear. Whether you're dressing up for a special event, enjoying a casual day out, or unwinding at home, our designs offer both style and comfort."],
    ["about_paragraph_3", "Explore our range and discover the perfect pair that fits your lifestyle. Welcome to David Mollanni, where quality meets craftsmanship in every step you take."],
    ["stat_1_value", "100%"],
    ["stat_1_label", "Authentic"],
    ["stat_2_value", "36+"],
    ["stat_2_label", "States Covered"],
    ["stat_3_value", "500+"],
    ["stat_3_label", "Happy Customers"],
    ["primary_color", "lime"],
  ];

  for (const [key, value] of defaults) {
    await sql`
      INSERT INTO site_settings (key, value)
      VALUES (${key}, ${value})
      ON CONFLICT (key) DO NOTHING
    `;
  }
  console.log(`Seeded ${defaults.length} default settings`);
  console.log("Done!");
}

migrate().catch(console.error);
