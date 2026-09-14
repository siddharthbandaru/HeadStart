import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold">
          Headstart
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/" className="text-gray-600 hover:text-black">
            Dashboard
          </Link>

          <Link
            href="/assignments"
            className="text-gray-600 hover:text-black"
          >
            Assignments
          </Link>

          <Link
            href="/classes"
            className="text-gray-600 hover:text-black"
          >
            Classes
          </Link>


          <Link href="/todo" className="text-gray-600 hover:text-black">
            To-Do
          </Link>

          <Link
            href="/calendar"
            className="text-gray-600 hover:text-black"
          >
            Calendar
          </Link>

          <Link
            href="/assignments/new"
            className="rounded-lg bg-black px-4 py-2 text-white"
          >
            + New Assignment
          </Link>
        </div>
      </div>
    </nav>
  );
}