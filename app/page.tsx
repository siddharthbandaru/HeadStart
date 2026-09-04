import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold">Headstart</h1>

      <p className="mt-4 text-lg">
        Turn assignments into a realistic plan.
      </p>

      <Link
      href="/assignments/new"
      className="mt-6 rounded-lg bg-black px-6 py-3 text-white"
      >
        Create Assignment
      </Link>
    </main>
  );
}
