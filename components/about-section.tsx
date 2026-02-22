import { ShieldCheck, MapPin, Users } from "lucide-react"
import { getSettings } from "@/lib/settings"

export async function AboutSection() {
  const settings = await getSettings()

  const stats = [
    {
      icon: ShieldCheck,
      value: settings.stat_authentic,
      label: "Authentic",
    },
    {
      icon: MapPin,
      value: settings.stat_states,
      label: "States Covered",
    },
    {
      icon: Users,
      value: settings.stat_customers,
      label: "Happy Customers",
    },
  ]

  return (
    <section id="about" className="bg-secondary py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            About Us
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-secondary-foreground md:text-4xl">
            {settings.about_heading}
          </h2>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col gap-6 text-center">
            <p className="text-muted-foreground leading-relaxed">
              {settings.about_paragraph_1}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {settings.about_paragraph_2}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {settings.about_paragraph_3}
            </p>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center rounded-lg bg-card p-6 text-center shadow-sm"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <span className="font-serif text-2xl font-bold text-card-foreground md:text-3xl">
                {stat.value}
              </span>
              <span className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
