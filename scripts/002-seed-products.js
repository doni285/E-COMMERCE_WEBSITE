import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const products = [
  {
    name: "Classic Oxford",
    price: 85000,
    description: "A timeless handmade brown leather oxford, crafted with precision stitching and premium full-grain leather. Perfect for formal occasions and professional settings.",
    category: "Oxford",
    sizes: [39, 40, 41, 42, 43, 44, 45],
    colors: ["Brown"],
    featured: true,
    details: ["Full-grain premium leather upper", "Hand-stitched Goodyear welt construction", "Leather sole with rubber heel insert", "Cushioned insole for all-day comfort", "Made in Nigeria"],
    images: ["/images/products/oxford-brown-1.jpg", "/images/products/oxford-brown-2.jpg", "/images/products/oxford-brown-3.jpg", "/images/products/oxford-brown-4.jpg"],
  },
  {
    name: "Penny Loafer",
    price: 72000,
    description: "An elegant handmade black penny loafer that blends classic style with modern comfort. Slip-on design with meticulous craftsmanship in every stitch.",
    category: "Loafer",
    sizes: [39, 40, 41, 42, 43, 44, 45],
    colors: ["Black"],
    featured: true,
    details: ["Smooth premium leather upper", "Classic penny slot detail", "Blake-stitched construction", "Padded leather insole", "Made in Nigeria"],
    images: ["/images/products/loafer-black-1.jpg", "/images/products/loafer-black-2.jpg", "/images/products/loafer-black-3.jpg", "/images/products/loafer-black-4.jpg"],
  },
  {
    name: "Signature Derby",
    price: 78000,
    description: "A distinctive olive green derby shoe that makes a statement. Handcrafted with open lacing for a comfortable fit, perfect for any occasion.",
    category: "Derby",
    sizes: [39, 40, 41, 42, 43, 44],
    colors: ["Olive Green"],
    featured: true,
    details: ["Premium dyed leather upper", "Open lacing system for comfort", "Hand-stitched welt", "Durable leather sole", "Made in Nigeria"],
    images: ["/images/products/derby-green-1.jpg", "/images/products/derby-green-2.jpg", "/images/products/derby-green-3.jpg", "/images/products/derby-green-4.jpg"],
  },
  {
    name: "Wingtip Brogue",
    price: 92000,
    description: "A masterfully crafted tan wingtip brogue with intricate perforations that showcase true artisan skill. A timeless classic for any wardrobe.",
    category: "Brogue",
    sizes: [40, 41, 42, 43, 44, 45],
    colors: ["Tan"],
    featured: true,
    details: ["Full-grain tan leather upper", "Hand-punched brogue perforations", "Goodyear welt construction", "Double leather sole", "Made in Nigeria"],
    images: ["/images/products/brogue-tan-1.jpg", "/images/products/brogue-tan-2.jpg", "/images/products/brogue-tan-3.jpg", "/images/products/brogue-tan-4.jpg"],
  },
  {
    name: "Chelsea Boot",
    price: 110000,
    description: "A refined handmade black leather Chelsea boot with elastic side panels. Timeless silhouette that transitions seamlessly from casual to smart.",
    category: "Boot",
    sizes: [39, 40, 41, 42, 43, 44, 45],
    colors: ["Black"],
    featured: false,
    details: ["Premium calfskin leather upper", "Elastic gore side panels", "Pull tab for easy on/off", "Stacked leather heel", "Made in Nigeria"],
    images: ["/images/products/chelsea-black-1.jpg", "/images/products/chelsea-black-2.jpg", "/images/products/chelsea-black-3.jpg", "/images/products/chelsea-black-4.jpg"],
  },
  {
    name: "Double Monk Strap",
    price: 95000,
    description: "An exquisite handmade burgundy double monk strap shoe featuring twin buckle closures. A bold yet sophisticated choice for the style-conscious.",
    category: "Monk Strap",
    sizes: [40, 41, 42, 43, 44],
    colors: ["Burgundy"],
    featured: false,
    details: ["Hand-dyed burgundy leather upper", "Dual antique brass buckle closures", "Blake-stitched construction", "Cushioned insole with arch support", "Made in Nigeria"],
    images: ["/images/products/monk-burgundy-1.jpg", "/images/products/monk-burgundy-2.jpg", "/images/products/monk-burgundy-3.jpg", "/images/products/monk-burgundy-4.jpg"],
  },
];

async function seed() {
  for (const product of products) {
    const id = product.name.toLowerCase().replace(/\s+/g, "-");
    const sizesStr = product.sizes.join(",");
    const colorsStr = product.colors.join(",");

    await sql`
      INSERT INTO products (id, name, price, description, category, sizes, colors, in_stock)
      VALUES (${id}, ${product.name}, ${product.price}, ${product.description}, ${product.category}, ${sizesStr}, ${colorsStr}, true)
      ON CONFLICT (id) DO NOTHING
    `;
    console.log(`Inserted product: ${product.name} (ID: ${id})`);

    for (let i = 0; i < product.images.length; i++) {
      const labels = ["Side View", "Front Angle", "Top View", "Back View"];
      await sql`
        INSERT INTO product_images (product_id, image_url, sort_order, label)
        VALUES (${id}, ${product.images[i]}, ${i}, ${labels[i] || "View"})
      `;
    }
    console.log(`  Added ${product.images.length} images`);
  }
  console.log("Seeding complete!");
}

seed().catch(console.error);
