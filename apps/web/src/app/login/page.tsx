"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useState } from "react";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/creator";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      const supabase = createBrowserSupabaseClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      router.push(redirectTo);
      router.refresh();
    },
    [email, password, redirectTo, router]
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#e8f0fe] via-[#fef6e4] to-[#f3e8ff]">
      {/* Left panel — branding */}
      <div className="hidden w-1/2 flex-col items-center justify-center px-12 lg:flex">
        <Image
          src="/mascot.png"
          alt="BrandBuddy mascot"
          width={280}
          height={280}
          className="mb-8 h-auto w-[280px]"
        />
        <h2 className="text-center text-2xl font-bold text-gray-800">
          Welcome back to <span className="text-brand-primary">BrandBuddy</span>
        </h2>
        <p className="mt-3 max-w-sm text-center text-sm leading-relaxed text-gray-500">
          The data-driven platform connecting brands with authentic, high-performing creators.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-md rounded-card bg-white p-8 shadow-card">
          {/* Logo */}
          <div className="mb-6 flex items-center justify-center gap-2 lg:hidden">
            <Image src="/mascot.png" alt="" width={32} height={32} className="h-8 w-8 rounded-lg object-cover" />
            <span className="text-lg font-bold text-brand-primary">
              Brand<span className="text-gray-800">Buddy</span>
            </span>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Sign in</h1>
            <p className="mt-1 text-sm text-gray-500">
              Enter your credentials to continue
            </p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleLogin}>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700" htmlFor="email">
                Email
              </label>
              <input
                required
                autoComplete="email"
                className="w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-200"
                id="email"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700" htmlFor="password">
                Password
              </label>
              <input
                required
                autoComplete="current-password"
                className="w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-200"
                id="password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              className="w-full rounded-button bg-brand-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500 disabled:opacity-50"
              disabled={loading}
              type="submit"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link className="font-medium text-brand-primary hover:text-brand-500" href="/signup">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
