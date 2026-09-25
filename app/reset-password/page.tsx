"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleUpdatePassword(e: React.FormEvent) {
        e.preventDefault();

        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.updateUser({
            password,
        });

        setLoading(false);

        if (error) {
            setError(error.message);
            return;
        }

        await supabase.auth.signOut();

        router.push("/login");
        router.refresh();
    }

    return (
        <main className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold mb-2">
                    Create a new password
                </h1>

                <p className="text-gray-500 mb-6">
                    Enter your new password below.
                </p>

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div>
                        <label className="block mb-1">New password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full border rounded-lg p-3"
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Confirm new password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full border rounded-lg p-3"
                        />
                    </div>

                    {error && <p className="text-red-500">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white rounded-lg p-3"
                    >
                        {loading ? "Updating..." : "Update password"}
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