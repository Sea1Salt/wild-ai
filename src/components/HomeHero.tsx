import { Gauge, Leaf, Radio, ShieldCheck, Waves } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

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

const heroSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&w=1800&q=80",
    alt: "Misty forest canopy",
  },
  {
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1800&q=80",
    alt: "Dense green forest trail",
  },
  {
    image:
      "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1800&q=80",
    alt: "Sunlit tropical forest",
  },
  {
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80",
    alt: "Forest landscape at dawn",
  },
];

export function HomeHero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % heroSlides.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.img
            key={heroSlides[activeSlide].image}
            className="absolute inset-0 h-full w-full object-cover"
            src={heroSlides[activeSlide].image}
            alt={heroSlides[activeSlide].alt}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-forest-900/82 via-forest-900/48 to-forest-900/28" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(248,244,233,0.08),transparent_26%),linear-gradient(90deg,rgba(23,35,15,0.5),rgba(23,35,15,0.16)_56%,transparent_78%)]" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-[linear-gradient(to_top,#f8f4e9_0%,rgba(248,244,233,0.92)_18%,rgba(248,244,233,0.62)_42%,rgba(248,244,233,0.24)_68%,rgba(248,244,233,0)_100%)]" />
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
            AI-WSCBA monitors wildlife sounds from connected field devices and
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

        <div className="mt-8 flex items-center gap-2" aria-label="Forest banner slides">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              onClick={() => setActiveSlide(index)}
              className={`h-2.5 rounded-full transition-all ${
                activeSlide === index
                  ? "w-9 bg-cream"
                  : "w-2.5 bg-cream/45 hover:bg-cream/70"
              }`}
              aria-label={`Show forest banner ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
