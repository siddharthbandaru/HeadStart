"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { Love_Ya_Like_A_Sister } from "next/font/google";
import { Itim } from "next/font/google";

const itim = Itim({
  weight: "400",
  subsets: ["latin"],
});
const loveYaLikeASister = Love_Ya_Like_A_Sister({
  weight: "400",
  subsets: ["latin"],
});

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="border-b border-[#8db5c7]" 
    style={{
        backgroundColor: "#F0EEE9",
        backgroundImage: "linear-gradient(to right, transparent 115px, #E44B4B 115px, #E44B4B 116px, transparent 116px)",
       }}>
      <div className="mx-auto flex justify-between px-35 py-0">
        <Link href="/"  className={`${loveYaLikeASister.className} text-[85px] -mt-1 -mb-4`}>
          <span className="text-[#000000]">Head</span>
          <span className="text-[#2573B8]">Start</span>
        </Link>

        <div className={`${itim.className} flex items-center gap-3 text-[24px]`}>

          <Link
            href="/assignments"
            className="rounded-lg border border-white/40 bg-white/20 px-3 py-1 text-gray-700 shadow-md backdrop-blur-[0.75] transition hover:bg-white/40 hover:shadow-lg"
          >
            assignments
          </Link>

          <Link
            href="/classes"
            className="rounded-lg border border-white/40 bg-white/20 px-3 py-1 text-gray-700 shadow-md backdrop-blur-[0.75] transition hover:bg-white/40 hover:shadow-lg"
          >
            classes
          </Link>


          <Link href="/todo" 
          className="rounded-lg border border-white/40 bg-white/20 px-3 py-1 text-gray-700 shadow-md backdrop-blur-[0.75] transition hover:bg-white/40 hover:shadow-lg"
          >
            to-do
          </Link>

          <Link
            href="/calendar"
            className="rounded-lg border border-white/40 bg-white/20 px-3 py-1 text-gray-700 shadow-md backdrop-blur-[0.75] transition hover:bg-white/40 hover:shadow-lg"
          >
            calendar
          </Link>

          {user && (
            <Link
              href="/account"
              className="rounded-lg border border-white/40 bg-white/20 px-3 py-1 text-gray-700 shadow-md backdrop-blur-[0.75] transition hover:bg-white/40 hover:shadow-lg"
            >
              account
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}