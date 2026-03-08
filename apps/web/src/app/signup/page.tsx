"use client";

import { Building2, CheckCircle, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"creator" | "brand">("creator");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      const supabase = createBrowserSupabaseClient();
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        console.error("Signup error:", authError.status, authError.message, authError);
        setError(`${authError.message} (status: ${authError.status})`);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    },
    [email, password, fullName, role]
  );

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#e8f0fe] via-[#fef6e4] to-[#f3e8ff] px-6">
        <div className="w-full max-w-md rounded-card bg-white p-8 text-center shadow-card">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-800">Check your email</h1>
          <p className="mt-2 text-sm text-gray-500">
            We sent a verification link to <strong className="text-gray-700">{email}</strong>.
            Click the link to activate your account.
          </p>
          <Link
            className="mt-6 inline-block text-sm font-medium text-brand-primary hover:text-brand-500"
            href="/login"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

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
          Join <span className="text-brand-primary">BrandBuddy</span> today
        </h2>
        <p className="mt-3 max-w-sm text-center text-sm leading-relaxed text-gray-500">
          Whether you&apos;re a creator or a brand, we&apos;ll match you with the perfect partner for campaigns that deliver.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md rounded-card bg-white p-8 shadow-card">
          {/* Mobile logo */}
          <div className="mb-6 flex items-center justify-center gap-2 lg:hidden">
            <Image src="/mascot.png" alt="" width={32} height={32} className="h-8 w-8 rounded-lg object-cover" />
            <span className="text-lg font-bold text-brand-primary">
              Brand<span className="text-gray-800">Buddy</span>
            </span>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Create an account</h1>
            <p className="mt-1 text-sm text-gray-500">
              Sign up to get started with BrandBuddy
            </p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSignup}>
            {/* Full name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700" htmlFor="fullName">
                Full name
              </label>
              <input
                required
                autoComplete="name"
                className="w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-200"
                id="fullName"
                placeholder="Jane Doe"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            {/* Role selector */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("creator")}
                  className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                    role === "creator"
                      ? "border-brand-primary bg-brand-50 text-brand-primary shadow-sm"
                      : "border-surface-200 bg-white text-gray-500 hover:border-surface-300 hover:bg-surface-50"
                  }`}
                >
                  <Video className="h-4 w-4" />
                  Creator
                </button>
                <button
                  type="button"
                  onClick={() => setRole("brand")}
                  className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                    role === "brand"
                      ? "border-accent-primary bg-accent-50 text-accent-400 shadow-sm"
                      : "border-surface-200 bg-white text-gray-500 hover:border-surface-300 hover:bg-surface-50"
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                  Brand
                </button>
              </div>
            </div>

            {/* Email */}
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

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700" htmlFor="password">
                Password
              </label>
              <input
                required
                autoComplete="new-password"
                className="w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-200"
                id="password"
                minLength={6}
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-xs text-gray-400">Must be at least 6 characters</p>
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
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link className="font-medium text-brand-primary hover:text-brand-500" href="/login">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
