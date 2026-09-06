"use client";

import Link from "next/link";
import { useState } from "react";

const tasks = [
  {
    id: 1,
    assignmentId: 1,
    assignment: "Research Paper",
    title: "Find 5 scholarly sources",
    date: "2026-09-05",
    estimatedMinutes: 60,
    completed: true,
  },
  {
    id: 2,
    assignmentId: 1,
    assignment: "Research Paper",
    title: "Read and annotate sources",
    date: "2026-09-06",
    estimatedMinutes: 120,
    completed: false,
  },
  {
    id: 3,
    assignmentId: 1,
    assignment: "Research Paper",
    title: "Create thesis and outline",
    date: "2026-09-08",
    estimatedMinutes: 60,
    completed: false,
  },
  {
    id: 4,
    assignmentId: 2,
    assignment: "Operating Systems Project",
    title: "Complete kernel setup",
    date: "2026-09-06",
    estimatedMinutes: 90,
    completed: false,
  },
  {
    id: 5,
    assignmentId: 2,
    assignment: "Operating Systems Project",
    title: "Review project requirements",
    date: "2026-09-04",
    estimatedMinutes: 30,
    completed: true,
  },
];

const getTaskStatus = (date: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const taskDate = new Date(`${date}T00:00:00`);

  if (taskDate < today) {
    return "late";
  }

  if (taskDate.getTime() === today.getTime()) {
    return "today";
  }

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

  if (hours === 0) {
    return `${mins} min`;
  }

  if (mins === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${mins} min`;
};

export default function TodoPage() {
  const [showCompleted, setShowCompleted] = useState(false);

  const incompleteTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div>
          <h1 className="text-4xl font-bold">To-Do</h1>

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
                onClick={() => setShowCompleted(!showCompleted)}
                className="text-sm font-medium text-gray-600 hover:text-black"
              >
                {showCompleted
                  ? "Hide completed"
                  : `Show completed (${completedTasks.length})`}
              </button>
            )}
          </div>

          <div className="mt-4 space-y-4">
            {incompleteTasks.map((task) => {
              const status = getTaskStatus(task.date);

              const statusStyles = {
                late: "border-red-300 bg-red-50",
                today: "border-yellow-300 bg-yellow-50",
                upcoming: "border-green-300 bg-green-50",
              };

              const statusLabels = {
                late: "Late",
                today: "Due today",
                upcoming: "Upcoming",
              };

              return (
                <Link
                  key={task.id}
                  href={`/assignments/${task.assignmentId}`}
                  className={`block rounded-2xl border p-6 transition hover:shadow-sm ${statusStyles[status]}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {formatDate(task.date)}
                      </p>

                      <h3 className="mt-1 text-xl font-semibold">
                        {task.title}
                      </h3>

                      <p className="mt-1 text-gray-600">
                        {task.assignment}
                      </p>

                      <p className="mt-2 text-sm text-gray-500">
                        Estimated time:{" "}
                        {formatTime(task.estimatedMinutes)}
                      </p>
                    </div>

                    <span className="whitespace-nowrap text-sm font-medium text-gray-600">
                      {statusLabels[status]}
                    </span>
                  </div>
                </Link>
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

        {showCompleted && completedTasks.length > 0 && (
          <div className="mt-10 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-semibold text-gray-500">
              Completed
            </h2>

            <div className="mt-4 space-y-4">
              {completedTasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/assignments/${task.assignmentId}`}
                  className="block rounded-2xl border border-gray-200 bg-gray-100 p-6 opacity-60 transition hover:opacity-80"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-400">
                        {formatDate(task.date)}
                      </p>

                      <h3 className="mt-1 text-xl font-semibold text-gray-500 line-through">
                        {task.title}
                      </h3>

                      <p className="mt-1 text-gray-500">
                        {task.assignment}
                      </p>

                      <p className="mt-2 text-sm text-gray-400">
                        Estimated time:{" "}
                        {formatTime(task.estimatedMinutes)}
                      </p>
                    </div>

                    <span className="whitespace-nowrap text-sm font-medium text-gray-500">
                      Completed
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}