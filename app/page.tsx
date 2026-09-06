"use client";

import Link from "next/link";

import { useHeadstart } from "../../context/HeadstartContext";


type TaskStatus = "late" | "today" | "upcoming";

const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} hr`;

  return `${hours} hr ${mins} min`;
};

const formatDate = (date: string) => {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
};

const getTaskStatus = (date: string): TaskStatus => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const taskDate = new Date(`${date}T00:00:00`);

  if (taskDate < today) return "late";
  if (taskDate.getTime() === today.getTime()) return "today";

  return "upcoming";
};

export default function Home() {
  const {
      assignments,
      checkpoints,
      classes,
      } = useHeadstart();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const oneWeekFromToday = new Date(today);
  oneWeekFromToday.setDate(today.getDate() + 6);

  const activeCheckpoints = checkpoints.filter(
    (checkpoint) => !checkpoint.completed
  );

  const dashboardTasks = activeCheckpoints
    .filter((checkpoint) => {
      const checkpointDate = new Date(
        `${checkpoint.date}T00:00:00`
      );

      return checkpointDate <= oneWeekFromToday;
    })
    .sort(
      (a, b) =>
        new Date(`${a.date}T00:00:00`).getTime() -
        new Date(`${b.date}T00:00:00`).getTime()
    )
    .slice(0, 3);

  const weekCheckpoints = checkpoints.filter((checkpoint) => {
    const checkpointDate = new Date(
      `${checkpoint.date}T00:00:00`
    );

    return (
      checkpointDate >= today &&
      checkpointDate <= oneWeekFromToday
    );
  });

  const completedThisWeek = weekCheckpoints.filter(
    (checkpoint) => checkpoint.completed
  ).length;

  const weeklyTotal = weekCheckpoints.length;

  const weeklyProgress =
    weeklyTotal === 0
      ? 0
      : Math.round(
          (completedThisWeek / weeklyTotal) * 100
        );

  const nextDeadline = assignments
    .filter((assignment) => {
      const dueDate = new Date(
        `${assignment.dueDate}T00:00:00`
      );

      return dueDate >= today;
    })
    .sort(
      (a, b) =>
        new Date(`${a.dueDate}T00:00:00`).getTime() -
        new Date(`${b.dueDate}T00:00:00`).getTime()
    )[0];

  const taskStyles: Record<TaskStatus, string> = {
    late: "border-red-300 bg-red-50",
    today: "border-yellow-300 bg-yellow-50",
    upcoming: "border-green-300 bg-green-50",
  };

  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);

    const dateString = date.toISOString().split("T")[0];

    const dayCheckpoints = checkpoints.filter(
      (checkpoint) => checkpoint.date === dateString
    );

    return {
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      date: date.getDate(),
      checkpoints: dayCheckpoints,
    };
  });

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

        {/* Weekly Progress */}
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
            {completedThisWeek} of {weeklyTotal} checkpoints completed this week
          </p>
        </section>

        {/* Main Grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* To-Do */}
          <section className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  UP NEXT
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
              {dashboardTasks.map((checkpoint) => {
                const assignment = assignments.find(
                  (assignment) =>
                    assignment.id === checkpoint.assignmentId
                );

                const classInfo = classes.find(
                  (classInfo) =>
                    classInfo.id === assignment?.classId
                );

                const status = getTaskStatus(
                  checkpoint.date
                );

                return (
                  <Link
                    key={checkpoint.id}
                    href={
                      "/assignments/" +
                      checkpoint.assignmentId
                    }
                    className={`block rounded-xl border p-4 transition hover:shadow-sm ${taskStyles[status]}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium text-gray-500">
                            {formatDate(
                              checkpoint.date
                            )}
                          </p>

                          {classInfo && (
                            <span
                              className={`rounded-full border px-2 py-1 text-xs font-medium ${classInfo.colorClasses}`}
                            >
                              {classInfo.name}
                            </span>
                          )}
                        </div>

                        <h3 className="mt-2 font-semibold">
                          {checkpoint.title}
                        </h3>

                        <p className="mt-1 text-sm text-gray-600">
                          {assignment?.title ??
                            "Unknown assignment"}
                        </p>
                      </div>

                      <span className="whitespace-nowrap text-sm text-gray-500">
                        {formatTime(
                          checkpoint.estimatedMinutes
                        )}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Next Deadline */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              NEXT DEADLINE
            </p>

            {nextDeadline ? (
              <>
                <h2 className="mt-3 text-2xl font-semibold">
                  {nextDeadline.title}
                </h2>

                <p className="mt-2 text-gray-600">
                  Due {formatDate(nextDeadline.dueDate)}
                </p>

                <Link
                  href={
                    "/assignments/" + nextDeadline.id
                  }
                  className="mt-5 inline-block text-sm font-medium hover:underline"
                >
                  View assignment →
                </Link>
              </>
            ) : (
              <p className="mt-3 text-gray-500">
                No upcoming deadlines.
              </p>
            )}
          </section>
        </div>

        {/* Weekly Calendar */}
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                CALENDAR
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                This Week
              </h2>
            </div>

            <Link
              href="/calendar"
              className="text-sm font-medium text-gray-600 hover:text-black"
            >
              View full calendar →
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <div
                key={day.day}
                className="min-w-0 rounded-xl border border-gray-200 p-3"
              >
                <p className="text-xs font-medium text-gray-500">
                  {day.day}
                </p>

                <p className="mt-1 text-xl font-semibold">
                  {day.date}
                </p>

                <div className="mt-3 space-y-2">
                  {day.checkpoints.length > 0 ? (
                    day.checkpoints.map(
                      (checkpoint) => {
                        const assignment =
                          assignments.find(
                            (assignment) =>
                              assignment.id ===
                              checkpoint.assignmentId
                          );

                        const classInfo =
                          classes.find(
                            (classInfo) =>
                              classInfo.id ===
                              assignment?.classId
                          );

                        return (
                          <Link
                            key={checkpoint.id}
                            href={
                              "/assignments/" +
                              checkpoint.assignmentId
                            }
                            className={`block rounded-lg border px-2 py-2 ${
                              classInfo?.colorClasses ??
                              "border-gray-200 bg-gray-100"
                            }`}
                          >
                            <p className="break-words text-xs font-medium leading-tight">
                              {checkpoint.title}
                            </p>
                          </Link>
                        );
                      }
                    )
                  ) : (
                    <span className="text-sm text-gray-300">
                      —
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Momentum */}
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            MOMENTUM
          </p>

          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">
                Keep it moving
              </h2>

              <p className="mt-2 text-gray-600">
                You have {activeCheckpoints.length} active checkpoints remaining.
              </p>
            </div>

            <p className="text-4xl">✦</p>
          </div>
        </section>
      </div>
    </main>
  );
}