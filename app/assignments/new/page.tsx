export default function NewAssignmentPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Create Assignment</h1>

        <p className="mt-2 text-gray-600">
          Add your assignment details and Headstart will build a plan for you.
        </p>

        <form className="mt-8 space-y-6">
          <div>
            <label className="mb-2 block font-medium">
              Assignment Name
            </label>

            <input
              type="text"
              placeholder="Research Paper"
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Assignment Directions
            </label>

            <textarea
              placeholder="Paste your assignment instructions here..."
              rows={7}
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Available From
            </label>

            <input
              type="date"
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Due Date
            </label>

            <input
              type="datetime-local"
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Assignment File
            </label>

            <input
              type="file"
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Rubric
            </label>

            <input
              type="file"
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />

            <p className="mt-1 text-sm text-gray-500">
              Optional
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-black px-6 py-3 font-medium text-white"
          >
            Generate Plan
          </button>
        </form>
      </div>
    </main>
  );
}
