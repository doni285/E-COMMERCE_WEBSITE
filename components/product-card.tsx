import Image from "next/image"
import Link from "next/link"
import { type Product, formatPrice } from "@/lib/products"

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group block overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
        {!product.in_stock && (
          <span className="absolute left-3 top-3 rounded-sm bg-destructive px-2 py-1 text-xs font-semibold text-white">
            Out of Stock
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {product.category}
        </p>
        <h3 className="mt-1 font-serif text-lg font-semibold text-card-foreground">
          {product.name}
        </h3>
        <p className="mt-2 text-base font-bold text-primary">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  )
}
