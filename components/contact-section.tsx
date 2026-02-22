import { MessageCircle, Phone, Mail, Instagram, MapPin, Send, Truck } from "lucide-react"
import { getSettings } from "@/lib/settings"

export async function ContactSection() {
  const settings = await getSettings()

  const waLink = `https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hello David Mollanni, I'm interested in ordering a pair of shoes.")}`
  const waLinkPlain = `https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, "")}`
  const igHandle = settings.instagram_handle.replace("@", "")

  return (
    <section id="contact" className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Get in Touch
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-foreground md:text-4xl">
            Order Your Pair Today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground leading-relaxed">
            Ready to step ahead? Reach out to us via WhatsApp to place your order or send us a message with any questions.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {/* WhatsApp Order Card */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-8 text-center shadow-sm transition-all hover:border-primary hover:shadow-md"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-card-foreground">
              Order via WhatsApp
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Send us a message on WhatsApp to place your order, ask about available sizes, or request a custom design.
            </p>
            <span className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors group-hover:bg-primary/90">
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </span>
          </a>

          {/* Send a Message Card */}
          <a
            href={waLinkPlain}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-8 text-center shadow-sm transition-all hover:border-primary hover:shadow-md"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
              <Send className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-card-foreground">
              Send a Message
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Have a question about our footwear, sizing, or delivery? Drop us a message and we will get back to you promptly.
            </p>
            <span className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors group-hover:bg-secondary">
              <Send className="h-4 w-4" />
              Send Message
            </span>
          </a>
        </div>

        {/* Delivery Info */}
        {settings.delivery_info && (
          <div className="mx-auto mt-8 max-w-2xl rounded-lg border border-border bg-card p-6 text-center shadow-sm">
            <div className="mb-2 flex items-center justify-center gap-2 text-primary">
              <Truck className="h-5 w-5" />
              <span className="text-sm font-semibold">Delivery Information</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {settings.delivery_info}
            </p>
          </div>
        )}

        {/* Additional Contact Info */}
        <div className="mx-auto mt-12 flex max-w-2xl flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <a
            href={`tel:${settings.phone.replace(/\s/g, "")}`}
            className="flex items-center gap-2 transition-colors hover:text-primary"
          >
            <Phone className="h-4 w-4 shrink-0" />
            <span>{settings.phone}</span>
          </a>
          <a
            href={`mailto:${settings.email}`}
            className="flex items-center gap-2 transition-colors hover:text-primary"
          >
            <Mail className="h-4 w-4 shrink-0" />
            <span>{settings.email}</span>
          </a>
          <a
            href={`https://instagram.com/${igHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition-colors hover:text-primary"
          >
            <Instagram className="h-4 w-4 shrink-0" />
            <span>{settings.instagram_handle}</span>
          </a>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{settings.location}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
