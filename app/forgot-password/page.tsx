"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleReset(e: React.FormEvent) {
        e.preventDefault();

        setError("");
        setMessage("");
        setLoading(true);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

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
        <main className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold mb-2">Reset your password</h1>

                <p className="text-gray-500 mb-6">
                    Enter your email and we'll send you a password reset link.
                </p>

                <form onSubmit={handleReset} className="space-y-4">
                    <div>
                        <label className="block mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border rounded-lg p-3"
                        />
                    </div>

                    {error && <p className="text-red-500">{error}</p>}
                    {message && <p className="text-green-600">{message}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white rounded-lg p-3"
                    >
                        {loading ? "Sending..." : "Send reset link"}
                    </button>
                </form>

                <p className="mt-4 text-center">
                    <a href="/login" className="underline">
                        Back to login
                    </a>
                </p>
            </div>
        </main>
    );
}