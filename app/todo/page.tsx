"use client";

import Link from "next/link";
import { useState } from "react";
import { useHeadstart } from "../context/HeadstartContext";

type TaskStatus = "late" | "today" | "upcoming";

const getTaskStatus = (date: string): TaskStatus => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const taskDate = new Date(`${date}T00:00:00`);

  if (taskDate < today) return "late";
  if (taskDate.getTime() === today.getTime()) return "today";

  return "upcoming";
};

const formatDate = (date: string) => {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
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

  const statusStyles: Record<TaskStatus, string> = {
    late: "border-red-300 bg-red-50",
    today: "border-yellow-300 bg-yellow-50",
    upcoming: "border-green-300 bg-green-50",
  };

  const statusLabels: Record<TaskStatus, string> = {
    late: "Late",
    today: "Due today",
    upcoming: "Upcoming",
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div>
          <h1 className="text-4xl font-bold">
            To-Do
          </h1>

          <p className="mt-2 text-gray-600">
            Checkpoints across all your assignments.
          </p>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Your Tasks
            </h2>

            {completedTasks.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  setShowCompleted(!showCompleted)
                }
                className="text-sm font-medium text-gray-600 hover:text-black"
              >
                {showCompleted
                  ? "Hide completed"
                  : `Show completed (${completedTasks.length})`}
              </button>
            )}
          </div>

          <div className="mt-4 space-y-4">
            {incompleteTasks.map((checkpoint) => {
              const status = getTaskStatus(
                checkpoint.date
              );

              const assignment = assignments.find(
                (assignment) =>
                  assignment.id === checkpoint.assignmentId
              );

              const classInfo = classes.find(
                (classInfo) =>
                  classInfo.id === assignment?.classId
              );

              return (
                <div
                  key={checkpoint.id}
                  className={`flex items-start gap-4 rounded-2xl border p-6 transition hover:shadow-sm ${statusStyles[status]}`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      toggleCheckpoint(checkpoint.id)
                    }
                    className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-gray-400 bg-white transition hover:border-black"
                    aria-label={`Mark ${checkpoint.title} complete`}
                  />

                  <Link
                    href={
                      "/assignments/" +
                      checkpoint.assignmentId
                    }
                    className="flex-1"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium text-gray-500">
                            {formatDate(checkpoint.date)}
                          </p>

                          {classInfo && (
                            <span
                              className={`rounded-full border px-2 py-1 text-xs font-medium ${classInfo.colorClasses}`}
                            >
                              {classInfo.name}
                            </span>
                          )}
                        </div>

                        <h3 className="mt-2 text-xl font-semibold">
                          {checkpoint.title}
                        </h3>

                        <p className="mt-1 text-gray-600">
                          {assignment?.title ??
                            "Unknown assignment"}
                        </p>

                        <p className="mt-2 text-sm text-gray-500">
                          Estimated time:{" "}
                          {formatTime(
                            checkpoint.estimatedMinutes
                          )}
                        </p>
                      </div>

                      <span className="whitespace-nowrap text-sm font-medium text-gray-600">
                        {statusLabels[status]}
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}

            {incompleteTasks.length === 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
                <p className="font-medium">
                  You&apos;re all caught up!
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  No active checkpoints right now.
                </p>
              </div>
            )}
          </div>
        </div>

        {showCompleted &&
          completedTasks.length > 0 && (
            <div className="mt-10 border-t border-gray-200 pt-8">
              <h2 className="text-xl font-semibold text-gray-500">
                Completed
              </h2>

              <div className="mt-4 space-y-4">
                {completedTasks.map((checkpoint) => {
                  const assignment =
                    assignments.find(
                      (assignment) =>
                        assignment.id ===
                        checkpoint.assignmentId
                    );

                  const classInfo = classes.find(
                    (classInfo) =>
                      classInfo.id ===
                      assignment?.classId
                  );

                  return (
                    <div
                      key={checkpoint.id}
                      className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-gray-100 p-6 opacity-60 transition hover:opacity-80"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          toggleCheckpoint(checkpoint.id)
                        }
                        className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-black bg-black text-white"
                        aria-label={`Mark ${checkpoint.title} incomplete`}
                      >
                        ✓
                      </button>

                      <Link
                        href={
                          "/assignments/" +
                          checkpoint.assignmentId
                        }
                        className="flex-1"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-medium text-gray-400">
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

                            <h3 className="mt-2 text-xl font-semibold text-gray-500 line-through">
                              {checkpoint.title}
                            </h3>

                            <p className="mt-1 text-gray-500">
                              {assignment?.title ??
                                "Unknown assignment"}
                            </p>

                            <p className="mt-2 text-sm text-gray-400">
                              Estimated time:{" "}
                              {formatTime(
                                checkpoint.estimatedMinutes
                              )}
                            </p>
                          </div>

                          <span className="whitespace-nowrap text-sm font-medium text-gray-500">
                            Completed
                          </span>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
      </div>
    </main>
  );
}