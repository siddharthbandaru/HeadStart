"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  Love_Ya_Like_A_Sister,
  Itim,
} from "next/font/google";

const itim = Itim({
  weight: "400",
  subsets: ["latin"],
});

const loveYaLikeASister = Love_Ya_Like_A_Sister({
  weight: "400",
  subsets: ["latin"],
});

const notebookBackground = {
  backgroundColor: "#F0EEE9",
  backgroundImage:
    "repeating-linear-gradient(to bottom, transparent 0px, transparent 35px, #8db5c7a7 35px, #8db5c7a7 36px), linear-gradient(to right, transparent 115px, #E44B4B 115px, #E44B4B 116px, transparent 116px)",
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(
      "If an account exists for this email, we've sent a password reset link."
    );
  }

  return (
    <main
      className={`relative flex min-h-screen items-center justify-center px-6 py-12 ${itim.className}`}
      style={notebookBackground}
    >
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="mb-7 text-center">
          <Link href="/">
            <h1
              className={`${loveYaLikeASister.className} text-[48px] leading-none text-black`}
            >
              Head
              <span className="text-[#2573B8]">
                Start
              </span>
            </h1>
          </Link>

          <p className="mt-3 text-[18px] text-gray-600">
            Plan smarter. Start sooner.
          </p>
        </div>

        {/* Reset Card */}
        <div className="rounded-xl border border-white/40 bg-white/20 p-7 shadow-md backdrop-blur-[0.75px] sm:p-8">
          <div className="mb-6">
            <h2
              className={`${loveYaLikeASister.className} text-[34px] leading-tight text-black`}
            >
              Forgot your password?
            </h2>

            <p className="mt-2 text-[17px] leading-relaxed text-gray-600">
              No worries! Enter your email and
              we&apos;ll send you a link to reset it.
            </p>
          </div>

          <form
            onSubmit={handleReset}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[18px] text-gray-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-white/50 bg-white/40 px-4 py-3 text-[17px] text-black outline-none transition placeholder:text-gray-400 focus:border-[#2573B8] focus:bg-white/60 focus:ring-2 focus:ring-[#2573B8]/20"
              />
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-300 bg-red-50/70 px-4 py-3 text-[16px] text-red-700"
              >
                {error}
              </div>
            )}

            {/* Success */}
            {message && (
              <div
                role="status"
                className="rounded-lg border border-green-300 bg-green-50/70 px-4 py-3 text-[16px] leading-relaxed text-green-700"
              >
                {message}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#2573B8] px-5 py-3 text-[19px] text-white shadow-sm transition hover:bg-[#1c609c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Sending..."
                : "Send Reset Link"}
            </button>
          </form>

          {/* Back to login */}
          <div className="mt-6 border-t border-white/50 pt-5 text-center">
            <Link
              href="/login"
              className="text-[17px] text-[#2573B8] transition hover:underline"
            >
              ← Back to login
            </Link>
          </div>
        </div>

        <p className="mt-5 text-center text-[15px] text-gray-500">
          You&apos;ll be back on track in no time.
        </p>
      </div>
    </main>
  );
}