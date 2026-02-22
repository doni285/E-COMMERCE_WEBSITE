import { getProducts } from "@/lib/products"
import { ProductCard } from "@/components/product-card"

export async function ProductsSection() {
  const products = await getProducts()

  return (
    <section id="products" className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
      <div className="mb-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          Our Collection
        </p>
        <h2 className="mt-2 font-serif text-3xl font-bold text-foreground md:text-4xl">
          Premium Handmade Footwear
        </h2>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-muted-foreground">No products available yet. Check back soon!</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
