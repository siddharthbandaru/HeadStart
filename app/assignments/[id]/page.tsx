"use client";

import Link from "next/link";

import { useState } from "react";

const checkpoints = [
  {
    id: 1,
    date: "2026-09-05",
    title: "Find 5 scholarly sources",
    estimatedMinutes: 60,
  },
  {
    id: 2,
    date: "2026-09-06",
    title: "Read and annotate sources",
    estimatedMinutes: 120,
  },
  {
    id: 3,
    date: "2026-09-08",
    title: "Create thesis and outline",
    estimatedMinutes: 60,
  },
  {
    id: 4,
    date: "2026-09-10",
    title: "Write first draft",
    estimatedMinutes: 180,
  },
  {
    id: 5,
    date: "2026-09-14",
    title: "Final review + buffer",
    estimatedMinutes: 45,
  },
];

export default function ActiveAssignmentPage() {
  const [completed, setCompleted] = useState<number[]>([]);

  const toggleCheckpoint = (id: number) => {
    if (completed.includes(id)) {
      setCompleted(completed.filter((checkpointId) => checkpointId !== id));
    } else {
      setCompleted([...completed, id]);
    }
  };

  const progress = Math.round(
    (completed.length / checkpoints.length) * 100
  );

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


  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <Link
            href="/assignments"
            className="mb-6 inline-block text-sm font-medium text-gray-600 hover:text-black"
            >
            ← Back to assignments
        </Link>

        <p className="text-sm font-medium text-gray-500">
          ACTIVE ASSIGNMENT
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Research Paper
        </h1>

        <p className="mt-2 text-gray-600">
          Due September 15
        </p>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-sm text-gray-600">
            <span>
              {completed.length} of {checkpoints.length} checkpoints complete
            </span>

            <span>{progress}%</span>
          </div>

          <div className="h-3 w-full rounded-full bg-gray-200">
            <div
              className="h-3 rounded-full bg-black"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {checkpoints.map((checkpoint) => {
            const isCompleted = completed.includes(checkpoint.id);

            return (
              <div
                key={checkpoint.id}
                className="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-sm"
              >
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={() => toggleCheckpoint(checkpoint.id)}
                  className="mt-1 h-5 w-5"
                />

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {checkpoint.date}
                  </p>

                  <h2
                    className={`mt-1 text-xl font-semibold ${
                      isCompleted ? "text-gray-400 line-through" : ""
                    }`}
                  >
                    {checkpoint.title}
                  </h2>

                  <p className="mt-1 text-gray-600">
                    Estimated time: {formatTime(checkpoint.estimatedMinutes)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}