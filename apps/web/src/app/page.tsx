"use client";

import { motion, useInView, useMotionValueEvent, useScroll } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Eye,
  Handshake,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Twitter,
  Youtube,
  Facebook,
  Instagram,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

function FadeIn({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const directionOffset = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
    none: { x: 0, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directionOffset[direction] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerContainer({
  children,
  className = "",
  stagger = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    icon: Target,
    title: "Smart Creator Matching",
    desc: "Our scoring engine analyzes 6 key signals to surface creators who genuinely align with your brand and audience.",
    color: "text-brand-primary",
    bg: "bg-brand-50",
  },
  {
    icon: BarChart3,
    title: "Data-Driven Decisions",
    desc: "Go beyond follower counts. See engagement health, audience authenticity, content relevance, and growth trends.",
    color: "text-accent-primary",
    bg: "bg-accent-50",
  },
  {
    icon: Handshake,
    title: "Seamless Collaboration",
    desc: "From first contact to campaign review — manage briefs, negotiate deals, and track performance in one place.",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: ShieldCheck,
    title: "Verified Creators",
    desc: "Multi-signal authenticity scoring flags fake engagement so you invest only in genuine influence.",
    color: "text-green-500",
    bg: "bg-green-50",
  },
];

const CREATOR_CARDS = [
  {
    name: "Ashley Peters",
    tags: "Travel · Japan · Lifestyle",
    score: 872,
    match: 54,
    avgViews: "85K",
    pills: ["Japan Culture", "Travel"],
    stars: 3.5,
    gradient: "from-brand-200/60 via-brand-100/40 to-accent-100/60",
  },
  {
    name: "AnimeFan Alex",
    tags: "Anime Reviews · Otaku",
    score: 849,
    match: 92,
    avgViews: "110K",
    pills: ["Anime", "Gaming · Japan"],
    stars: 4,
    gradient: "from-brand-100/60 via-accent-100/40 to-pink-100/60",
  },
  {
    name: "JapaneseWithKai",
    tags: "Learning Japanese",
    score: 804,
    match: 88,
    avgViews: "75K",
    pills: ["Japan Culture", "Language"],
    stars: 3.5,
    gradient: "from-accent-100/60 via-brand-100/40 to-purple-100/60",
  },
  {
    name: "TokyoTraveler",
    tags: "Japan · Travel · Vlogs",
    score: 788,
    match: 80,
    avgViews: "90K",
    pills: ["Japan", "Food · Travel"],
    stars: 3.5,
    gradient: "from-blue-100/60 via-brand-100/40 to-accent-100/60",
  },
];

const STATS = [
  { value: "2,000+", label: "Brands" },
  { value: "15K+", label: "Creators" },
  { value: "200%", label: "Avg ROI Lift" },
  { value: "4.9/5", label: "Satisfaction" },
];

const TRUSTED_BRANDS = ["Airbnb", "PlayStation", "Hilton", "Samsung", "Red Bull"];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i <= Math.floor(rating)
              ? "fill-accent-primary text-accent-primary"
              : i - 0.5 <= rating
                ? "fill-accent-200 text-accent-200"
                : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  return (
    <span className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  return (
    <div className="min-h-screen bg-white">
      {/* ── Navbar — transparent, merges with hero ── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-surface-200/80 bg-white/80 backdrop-blur-xl shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/mascot.png"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-xl object-cover"
            />
            <span className="text-lg font-bold">
              <span className="text-brand-primary">Brand</span>
              <span className="text-gray-800">Buddy</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {["Features", "For Brands", "For Creators", "Pricing", "FAQ"].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`text-sm font-medium transition-colors hover:text-gray-900 ${
                    scrolled ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  {item}
                </a>
              )
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className={`hidden text-sm font-medium transition-colors hover:text-gray-900 sm:block ${
                scrolled ? "text-gray-600" : "text-gray-600"
              }`}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="group flex items-center gap-1.5 rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-primary/25"
            >
              Get Started
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── Hero — extends under navbar ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#edf3ff] via-[#fef8ec] to-white pt-16">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 pb-16 pt-16 md:grid-cols-2 md:pb-0 md:pt-20">
          {/* Left */}
          <div className="relative z-10">
            <FadeIn delay={0.1}>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5">
                <Sparkles className="h-3.5 w-3.5 text-brand-primary" />
                <span className="text-xs font-semibold text-brand-primary">
                  AI-Powered Creator Matching
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-gray-900 md:text-5xl lg:text-[3.25rem]">
                Connect with the{" "}
                <span className="bg-gradient-to-r from-accent-primary to-accent-400 bg-clip-text text-transparent">
                  right creators
                </span>{" "}
                for your brand
              </h1>
            </FadeIn>

            <FadeIn delay={0.35}>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-gray-500">
                Find trusted influencers that are a perfect match for your
                audience and goals, all in one place.
              </p>
            </FadeIn>

            <FadeIn delay={0.45}>
              <div className="mt-8 flex max-w-md items-center gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm text-gray-700 shadow-sm outline-none placeholder:text-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-200"
                />
                <Link
                  href="/signup"
                  className="group flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-accent-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-primary/20 transition-all hover:bg-accent-400 hover:shadow-xl hover:shadow-accent-primary/30"
                >
                  Get Started Free
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
              <p className="mt-3 text-xs text-gray-400">
                Free to try, no credit card required
              </p>
            </FadeIn>

            <FadeIn delay={0.55}>
              <div className="mt-10">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Trusted by top brands
                </p>
                <div className="flex flex-wrap items-center gap-6">
                  {TRUSTED_BRANDS.map((brand, i) => (
                    <motion.span
                      key={brand}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      className="text-sm font-bold tracking-wide text-gray-300 transition-colors hover:text-gray-400"
                    >
                      {brand}
                    </motion.span>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right — hero visual */}
          <FadeIn delay={0.3} direction="right" className="relative flex items-end justify-center">
            <Image
              src="/brandbuddy.gif"
              alt="BrandBuddy platform demo"
              width={560}
              height={400}
              className="relative z-10 h-auto w-[340px] md:w-[480px] lg:w-[560px]"
              priority
              unoptimized
            />
          </FadeIn>
        </div>

        {/* Decorative elements */}
        <div className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-brand-100/30 blur-[100px]" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-accent-100/30 blur-[100px]" />
      </section>

      {/* ── Stats bar ── */}
      <section className="relative z-10 -mt-8 px-6">
        <div className="mx-auto max-w-4xl">
          <StaggerContainer
            className="grid grid-cols-2 gap-4 rounded-2xl border border-surface-200/80 bg-white p-6 shadow-xl shadow-gray-900/5 md:grid-cols-4 md:gap-8"
            stagger={0.1}
          >
            {STATS.map((stat) => (
              <StaggerItem key={stat.label} className="text-center">
                <p className="text-2xl font-extrabold text-gray-900 md:text-3xl">
                  <AnimatedCounter value={stat.value} />
                </p>
                <p className="mt-1 text-xs font-medium text-gray-500">
                  {stat.label}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <FadeIn className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Everything you need to run{" "}
              <span className="text-brand-primary">winning campaigns</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500">
              The all-in-one platform for finding, vetting, and collaborating
              with influencers who fit your brand.
            </p>
          </FadeIn>

          <StaggerContainer className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4" stagger={0.12}>
            {FEATURES.map((f) => (
              <StaggerItem key={f.title}>
                <motion.div
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="group h-full rounded-2xl border border-surface-200/60 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${f.bg}`}
                  >
                    <f.icon className={`h-6 w-6 ${f.color}`} />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    {f.desc}
                  </p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Creator showcase ── */}
      <section id="for-brands" className="bg-gradient-to-b from-surface-50 to-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <FadeIn className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Discover high-performing creators
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500">
              Every creator gets a BrandBuddy Score — a single number that tells
              you how well they fit your campaign.
            </p>
          </FadeIn>

          <StaggerContainer className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
            {CREATOR_CARDS.map((c) => (
              <StaggerItem key={c.name}>
                <motion.div
                  whileHover={{ y: -8, transition: { duration: 0.25 } }}
                  className="group overflow-hidden rounded-2xl border border-surface-200/60 bg-white shadow-sm transition-shadow hover:shadow-xl"
                >
                  {/* Gradient banner */}
                  <div className={`relative h-20 bg-gradient-to-r ${c.gradient}`}>
                    <div className="absolute -bottom-1 left-0 right-0 h-5 rounded-t-[20px] bg-white" />
                  </div>

                  {/* Content */}
                  <div className="px-5 pb-5 pt-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-primary ring-2 ring-white">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {c.name}
                        </p>
                        <p className="text-[11px] text-gray-400">{c.tags}</p>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                          Score
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {c.score}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                          Match
                        </p>
                        <p className="text-lg font-bold text-brand-primary">
                          {c.match}%
                        </p>
                      </div>
                    </div>

                    {/* Avg views */}
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
                      <Eye className="h-3.5 w-3.5" />
                      Avg Views:{" "}
                      <span className="font-semibold text-gray-700">
                        {c.avgViews}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {c.pills.map((pill) => (
                        <span
                          key={pill}
                          className="rounded-full bg-surface-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-500"
                        >
                          {pill}
                        </span>
                      ))}
                    </div>

                    {/* Stars + CTA */}
                    <div className="mt-4 flex items-center justify-between border-t border-surface-200/60 pt-3">
                      <StarRating rating={c.stars} />
                      <Link
                        href="/signup"
                        className="flex items-center gap-1 rounded-full bg-brand-primary px-3.5 py-1.5 text-[11px] font-semibold text-white transition-all hover:bg-brand-500 hover:shadow-md hover:shadow-brand-primary/20"
                      >
                        View Profile
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── For Creators ── */}
      <section id="for-creators" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Left — Score card */}
            <FadeIn direction="left">
              <div className="rounded-2xl border border-surface-200/60 bg-gradient-to-br from-white via-surface-50 to-brand-50 p-8 shadow-xl shadow-gray-900/5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary text-xl font-bold text-white shadow-lg shadow-brand-primary/30">
                    A
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">
                      Ashley Peters
                    </p>
                    <p className="text-sm text-gray-500">
                      Travel &amp; Lifestyle
                    </p>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    { val: "89", label: "Buddy Score", color: "text-brand-primary" },
                    { val: "284K", label: "Subscribers", color: "text-gray-900" },
                    { val: "6.8%", label: "Engagement", color: "text-green-600" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl bg-white p-3 text-center shadow-sm"
                    >
                      <p className={`text-xl font-bold ${s.color}`}>{s.val}</p>
                      <p className="mt-0.5 text-[11px] text-gray-500">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 space-y-2.5">
                  {[
                    { label: "Topic Relevance", val: 92, color: "bg-brand-primary" },
                    { label: "Engagement Health", val: 85, color: "bg-green-500" },
                    { label: "Authenticity", val: 88, color: "bg-accent-primary" },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-3">
                      <p className="w-32 text-xs font-medium text-gray-500">
                        {s.label}
                      </p>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-200">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.val}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                          className={`h-full rounded-full ${s.color}`}
                        />
                      </div>
                      <span className="w-8 text-right text-xs font-semibold text-gray-700">
                        {s.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Right — text */}
            <FadeIn direction="right">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  Creators: let brands find{" "}
                  <span className="bg-gradient-to-r from-accent-primary to-accent-400 bg-clip-text text-transparent">
                    you
                  </span>
                </h2>
                <p className="mt-5 text-base leading-relaxed text-gray-500">
                  Your BrandBuddy Score highlights your strengths — engagement
                  quality, audience authenticity, and content consistency — so the
                  right brands come to you.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    "Get matched with brands that align with your content",
                    "See transparent deal terms and negotiate in-app",
                    "Build your track record with verified reviews",
                    "Free forever for creators — no commissions",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-gray-600"
                    >
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50">
                        <svg
                          className="h-3 w-3 text-brand-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="group mt-8 inline-flex items-center gap-2 rounded-full bg-accent-primary px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-primary/20 transition-all hover:bg-accent-400 hover:shadow-xl hover:shadow-accent-primary/30"
                >
                  Join as a Creator
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Testimonial + CTA ── */}
      <section className="bg-gradient-to-b from-surface-50 to-white px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          {/* Testimonial */}
          <FadeIn direction="left">
            <div className="flex h-full flex-col justify-between rounded-2xl border border-surface-200/60 bg-white p-8 shadow-sm">
              <div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-accent-primary text-accent-primary"
                    />
                  ))}
                </div>
                <p className="mt-5 text-base leading-relaxed text-gray-600">
                  &ldquo;Finding the right influencers used to be a guessing game.{" "}
                  <span className="font-semibold text-gray-800">
                    With BrandBuddy, it&apos;s a science. We saw a 200% increase
                    in campaign engagement.
                  </span>
                  &rdquo;
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-100 text-sm font-bold text-accent-primary">
                  SC
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Sarah Collins
                  </p>
                  <p className="text-xs text-gray-500">
                    Director of Marketing, Hilton Hotels
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* CTA */}
          <FadeIn direction="right">
            <div className="flex h-full flex-col justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-500 p-8 text-white shadow-xl shadow-brand-primary/20">
              <h3 className="text-2xl font-bold">
                Get started today, it&apos;s free!
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                Sign up takes just 2 minutes. Join thousands of brands and
                creators growing together.
              </p>
              <div className="mt-6 flex items-center gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white outline-none placeholder:text-white/50 backdrop-blur focus:border-white/40 focus:ring-2 focus:ring-white/20"
                />
                <Link
                  href="/signup"
                  className="shrink-0 whitespace-nowrap rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-primary transition-all hover:bg-white/90 hover:shadow-lg"
                >
                  Get Started Free
                </Link>
              </div>
              <p className="mt-3 text-xs text-white/50">
                Free to try, no credit card required
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                {TRUSTED_BRANDS.map((brand) => (
                  <span
                    key={brand}
                    className="text-xs font-bold tracking-wide text-white/30"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-surface-200/60 bg-white px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2.5">
                <Image
                  src="/mascot.png"
                  alt=""
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-lg object-cover"
                />
                <span className="text-lg font-bold">
                  <span className="text-brand-primary">Brand</span>
                  <span className="text-gray-800">Buddy</span>
                </span>
              </Link>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-500">
                Data-driven creator-brand matching for campaigns that actually
                perform.
              </p>
            </div>

            {/* Links */}
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "For Brands", "For Creators"],
              },
              {
                title: "Resources",
                links: ["Blog", "Help Center", "API Docs"],
              },
              {
                title: "Company",
                links: ["About Us", "Contact", "Careers"],
              },
            ].map((col) => (
              <div key={col.title}>
                <p className="mb-3 text-sm font-semibold text-gray-800">
                  {col.title}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-gray-500 transition-colors hover:text-brand-primary"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-surface-200/60 pt-8 sm:flex-row">
            <p className="text-xs text-gray-400">
              &copy; BrandBuddy 2026. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Youtube, Facebook, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-all hover:bg-surface-100 hover:text-gray-600"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
