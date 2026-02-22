import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const sql = neon(process.env.DATABASE_URL);

async function main() {
  // Create a proper bcrypt hash for 'admin123'
  const password = "admin123";
  const hash = await bcrypt.hash(password, 10);
  
  console.log("Generated hash for admin123:", hash);

  // Delete old admin user and insert with proper hash
  await sql`DELETE FROM admin_users WHERE username = 'admin'`;
  await sql`INSERT INTO admin_users (username, password_hash) VALUES ('admin', ${hash})`;
  
  console.log("Admin user seeded successfully!");
  console.log("Username: admin");
  console.log("Password: admin123");
}

main().catch(console.error);
