import { neon } from "@neondatabase/serverless";
import { hash } from "bcryptjs";

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  console.log("Creating tables...");

  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  console.log("Created admin_users table");

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      category VARCHAR(100) NOT NULL,
      description TEXT,
      sizes TEXT DEFAULT '39,40,41,42,43,44,45',
      colors TEXT DEFAULT '',
      in_stock BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  console.log("Created products table");

  await sql`
    CREATE TABLE IF NOT EXISTS product_images (
      id SERIAL PRIMARY KEY,
      product_id VARCHAR(50) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      image_url TEXT NOT NULL,
      sort_order INT DEFAULT 0,
      label VARCHAR(100) DEFAULT 'Side View'
    )
  `;
  console.log("Created product_images table");

  // Create default admin user with password 'admin123'
  const passwordHash = await hash("admin123", 10);
  
  const existing = await sql`SELECT id FROM admin_users WHERE username = 'admin'`;
  if (existing.length === 0) {
    await sql`
      INSERT INTO admin_users (username, password_hash)
      VALUES ('admin', ${passwordHash})
    `;
    console.log("Created default admin user (username: admin, password: admin123)");
  } else {
    console.log("Admin user already exists, skipping");
  }

  console.log("Migration complete!");
}

migrate().catch(console.error);
