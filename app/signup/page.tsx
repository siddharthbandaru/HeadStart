"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

const inputStyle =
  "w-full rounded-lg border border-white/50 bg-white/40 px-4 py-3 text-[17px] text-black outline-none transition placeholder:text-gray-400 focus:border-[#2573B8] focus:bg-white/60 focus:ring-2 focus:ring-[#2573B8]/20";

export default function SignupPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!firstName.trim() || !lastName.trim()) {
      setError(
        "Please enter your first and last name."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    setLoading(true);

    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
          },
        },
      });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      router.push("/");
      router.refresh();
      return;
    }

    setMessage(
      "If this email is eligible for signup, we've sent a confirmation link. Check your inbox to finish creating your account."
    );
  }

  return (
    <main
      className={`relative flex min-h-screen items-center justify-center px-6 py-10 ${itim.className}`}
      style={notebookBackground}
    >
      <div className="w-full max-w-lg">
        {/* Branding */}
        <div className="mb-6 text-center">
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

        {/* Signup Card */}
        <div className="rounded-xl border border-white/40 bg-white/20 p-7 shadow-md backdrop-blur-[0.75px] sm:p-8">
          <div className="mb-6">
            <h2
              className={`${loveYaLikeASister.className} text-[34px] leading-tight text-black`}
            >
              Create your account
            </h2>

            <p className="mt-1 text-[17px] text-gray-600">
              Start organizing your classes,
              assignments, and plans.
            </p>
          </div>

          <form
            onSubmit={handleSignup}
            className="space-y-5"
          >
            {/* Name */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="first-name"
                  className="mb-2 block text-[18px] text-gray-700"
                >
                  First Name
                </label>

                <input
                  id="first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) =>
                    setFirstName(e.target.value)
                  }
                  required
                  autoComplete="given-name"
                  placeholder="First name"
                  className={inputStyle}
                />
              </div>

              <div>
                <label
                  htmlFor="last-name"
                  className="mb-2 block text-[18px] text-gray-700"
                >
                  Last Name
                </label>

                <input
                  id="last-name"
                  type="text"
                  value={lastName}
                  onChange={(e) =>
                    setLastName(e.target.value)
                  }
                  required
                  autoComplete="family-name"
                  placeholder="Last name"
                  className={inputStyle}
                />
              </div>
            </div>

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
                className={inputStyle}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-[18px] text-gray-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="Create a password"
                className={inputStyle}
              />

              <p className="mt-2 text-[14px] text-gray-500">
                Must be at least 6 characters.
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-[18px] text-gray-700"
              >
                Confirm Password
              </label>

              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="Enter it again"
                className={inputStyle}
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
                ? "Creating account..."
                : "Create Account"}
            </button>
          </form>

          {/* Login */}
          <div className="mt-6 border-t border-white/50 pt-5 text-center">
            <p className="text-[17px] text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-[#2573B8] transition hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-5 text-center text-[15px] text-gray-500">
          Get ahead before the deadline gets ahead
          of you.
        </p>
      </div>
    </main>
  );
}