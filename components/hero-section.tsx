import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getSettings } from "@/lib/settings"

export async function HeroSection() {
  const settings = await getSettings()

  return (
    <section className="relative overflow-hidden bg-accent text-accent-foreground">
      <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-8 px-4 py-16 lg:flex-row lg:gap-12 lg:px-8 lg:py-24">
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            {settings.hero_subtitle}
          </p>
          <h1 className="text-balance font-serif text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Premium Handmade
            <br />
            <span className="text-primary">Footwear</span>
          </h1>
          <p className="mt-6 max-w-lg text-pretty text-lg leading-relaxed text-accent-foreground/80">
            {settings.hero_tagline}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Shop Collection
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/#about"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Our Story
            </Link>
          </div>
        </div>

        <div className="relative flex-1">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
            <Image
              src="/images/hero-shoes.jpg"
              alt="Premium handmade leather shoes by David Mollanni"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
