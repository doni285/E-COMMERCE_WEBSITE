import { Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { ProductsSection } from "@/components/products-section"
import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import { SiteFooter } from "@/components/site-footer"

function SectionLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )
}

function ProductsLoading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
      <div className="mb-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Our Collection</p>
        <h2 className="mt-2 font-serif text-3xl font-bold text-foreground md:text-4xl">Premium Handmade Footwear</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse rounded-lg border border-border bg-card">
            <div className="aspect-square bg-secondary" />
            <div className="p-4">
              <div className="h-3 w-16 rounded bg-secondary" />
              <div className="mt-2 h-5 w-32 rounded bg-secondary" />
              <div className="mt-2 h-4 w-20 rounded bg-secondary" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Suspense fallback={<SectionLoading />}>
          <HeroSection />
        </Suspense>
        <Suspense fallback={<ProductsLoading />}>
          <ProductsSection />
        </Suspense>
        <Suspense fallback={<SectionLoading />}>
          <AboutSection />
        </Suspense>
        <Suspense fallback={<SectionLoading />}>
          <ContactSection />
        </Suspense>
      </main>
      <Suspense fallback={<SectionLoading />}>
        <SiteFooter />
      </Suspense>
    </div>
  )
}
