-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  sizes TEXT DEFAULT '39,40,41,42,43,44,45',
  colors TEXT DEFAULT '',
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create product_images table (multiple images per product for different angles)
CREATE TABLE IF NOT EXISTS product_images (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(50) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  label VARCHAR(100) DEFAULT 'Side View'
);

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
  ('phone', '+234 XXX XXX XXXX'),
  ('email', 'info@davidmollanni.com'),
  ('instagram_handle', '@davidmollanni'),
  ('whatsapp_number', '+2348000000000'),
  ('location', 'Lagos, Nigeria'),
  ('hero_tagline', 'Step ahead... Premium handmade footwear crafted with passion and precision.'),
  ('hero_subtitle', 'David Mollanni'),
  ('about_heading', 'Quality Handmade Shoe Maker'),
  ('about_paragraph_1', 'Welcome to David Mollanni, where we specialize in creating stylish and comfortable footwear for every occasion.'),
  ('about_paragraph_2', 'At David Mollanni, we believe that great footwear should not only look good but also feel amazing to wear.'),
  ('about_paragraph_3', 'Explore our range and discover the perfect pair that fits your lifestyle.'),
  ('stat_authentic', '100%'),
  ('stat_states', '36+'),
  ('stat_customers', '500+'),
  ('delivery_info', 'We deliver nationwide across all 36 states in Nigeria. Orders are typically processed within 24-48 hours.'),
  ('theme_color', 'lime')
ON CONFLICT (key) DO NOTHING;

-- Insert default admin user (password: admin123 - should be changed after first login)
-- bcrypt hash for 'admin123'
INSERT INTO admin_users (username, password_hash)
VALUES ('admin', '$2b$10$rQZmGQqE9QZQZQZQZQZQO.PLACEHOLDER')
ON CONFLICT (username) DO NOTHING;
