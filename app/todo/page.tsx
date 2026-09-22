
"use client";

import Link from "next/link";
import { useState } from "react";
import { Love_Ya_Like_A_Sister, Itim } from "next/font/google";
import { useHeadstart } from "../context/HeadstartContext";

const loveYaLikeASister = Love_Ya_Like_A_Sister({
  weight: "400",
  subsets: ["latin"],
});

const itim = Itim({
  weight: "400",
  subsets: ["latin"],
});

const notebookBackground = {
  backgroundColor: "#F0EEE9",
  backgroundImage:
    "repeating-linear-gradient(to bottom, transparent 0px, transparent 35px, #8db5c7a7 35px, #8db5c7a7 36px), linear-gradient(to right, transparent 115px, #E44B4B 115px, #E44B4B 116px, transparent 116px)",
};

type TaskStatus = "late" | "today" | "upcoming";

const getTaskStatus = (date: string): TaskStatus => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const taskDate = new Date(`${date.split("T")[0]}T00:00:00`);

  if (taskDate < today) return "late";
  if (taskDate.getTime() === today.getTime()) return "today";

  return "upcoming";
};

const formatDate = (date: string) => {
  return new Date(
    `${date.split("T")[0]}T00:00:00`
  ).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
};

const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} hr`;

  return `${hours} hr ${mins} min`;
};

const cardStyle =
  "rounded-xl border border-white/40 bg-white/20 p-6 backdrop-blur-[0.75px] shadow-md";

export default function TodoPage() {
  const {
    assignments,
    checkpoints,
    classes,
    toggleCheckpoint,
  } = useHeadstart();

  const [showCompleted, setShowCompleted] = useState(false);

  const incompleteTasks = checkpoints.filter(
    (checkpoint) => !checkpoint.completed
  );

  const completedTasks = checkpoints.filter(
    (checkpoint) => checkpoint.completed
  );

  const statusLabels: Record<TaskStatus, string> = {
    late: "Late",
    today: "Due today",
    upcoming: "Upcoming",
  };

  const statusColors: Record<TaskStatus, string> = {
    late: "text-[#9c2133]",
    today: "text-amber-700",
    upcoming: "text-green-700",
  };

  return (
    <main
      className={`min-h-screen px-6 py-12 ${itim.className}`}
      style={notebookBackground}
    >
      <div className="mx-auto max-w-4xl">
        {/* Heading */}
        <div>
          <h1
            className={`${loveYaLikeASister.className} text-[44px] leading-tight text-black`}
          >
            To-Do
          </h1>

          <p className="mt-2 text-[19px] text-gray-600">
            Checkpoints across all your assignments.
          </p>
        </div>

        {/* Active tasks */}
        <section className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2
              className={`${loveYaLikeASister.className} text-[32px] text-black`}
            >
              Your Tasks
            </h2>

            {completedTasks.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  setShowCompleted((current) => !current)
                }
                className="text-[17px] text-[#2573B8] hover:underline"
              >
                {showCompleted
                  ? "Hide completed"
                  : `Show completed (${completedTasks.length})`}
              </button>
            )}
          </div>

          <div className="mt-4 space-y-4">
            {incompleteTasks.map((checkpoint) => {
              const status = getTaskStatus(checkpoint.date);

              const assignment = assignments.find(
                (item) => item.id === checkpoint.assignmentId
              );

              const classInfo = classes.find(
                (item) => item.id === assignment?.classId
              );

              return (
                <div
                  key={checkpoint.id}
                  className={`flex items-start gap-4 ${cardStyle} transition hover:bg-white/30`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      toggleCheckpoint(checkpoint.id)
                    }
                    className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[#2573B8] bg-white/30 transition hover:bg-[#2573B8]/10"
                    aria-label={`Mark ${checkpoint.title} complete`}
                  />

                  <Link
                    href={`/assignments/${checkpoint.assignmentId}`}
                    className="min-w-0 flex-1"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[17px] text-gray-600">
                            {formatDate(checkpoint.date)}
                          </p>

                          {classInfo && (
                            <span
                              className="rounded-full border px-3 py-1 text-[15px]"
                              style={{
                                color: classInfo.colorClasses,
                                borderColor: classInfo.colorClasses,
                                backgroundColor: `${classInfo.colorClasses}1a`,
                              }}
                            >
                              {classInfo.name}
                            </span>
                          )}
                        </div>

                        <h3
                          className={`${loveYaLikeASister.className} mt-2 break-words text-[28px] leading-tight text-black`}
                        >
                          {checkpoint.title}
                        </h3>

                        <p className="mt-1 text-[18px] text-gray-600">
                          {assignment?.title ??
                            "Unknown assignment"}
                        </p>

                        <p className="mt-2 text-[16px] text-gray-500">
                          Estimated time:{" "}
                          {formatTime(checkpoint.estimatedMinutes)}
                        </p>
                      </div>

                      <span
                        className={`whitespace-nowrap text-[16px] ${statusColors[status]}`}
                      >
                        {statusLabels[status]}
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}

            {incompleteTasks.length === 0 && (
              <div className={`${cardStyle} text-center`}>
                <h3
                  className={`${loveYaLikeASister.className} text-[30px]`}
                >
                  You&apos;re all caught up!
                </h3>

                <p className="mt-2 text-[18px] text-gray-600">
                  No active checkpoints right now.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Completed tasks */}
        {showCompleted && completedTasks.length > 0 && (
          <section className="mt-10">
            <h2
              className={`${loveYaLikeASister.className} text-[32px] text-black`}
            >
              Completed
            </h2>

            <div className="mt-4 space-y-4">
              {completedTasks.map((checkpoint) => {
                const assignment = assignments.find(
                  (item) => item.id === checkpoint.assignmentId
                );

                const classInfo = classes.find(
                  (item) => item.id === assignment?.classId
                );

                return (
                  <div
                    key={checkpoint.id}
                    className={`flex items-start gap-4 ${cardStyle} transition hover:bg-white/30`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        toggleCheckpoint(checkpoint.id)
                      }
                      className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2573B8] text-white transition hover:bg-[#1c609c]"
                      aria-label={`Mark ${checkpoint.title} incomplete`}
                    >
                      ✓
                    </button>

                    <Link
                      href={`/assignments/${checkpoint.assignmentId}`}
                      className="min-w-0 flex-1"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-[17px] text-gray-500">
                              {formatDate(checkpoint.date)}
                            </p>

                            {classInfo && (
                              <span
                                className="rounded-full border px-3 py-1 text-[15px]"
                                style={{
                                  color: classInfo.colorClasses,
                                  borderColor: classInfo.colorClasses,
                                  backgroundColor: `${classInfo.colorClasses}1a`,
                                }}
                              >
                                {classInfo.name}
                              </span>
                            )}
                          </div>

                          <h3
                            className={`${loveYaLikeASister.className} mt-2 break-words text-[28px] leading-tight text-gray-500 line-through`}
                          >
                            {checkpoint.title}
                          </h3>

                          <p className="mt-1 text-[18px] text-gray-500">
                            {assignment?.title ??
                              "Unknown assignment"}
                          </p>

                          <p className="mt-2 text-[16px] text-gray-500">
                            Estimated time:{" "}
                            {formatTime(checkpoint.estimatedMinutes)}
                          </p>
                        </div>

                        <span className="whitespace-nowrap text-[16px] text-gray-500">
                          Completed
                        </span>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}