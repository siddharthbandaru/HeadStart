import Link from "next/link";

type Checkpoint = {
  id: number;
  assignmentId: number;
  title: string;
  assignment: string;
  className: string;
  date: number;
};

const checkpoints: Checkpoint[] = [
  {
    id: 1,
    assignmentId: 1,
    title: "Read + annotate sources",
    assignment: "Research Paper",
    className: "ENC 1102",
    date: 6,
  },
  {
    id: 2,
    assignmentId: 2,
    title: "Complete kernel setup",
    assignment: "Operating Systems Project",
    className: "COP 4600",
    date: 6,
  },
  {
    id: 3,
    assignmentId: 3,
    title: "Create presentation outline",
    assignment: "Design Presentation",
    className: "DIG 2121",
    date: 10,
  },
];

const classColors: Record<string, string> = {
  "ENC 1102": "bg-blue-100 border-blue-400",
  "COP 4600": "bg-purple-100 border-purple-400",
  "DIG 2121": "bg-green-100 border-green-400",
};

const daysInMonth = 30;

// September 1, 2026 is a Tuesday.
// Sunday = 0, Monday = 1, Tuesday = 2
const firstDayOffset = 2;

export default function CalendarPage() {
  const calendarCells = [
    ...Array(firstDayOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">
              CALENDAR
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              September 2026
            </h1>

            <p className="mt-2 text-gray-600">
              See when every checkpoint is scheduled.
            </p>
          </div>

          <Link
            href="/assignments/new"
            className="rounded-lg bg-black px-5 py-3 font-medium text-white"
          >
            + New Assignment
          </Link>
        </div>

        {/* Class color key */}
        <div className="mt-6 flex flex-wrap gap-3">
        {Object.entries(classColors).map(([className, color]) => (
            <div
            key={className}
            className={`rounded-lg border px-3 py-2 text-sm font-medium ${color}`}
            >
            {className}
            </div>
        ))}
        </div>

        {/* Day headings */}
        <div className="mt-10 grid grid-cols-7 border-b border-gray-200">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
            (day) => (
              <div
                key={day}
                className="px-3 py-3 text-sm font-semibold text-gray-500"
              >
                {day}
              </div>
            )
          )}
        </div>

        {/* Calendar */}
        <div className="grid grid-cols-7 border-l border-gray-200">
          {calendarCells.map((day, index) => {
            const dayCheckpoints =
              day === null
                ? []
                : checkpoints.filter(
                    (checkpoint) => checkpoint.date === day
                  );

            const isToday = day === 6;

            return (
              <div
                key={index}
                className={`min-h-40 border-b border-r border-gray-200 p-3 ${
                  day === null ? "bg-gray-100" : "bg-white"
                }`}
              >
                {day !== null && (
                  <>
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                        isToday
                          ? "bg-black text-white"
                          : "text-gray-700"
                      }`}
                    >
                      {day}
                    </div>

                    <div className="mt-3 space-y-2">
                      {dayCheckpoints.map((checkpoint) => (
                        <Link
                          key={checkpoint.id}
                          href={
                            "/assignments/" +
                            checkpoint.assignmentId
                          }
                          className={`block rounded-lg border px-2 py-2 transition hover:opacity-80 ${
                            classColors[checkpoint.className] ??
                            "border-gray-200 bg-gray-100"
                            }`}
                        >
                          <p className="text-xs font-semibold leading-tight text-gray-900">
                            {checkpoint.title}
                          </p>

                          <p className="mt-1 truncate text-xs text-gray-500">
                            {checkpoint.assignment}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}