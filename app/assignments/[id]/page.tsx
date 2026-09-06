export default function ActiveAssignmentPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold">
          Research Paper
        </h1>

        <p className="mt-2 text-gray-600">
          Due September 15
        </p>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            Active Plan
          </h2>

          <p className="mt-2 text-gray-600">
            Your checkpoints will go here.
          </p>
        </div>
      </div>
    </main>
  );
}