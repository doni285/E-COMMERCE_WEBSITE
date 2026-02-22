import { notFound } from "next/navigation"
import Link from "next/link"
import { Suspense } from "react"
import { ArrowLeft, Truck, Shield, Contact } from "lucide-react"
import { getProduct, formatPrice } from "@/lib/products"
import { getSettings } from "@/lib/settings"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductImageGallery } from "@/components/product-image-gallery"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) return { title: "Product Not Found" }
  return {
    title: `${product.name} - David Mollanni`,
    description: product.description,
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [product, settings] = await Promise.all([getProduct(id), getSettings()])

  if (!product) {
    notFound()
  }

  const waNumber = settings.whatsapp_number.replace(/[^0-9]/g, "")

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
          <Link
            href="/#products"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Collection
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
            <ProductImageGallery images={product.images} name={product.name} />

            <div className="flex flex-col">
              <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {product.category}
              </p>
              <h1 className="mt-2 font-serif text-3xl font-bold text-foreground md:text-4xl">
                {product.name}
              </h1>
              <p className="mt-4 text-3xl font-bold text-primary">
                {formatPrice(product.price)}
              </p>

              <p className="mt-6 leading-relaxed text-muted-foreground">
                {product.description}
              </p>

              {product.sizes.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-semibold text-foreground">Available Sizes (EU)</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <span
                        key={size}
                        className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.colors.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-foreground">Color</h3>
                  <div className="mt-2 flex gap-2">
                    {product.colors.map((color) => (
                      <span
                        key={color}
                        className="rounded-md border border-primary bg-primary/5 px-3 py-1 text-sm font-medium text-primary"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `Hi, I'm interested in the ${product.name} (${formatPrice(product.price)}) from David Mollanni.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Order via WhatsApp
                </a>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-8">
                <div className="flex flex-col items-center gap-2 text-center">
                  <Truck className="h-5 w-5 text-primary" />
                  <span className="text-xs text-muted-foreground">Global Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-xs text-muted-foreground">Quality Guarantee</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <Contact className="h-5 w-5 text-primary" />
                  <span className="text-xs text-muted-foreground">Customer Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
