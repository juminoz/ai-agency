import Image from "next/image";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const CREATOR_CARDS = [
  {
    name: "Ashley Peters",
    tags: "Travel · Japan · Lifestyle",
    score: 872,
    match: "54%",
    avgViews: "85K",
    pills: ["Japan Culture", "Travel"],
    stars: 3.5,
    gradient: "from-brand-200 via-brand-100 to-accent-100",
    featureLabel: "Smart Creator Matching",
    featureIcon: "🎯",
  },
  {
    name: "AnimeFan Alex",
    tags: "Anime Reviews · Otaku",
    score: 849,
    match: "92%",
    avgViews: "110K",
    pills: ["Anime", "Gaming · Japan"],
    stars: 4,
    gradient: "from-brand-100 via-accent-100 to-pink-100",
    featureLabel: "Data-Driven Decisions",
    featureIcon: "📊",
  },
  {
    name: "JapaneseWithKai",
    tags: "Learning Japanese",
    score: 804,
    match: "88%",
    avgViews: "75K",
    pills: ["Japan Culture", "Language"],
    stars: 3.5,
    gradient: "from-accent-100 via-brand-100 to-purple-100",
    featureLabel: "Campaign Results Tracking",
    featureIcon: "📈",
  },
  {
    name: "TokyoTraveler",
    tags: "Japan · Travel · Vlogs",
    score: 788,
    match: "80%",
    avgViews: "90K",
    pills: ["Japan", "Food · Travel"],
    stars: 3.5,
    gradient: "from-blue-100 via-brand-100 to-accent-100",
    featureLabel: "Empowering Creators",
    featureIcon: "💪",
  },
];

