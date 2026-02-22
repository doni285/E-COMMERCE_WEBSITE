import Image from "next/image"
import Link from "next/link"
import { Instagram, Phone, Mail, MapPin } from "lucide-react"
import { getSettings } from "@/lib/settings"

export async function SiteFooter() {
  const settings = await getSettings()
  const igHandle = settings.instagram_handle.replace("@", "")

  return (
    <footer className="bg-accent text-accent-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <Image
              src="/images/logo.jpeg"
              alt="David Mollanni Logo"
              width={160}
              height={56}
              className="mb-4 h-14 w-auto object-contain"
            />
            <p className="text-sm text-accent-foreground/70 leading-relaxed">
              {settings.hero_tagline}
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col gap-3">
              <Link href="/" className="text-sm text-accent-foreground/70 transition-colors hover:text-primary">
                Home
              </Link>
              <Link href="/#products" className="text-sm text-accent-foreground/70 transition-colors hover:text-primary">
                Collection
              </Link>
              <Link href="/#about" className="text-sm text-accent-foreground/70 transition-colors hover:text-primary">
                About Us
              </Link>
              <Link href="/#contact" className="text-sm text-accent-foreground/70 transition-colors hover:text-primary">
                Contact
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold">Get in Touch</h3>
            <div className="flex flex-col gap-3">
              <a
                href={`tel:${settings.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-sm text-accent-foreground/70 transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4 shrink-0" />
                <span>{settings.phone}</span>
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-2 text-sm text-accent-foreground/70 transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4 shrink-0" />
                <span>{settings.email}</span>
              </a>
              <div className="flex items-center gap-2 text-sm text-accent-foreground/70">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{settings.location}</span>
              </div>
              <a
                href={`https://instagram.com/${igHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-accent-foreground/70 transition-colors hover:text-primary"
              >
                <Instagram className="h-4 w-4 shrink-0" />
                <span>{settings.instagram_handle}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-accent-foreground/10 pt-8 text-center">
          <p className="text-xs text-accent-foreground/50">
            {new Date().getFullYear()} David Mollanni. All rights reserved. Step ahead...
          </p>
        </div>
      </div>
    </footer>
  )
}
