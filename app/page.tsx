import Link from "next/link";

type TaskStatus = "late" | "today" | "upcoming";

const todayTasks: {
  id: number;
  assignmentId: number;
  title: string;
  assignment: string;
  status: TaskStatus;
  estimatedMinutes: number;
}[] = [
  {
    id: 1,
    assignmentId: 1,
    title: "Read and annotate sources",
    assignment: "Research Paper",
    status: "today",
    estimatedMinutes: 120,
  },
  {
    id: 2,
    assignmentId: 2,
    title: "Complete kernel setup",
    assignment: "Operating Systems Project",
    status: "today",
    estimatedMinutes: 90,
  },
  {
    id: 3,
    assignmentId: 3,
    title: "Create presentation outline",
    assignment: "Design Presentation",
    status: "upcoming",
    estimatedMinutes: 45,
  },
];

const weekDays = [
  {
    day: "Sun",
    date: 6,
    checkpoints: [
      { title: "Read + annotate sources", assignmentId: 1 },
      { title: "Complete kernel setup", assignmentId: 2 },
    ],
  },
  {
    day: "Mon",
    date: 7,
    checkpoints: [
      { title: "Finish source notes", assignmentId: 1 },
      { title: "Review project requirements", assignmentId: 2 },
      { title: "Brainstorm presentation", assignmentId: 3 },
    ],
  },
  {
    day: "Tue",
    date: 8,
    checkpoints: [
      { title: "Create thesis + outline", assignmentId: 1 },
    ],
  },
  {
    day: "Wed",
    date: 9,
    checkpoints: [],
  },
  {
    day: "Thu",
    date: 10,
    checkpoints: [
      { title: "Write first draft", assignmentId: 1 },
      { title: "Create presentation outline", assignmentId: 3 },
    ],
  },
  {
    day: "Fri",
    date: 11,
    checkpoints: [
      { title: "Test kernel changes", assignmentId: 2 },
    ],
  },
  {
    day: "Sat",
    date: 12,
    checkpoints: [
      { title: "Revise first draft", assignmentId: 1 },
    ],
  },
];

export default function Home() {
  const weeklyCompleted = 6;
  const weeklyTotal = 10;

  const weeklyProgress = Math.round(
    (weeklyCompleted / weeklyTotal) * 100
  );

  const taskStyles = {
    late: "border-red-300 bg-red-50",
    today: "border-yellow-300 bg-yellow-50",
    upcoming: "border-green-300 bg-green-50",
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) {
      return `${mins} min`;
    }

    if (mins === 0) {
      return `${hours} hr`;
    }

    return `${hours} hr ${mins} min`;
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">
              DASHBOARD
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Welcome back
            </h1>

            <p className="mt-2 text-gray-600">
              Here&apos;s what your week looks like.
            </p>
          </div>

          <Link
            href="/assignments/new"
            className="rounded-lg bg-black px-5 py-3 font-medium text-white"
          >
            + New Assignment
          </Link>
        </div>

        {/* Weekly progress */}
        <section className="mt-10 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                THIS WEEK
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                Weekly Progress
              </h2>
            </div>

            <span className="text-lg font-semibold">
              {weeklyProgress}%
            </span>
          </div>

          <div className="mt-5 h-3 w-full rounded-full bg-gray-200">
            <div
              className="h-3 rounded-full bg-black"
              style={{ width: weeklyProgress + "%" }}
            />
          </div>

          <p className="mt-3 text-sm text-gray-600">
            {weeklyCompleted} of {weeklyTotal} checkpoints completed this week
          </p>
        </section>

        {/* Main dashboard grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* Today's tasks */}
          <section className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  TODAY
                </p>

                <h2 className="mt-1 text-2xl font-semibold">
                  Your To-Do
                </h2>
              </div>

              <Link
                href="/todo"
                className="text-sm font-medium text-gray-600 hover:text-black"
              >
                View all →
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {todayTasks.map((task) => (
                <Link
                  key={task.id}
                  href={"/assignments/" + task.assignmentId}
                  className={`block rounded-xl border p-4 transition hover:shadow-sm ${taskStyles[task.status]}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">
                        {task.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-600">
                        {task.assignment}
                      </p>
                    </div>

                    <span className="whitespace-nowrap text-sm text-gray-500">
                      {formatTime(task.estimatedMinutes)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Next deadline */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              NEXT DEADLINE
            </p>

            <h2 className="mt-3 text-2xl font-semibold">
              Research Paper
            </h2>

            <p className="mt-2 text-gray-600">
              Due September 15
            </p>

            <div className="mt-6 rounded-xl bg-gray-100 p-4">
              <p className="text-sm text-gray-500">
                Time remaining
              </p>

              <p className="mt-1 text-3xl font-bold">
                9 days
              </p>
            </div>

            <Link
              href="/assignments/1"
              className="mt-5 inline-block text-sm font-medium hover:underline"
            >
              View assignment →
            </Link>
          </section>
        </div>

        {/* Weekly calendar */}
        <Link
          href="/calendar"
          className="mt-6 block rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                CALENDAR
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                This Week
              </h2>
            </div>

            <span className="text-sm font-medium text-gray-600">
              View full calendar →
            </span>
          </div>

          <div className="mt-6 grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <div
                key={day.day}
                className="rounded-xl border border-gray-200 p-3 text-center"
              >
                <p className="text-xs font-medium text-gray-500">
                  {day.day}
                </p>

                <p className="mt-1 text-xl font-semibold">
                  {day.date}
                </p>

                <div className="mt-3">
                  {day.checkpoints > 0 ? (
                    <span className="inline-flex min-h-7 min-w-7 items-center justify-center rounded-full bg-black px-2 text-xs font-medium text-white">
                      {day.checkpoints}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-300">
                      —
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Link>

        {/* Momentum */}
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            MOMENTUM
          </p>

          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">
                Nice progress this week
              </h2>

              <p className="mt-2 text-gray-600">
                You&apos;ve completed 6 checkpoints and have 4 left.
              </p>
            </div>

            <p className="text-4xl">
              ✦
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}