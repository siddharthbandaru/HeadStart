import Link from "next/link";
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
            className="rounded-lg border border-white/40 bg-white/40 px-3 py-1 text-gray-700 shadow-md backdrop-blur-md transition hover:bg-white/60 hover:shadow-lg"
          >
            assignments
          </Link>

          <Link
            href="/classes"
            className="rounded-lg border border-white/40 bg-white/40 px-3 py-1 text-gray-700 shadow-md backdrop-blur-md transition hover:bg-white/60 hover:shadow-lg"
          >
            classes
          </Link>


          <Link href="/todo" 
          className="rounded-lg border border-white/40 bg-white/40 px-3 py-1 text-gray-700 shadow-md backdrop-blur-md transition hover:bg-white/60 hover:shadow-lg"
          >
            to-do
          </Link>

          <Link
            href="/calendar"
            className="rounded-lg border border-white/40 bg-white/40 px-3 py-1 text-gray-700 shadow-md backdrop-blur-md transition hover:bg-white/60 hover:shadow-lg"
          >
            calendar
          </Link>
        </div>
      </div>
    </nav>
  );
}