import { Gauge, Leaf, Radio, ShieldCheck, Waves } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Waves,
    title: "Bioacoustic Monitoring",
    description: "Capture sound-group presence from connected forest devices.",
  },
  {
    icon: Radio,
    title: "Field Device Profiles",
    description: "Track health, uploads, battery, storage, and signal quality.",
  },
  {
    icon: ShieldCheck,
    title: "AI Review Workflow",
    description: "Surface confidence, unknown sounds, and disturbance context.",
  },
  {
    icon: Gauge,
    title: "Research Indicators",
    description: "Use preliminary acoustic indicators for biodiversity assessment.",
  },
];

export function HomeHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          className="h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&w=1800&q=80"
          alt="Misty forest canopy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-900/85 via-forest-900/65 to-cream" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8 lg:pb-20 lg:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="max-w-4xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cream/25 bg-cream/10 px-4 py-2 text-sm font-semibold text-cream backdrop-blur">
            <Leaf className="h-4 w-4" />
            AI-Based Wildlife Acoustic Classification System
          </div>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-normal text-cream sm:text-6xl lg:text-7xl">
            Listen to Forests, Understand Biodiversity.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-100">
            WILD-AI monitors wildlife sounds from connected field devices and
            transforms them into actionable biodiversity insights.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-200">
            Reports sound-group presence, acoustic activity patterns, confidence,
            disturbance level, and a preliminary acoustic indicator.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.07, duration: 0.45 }}
                className="rounded-[1.5rem] border border-white/15 bg-white/12 p-5 text-cream shadow-soft backdrop-blur-md"
              >
                <Icon className="h-6 w-6" />
                <h2 className="mt-4 text-base font-semibold">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-stone-200">
                  {feature.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
