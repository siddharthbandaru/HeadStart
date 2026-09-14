"use client";

import Link from "next/link";

import { useHeadstart } from "./context/HeadstartContext";
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

const formatDueDate = (date: string) => {
  const dueDate = new Date(date);

  const day = dueDate.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
  });

  const time = dueDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${day} at ${time}`;
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
      toggleCheckpoint,
      } = useHeadstart();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayString = today.toISOString().split("T")[0];

  const checkpointsDueToday = checkpoints.filter(
    (checkpoint) => checkpoint.date === todayString
  );

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const weekRange = `${startOfWeek.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  })} - ${endOfWeek.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  })}`;

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
    <main className="min-h-screen"
      style={{
        backgroundColor: "#F0EEE9",
        backgroundImage: "repeating-linear-gradient(to bottom, transparent 0px, transparent 35px, #8db5c7a7 35px, #8DB5C7a7 36px), linear-gradient(to right, transparent 115px, #E44B4B 115px, #E44B4B 116px, transparent 116px)",
    }}>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            
            <h1
              className={`${itim.className} text-[40px] -mt-3 -mb-4 -mx-6`}>
              <span className="text-[#000000]">welcome back, </span>
              <span className="text-[#2573B8]">clara</span>
            </h1>

            <p className={`${itim.className} text-[28px] mt-1.5 -mb-4 mx-6`}>
              get a head start on your work today!
            </p>
          </div>

          <div className={`${itim.className} flex items-center gap-3 my-3 text-[24px]`}>
          <Link
            href="/assignments/new"
            className="rounded-lg border border-white/40 bg-black/51 px-3 py-1 text-[#F0EEE9] shadow-md backdrop-blur-md transition hover:bg-white/60 hover:shadow-lg text-[24px]"
          >
            + new assignment
          </Link>
          </div>
        </div>


        <div className={`${loveYaLikeASister.className} text-[45px] mt-6 -mb-4`}>
           <h1>
            Today
           </h1>
        </div>

       <section className={`${itim.className} mx-10 my-3 text-[#000000] text-[21px]`}>
          <div className="space-y-3 w-75/100">
            {checkpointsDueToday.length > 0 ? (
              checkpointsDueToday.slice(0, 3).map((checkpoint) => {
                const assignment = assignments.find(
                  (assignment) => assignment.id === checkpoint.assignmentId
                );

                const classInfo = classes.find(
                  (classInfo) => classInfo.id === assignment?.classId
                );

                return (
                <div
                  key={checkpoint.id}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-2 shadow-md backdrop-blur-md transition ${
                    checkpoint.completed
                      ? "border-gray-300 bg-gray-100/60"
                      : "border-white/40 bg-white/40"}`}
                 >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={checkpoint.completed}
                      onChange={() => toggleCheckpoint(checkpoint.id)}
                      className="h-5 w-5 appearance-none rounded-full border-2 border-gray-400 checked:border-gray-400 checked:bg-gray-400"
                    />

                    <div>
                      <p
                        className={
                          checkpoint.completed
                            ? "text-gray-400 line-through"
                            : "text-black"
                        }
                      >
                        {checkpoint.title}
                      </p>

                      <p className="text-[14px]">
                        {classInfo && (
                          <span style={{ color: classInfo.colorClasses }}>
                            {classInfo.name}
                          </span>
                        )}

                        <span className="text-gray-500">
                          {" • "}{assignment?.title}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-[21px] text-[#000000]">
                    <span>
                      <p>{formatTime(checkpoint.estimatedMinutes)}</p>
                    </span>
                    <span className="text-[14px] text-[#DBA901]">
                      <p>Due {formatDueDate(checkpoint.date)}</p>
                    </span>
                  </div>
                </div>
                );
              })

              ) : (<p>No tasks scheduled for today!</p>

              )}

              {checkpointsDueToday.length > 3 && (
                <div className="flex w-full justify-end -mx-3 -my-1">
                  <Link
                    href="/todo"
                    className="text-[18px] text-underline text-gray-500 hover:text-black"
                  >
                    See all tasks →
                  </Link>
                </div>
              )}
          </div>
        </section>
        

        <div className={`${loveYaLikeASister.className} text-[45px] mt-6 -mb-4`}>
           <h1>
            Weekly Progress
           </h1>
        </div>

        <section className="rounded-lg border border-white/40 bg-white/40 px-3 mx-10 my-3 py-1 text-gray-700 shadow-md backdrop-blur-md transition hover:bg-white/60 hover:shadow">
          <div className={`${itim.className} flex items-start justify-between`}>

            <h2 className="mt-2 text-2xl font-semibold">
              {weekRange}
            </h2>

            <span className="flex items-center text-gray-400 gap-3 my-3 text-[18px]">
              {completedThisWeek} of {weeklyTotal} checkpoints completed this week
            </span>
          </div>

          <div className={`${itim.className} -mt-1 text-[18px]`}>
            <p className="mb-1 text-gray-600">
              {weeklyProgress}% Complete
            </p>

            <div className="h-3 w-full mb-3 rounded-full bg-gray-200">
              <div
                className="h-3 rounded-full bg-[#64A249]"
                style={{ width: weeklyProgress + "%" }}
              />
            </div>
          </div>

          
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

      </div>
    </main>
  );
}