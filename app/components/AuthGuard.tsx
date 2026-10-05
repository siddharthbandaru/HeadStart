"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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

const publicRoutes = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

const loggedOutOnlyRoutes = [
  "/login",
  "/signup",
  "/forgot-password",
];

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      const user = session?.user ?? null;

      // Not logged in and trying to access a protected page
      if (!user && !publicRoutes.includes(pathname)) {
        router.replace("/login");
        return;
      }

      // Already logged in and trying to access login/signup/etc.
      if (user && loggedOutOnlyRoutes.includes(pathname)) {
        router.replace("/");
        return;
      }

      setLoading(false);
    }

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (loading) {
    return (
      <main
        className={`flex min-h-screen items-center justify-center ${itim.className}`}
        style={{
          backgroundColor: "#F0EEE9",
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0px, transparent 35px, #8db5c7a7 35px, #8db5c7a7 36px), linear-gradient(to right, transparent 115px, #E44B4B 115px, #E44B4B 116px, transparent 116px)",
        }}
      >
        <div className="text-center">
          <h1
            className={`${loveYaLikeASister.className} text-[48px] leading-none`}
          >
            <span className="text-black">Head</span>
            <span className="text-[#2573B8]">Start</span>
          </h1>

          <div className="mt-5 flex justify-center">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-300 border-t-[#2573B8]" />
          </div>

          <p className="mt-3 text-[17px] text-gray-500">
            Loading...
          </p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}