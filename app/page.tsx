import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Headstart</h1>
            <p className="mt-2 text-gray-600">
              Stay ahead of your assignments.
            </p>
          </div>

          <Link
            href="/assignments/new"
            className="rounded-lg bg-black px-5 py-3 font-medium text-white"
          >
            Create Assignment
          </Link>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold">
            Active Assignments
          </h2>

          <Link
            href="/assignments/1"
            className="mt-4 block rounded-2xl bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold">
                  Research Paper
                </h3>

                <p className="mt-1 text-gray-600">
                  Due September 15
                </p>
              </div>

              <p className="text-sm font-medium text-gray-500">
                40%
              </p>
            </div>

            <div className="mt-4 h-3 w-full rounded-full bg-gray-200">
              <div className="h-3 w-[40%] rounded-full bg-black" />
            </div>

            <p className="mt-3 text-sm text-gray-600">
              2 of 5 checkpoints complete
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}