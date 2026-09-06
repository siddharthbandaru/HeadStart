import Link from "next/link";

const checkpoints = [
  {
    id: 1,
    date: "SEPTEMBER 5",
    title: "Find 5 scholarly sources",
    estimatedTime: "1 hour",
  },
  {
    id: 2,
    date: "SEPTEMBER 6",
    title: "Read and annotate sources",
    estimatedTime: "2 hours",
  },
  {
    id: 3,
    date: "SEPTEMBER 8",
    title: "Create thesis and outline",
    estimatedTime: "1 hour",
  },
  {
    id: 4,
    date: "SEPTEMBER 10",
    title: "Write first draft",
    estimatedTime: "3 hours",
  },
  {
    id: 5,
    date: "SEPTEMBER 14",
    title: "Final review + buffer",
    estimatedTime: "45 minutes",
  },
];

export default function AssignmentPlanPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-500">YOUR PLAN</p>

          <h1 className="mt-2 text-4xl font-bold">
            Research Paper
          </h1>

          <p className="mt-2 text-gray-600">
            Due September 15
          </p>
        </div>

        <div className="space-y-4">
          {checkpoints.map((checkpoint) => (
            <div
              key={checkpoint.id}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-gray-500">
                {checkpoint.date}
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                {checkpoint.title}
              </h2>

              <p className="mt-2 text-gray-600">
                Estimated time: {checkpoint.estimatedTime}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8">
            <Link
                    href="/assignments/1" 
                    className=" block w-full rounded-lg bg-black px-6 py-3 text-center font-medium text-white"
            >
                Accept Plan
            </Link>
          </div>
      </div>
    </main>
  );
}