const TRUSTED_BRANDS = ["Airbnb", "PlayStation", "Hilton", "Samsung", "Red Bull"];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`h-3.5 w-3.5 ${
            i <= Math.floor(rating)
              ? "text-accent-primary"
              : i - 0.5 <= rating
                ? "text-accent-200"
                : "text-gray-200"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-30 border-b border-surface-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-brand-primary">
            <Image src="/mascot.png" alt="" width={28} height={28} className="h-7 w-7 rounded-lg object-cover" />
            <span>
              Brand<span className="text-gray-800">Buddy</span>
            </span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            <a href="#features" className="text-sm text-gray-600 transition-colors hover:text-brand-primary">
              Features
            </a>
            <a href="#brands" className="text-sm text-gray-600 transition-colors hover:text-brand-primary">
              For Brands
            </a>
            <a href="#creators" className="text-sm text-gray-600 transition-colors hover:text-brand-primary">
              For Creators
            </a>
            <a href="#" className="text-sm text-gray-600 transition-colors hover:text-brand-primary">
              Pricing
            </a>
            <a href="#" className="text-sm text-gray-600 transition-colors hover:text-brand-primary">
              FAQ
            </a>
          </div>

          <Link
            href="/login"
            className="rounded-full bg-brand-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-500"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#e8f0fe] via-[#fef6e4] to-[#f3e8ff]">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 pb-10 pt-12 md:grid-cols-2 md:pb-0 md:pt-16">
          {/* Left column */}
          <div className="relative z-10">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-[2.75rem]">
              Connect with the{" "}
              <span className="text-accent-primary">right creators</span> for your
              brand
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-500">
              Find trusted influencers that are a perfect match for your audience and
              goals, all in one place.
            </p>

            <div className="mt-6 flex max-w-sm items-center gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-200"
              />
              <Link
                href="/login"
                className="whitespace-nowrap rounded-full bg-accent-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-400"
              >
                Get Started Free
              </Link>
            </div>

            <p className="mt-3 text-xs text-gray-400">
              Free to try, no credit card required
            </p>

            {/* Trusted brands inline */}
            <div className="mt-8">
              <p className="mb-3 text-sm font-semibold text-gray-700">
                Trusted by top brands
              </p>
              <div className="flex flex-wrap items-center gap-5">
                {TRUSTED_BRANDS.map((brand) => (
                  <span
                    key={brand}
                    className="text-sm font-bold tracking-wide text-gray-400"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — otter mascot */}
          <div className="relative flex items-end justify-center">
            <Image
              src="/mascot.png"
              alt="BrandBuddy otter mascot"
              width={420}
              height={420}
              className="relative z-10 h-auto w-[320px] md:w-[420px]"
              priority
            />
          </div>
        </div>

        {/* Soft cloud shapes */}
        <div className="pointer-events-none absolute -left-20 top-0 h-40 w-80 rounded-full bg-white/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-0 h-40 w-80 rounded-full bg-white/40 blur-3xl" />
      </section>

      {/* ── Trusted section ── */}
      <section id="features" className="bg-surface-50 px-6 py-16">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Trusted by 2,000+ brands{" "}
            <span className="text-accent-primary">big</span> and small
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-500">
            The all-in-one platform for finding, vetting, and collaborating with
            influencers who fit your brand.
          </p>

          {/* Creator feature cards */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CREATOR_CARDS.map((c) => (
              <div
                key={c.name}
                className="overflow-hidden rounded-card bg-white shadow-card transition-shadow hover:shadow-card-hover"
              >
                {/* Gradient banner */}
                <div
                  className={`h-20 bg-gradient-to-r ${c.gradient} relative`}
                >
                  <div className="absolute -bottom-1 left-0 right-0 h-4 rounded-t-3xl bg-white" />
                </div>

                {/* Feature label */}
                <div className="px-4 pb-1 pt-1">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                    <span>{c.featureIcon}</span>
                    {c.featureLabel}
                  </p>
                </div>

                {/* Creator info */}
                <div className="px-4 pb-4 pt-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-primary">
                      {c.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-800">
                        {c.name}
                      </p>
                      <p className="text-[11px] text-gray-400">{c.tags}</p>
                    </div>
                  </div>

                  {/* Score + match */}
                  <div className="mt-3 flex items-center gap-3 text-xs">
                    <span className="text-gray-500">
                      BrandBuddy Score:{" "}
                      <span className="font-bold text-gray-800">{c.score}</span>
                    </span>
                    <span className="font-medium text-brand-primary">
                      &#9670; {c.match}
                    </span>
                  </div>

                  {/* Avg views */}
                  <div className="mt-1.5 flex items-center gap-1 text-xs text-gray-500">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Avg Views:{" "}
                    <span className="font-bold text-gray-800">{c.avgViews}</span>
                  </div>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {c.pills.map((pill) => (
                      <span
                        key={pill}
                        className="rounded-full bg-surface-100 px-2.5 py-0.5 text-[11px] text-gray-500"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>

                  {/* Stars + CTA */}
                  <div className="mt-3 flex items-center justify-between">
                    <StarRating rating={c.stars} />
                    <Link
                      href="/login"
                      className="rounded-full bg-brand-primary px-3.5 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-brand-500"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial + CTA row ── */}
      <section className="bg-white px-6 py-14">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          {/* Testimonial */}
          <div className="rounded-card bg-surface-50 p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-accent-100 text-2xl">
                👩
              </div>
              <div>
                <p className="text-sm leading-relaxed text-gray-600">
                  Finding the right influencers used to be a guessing game.{" "}
                  <span className="font-semibold text-gray-800">
                    With BrandBuddy, it&apos;s a science. We saw a 200% increase in
                    campaign engagement.
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3">
              {/* 5 stars */}
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    className="h-4 w-4 text-accent-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
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

          {/* CTA card */}
          <div className="rounded-card bg-gradient-to-br from-brand-50 via-surface-50 to-accent-50 p-8">
            <h3 className="text-xl font-bold text-gray-900">
              Get started today, it&apos;s free!
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Sign up takes just 2 minutes. Join thousands of brands and creators
              growing together.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-200"
              />
              <Link
                href="/login"
                className="whitespace-nowrap rounded-full bg-accent-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-400"
              >
                Get Started Free
              </Link>
            </div>
            <p className="mt-3 text-xs text-gray-400">
              Free to try, no credit card required
            </p>
            {/* Brand logos */}
            <div className="mt-5 flex flex-wrap items-center gap-4">
              {TRUSTED_BRANDS.map((brand) => (
                <span
                  key={brand}
                  className="text-xs font-bold tracking-wide text-gray-300"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-surface-200 bg-white px-6 py-10">
        <div className="mx-auto max-w-6xl">
          {/* Link columns */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="mb-3 text-sm font-semibold text-gray-700">Product</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <a href="#features" className="hover:text-brand-primary">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-primary">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-gray-700">Pricing</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <a href="#brands" className="hover:text-brand-primary">
                    For Brands
                  </a>
                </li>
                <li>
                  <a href="#creators" className="hover:text-brand-primary">
                    For Creators
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-gray-700">Resources</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <a href="#" className="hover:text-brand-primary">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-primary">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-gray-700">Company</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <a href="#" className="hover:text-brand-primary">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-primary">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-primary">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-surface-200 pt-6 sm:flex-row">
            <p className="text-xs text-gray-400">
              &copy; BrandBuddy 2026. All rights reserved.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-4">
              {["twitter", "youtube", "facebook", "instagram"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-surface-100 hover:text-gray-600"
                >
                  {s === "twitter" && (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.38 8.59 8.59 0 01-2.72 1.04 4.28 4.28 0 00-7.32 3.91A12.16 12.16 0 013.16 4.86a4.28 4.28 0 001.32 5.72 4.24 4.24 0 01-1.94-.54v.05a4.28 4.28 0 003.43 4.2 4.27 4.27 0 01-1.93.07 4.29 4.29 0 004 2.98A8.59 8.59 0 012 19.54a12.13 12.13 0 006.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.37-.01-.56A8.72 8.72 0 0024 5.06a8.58 8.58 0 01-2.54.7z" />
                    </svg>
                  )}
                  {s === "youtube" && (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.55 3.5 12 3.5 12 3.5s-7.55 0-9.38.55A3.02 3.02 0 00.5 6.19 31.67 31.67 0 000 12a31.67 31.67 0 00.5 5.81 3.02 3.02 0 002.12 2.14c1.83.55 9.38.55 9.38.55s7.55 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.67 31.67 0 0024 12a31.67 31.67 0 00-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
                    </svg>
                  )}
                  {s === "facebook" && (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.025 4.388 11.022 10.125 11.927v-8.437H7.078v-3.49h3.047V9.43c0-3.024 1.792-4.698 4.533-4.698 1.312 0 2.686.235 2.686.235v2.97H15.83c-1.491 0-1.956.93-1.956 1.886v2.264h3.328l-.532 3.49h-2.796v8.437C19.612 23.095 24 18.098 24 12.073z" />
                    </svg>
                  )}
                  {s === "instagram" && (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
