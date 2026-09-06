"use client";

import Link from "next/link";
import { useState } from "react";

export default function AssignmentPlanPage() {
  const [checkpoints, setCheckpoints] = useState([
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
  ]);

  const updateCheckpoint = (
    id: number,
    field: "title" | "date" | "estimatedMinutes",
    value: string | number
  ) => {
    setCheckpoints(
      checkpoints.map((checkpoint) =>
        checkpoint.id === id
          ? { ...checkpoint, [field]: value }
          : checkpoint
      )
    );
  };

  const deleteCheckpoint = (id: number) => {
    setCheckpoints(
      checkpoints.filter((checkpoint) => checkpoint.id !== id)
    );
  };

  const addCheckpoint = () => {
    const newCheckpoint = {
      id: Date.now(),
      date: "",
      title: "",
      estimatedMinutes: 0,
    };

    setCheckpoints([...checkpoints, newCheckpoint]);
  };

    const isPlanValid = checkpoints.every(
    (checkpoint) =>
        checkpoint.date !== "" &&
        checkpoint.title.trim() !== "" &&
        checkpoint.estimatedMinutes > 0
    );

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
              <input
                type="date"
                value={checkpoint.date}
                onChange={(e) =>
                  updateCheckpoint(
                    checkpoint.id,
                    "date",
                    e.target.value
                  )
                }
                className="rounded-lg border border-gray-300 px-3 py-2"
              />

              <input
                type="text"
                value={checkpoint.title}
                onChange={(e) =>
                  updateCheckpoint(
                    checkpoint.id,
                    "title",
                    e.target.value
                  )
                }
                className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-xl font-semibold"
              />

              <div className="mt-3">
                <label className="mb-2 block text-sm text-gray-600">
                    Estimated time
                </label>

                <select
                    value={checkpoint.estimatedMinutes}
                    onChange={(e) =>
                    updateCheckpoint(
                        checkpoint.id,
                        "estimatedMinutes",
                        Number(e.target.value)
                    )
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                    <option value={0} disabled>
                        Choose a time
                    </option>

                    <option value={15}>15 min</option>
                    <option value={30}>30 min</option>
                    <option value={45}>45 min</option>
                    <option value={60}>1 hr</option>
                    <option value={90}>1 hr 30 min</option>
                    <option value={120}>2 hr</option>
                    <option value={150}>2 hr 30 min</option>
                    <option value={180}>3 hr</option>
                    <option value={240}>4 hr</option>
                    <option value={300}>5 hr</option>
                </select>
                </div>

              <button
                type="button"
                onClick={() => deleteCheckpoint(checkpoint.id)}
                className="mt-4 text-sm font-medium text-red-600"
              >
                Remove checkpoint
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addCheckpoint}
          className="mt-4 w-full rounded-lg border border-gray-300 px-6 py-3 font-medium"
        >
          + Add Checkpoint
        </button>

        <div className="mt-8">
          {isPlanValid ? (
            <Link
                href="/assignments/1"
                className="block w-full rounded-lg bg-black px-6 py-3 text-center font-medium text-white"
            >
                Accept Plan
            </Link>
            ) : (
            <button
                disabled
                className="w-full cursor-not-allowed rounded-lg bg-gray-300 px-6 py-3 font-medium text-gray-500"
            >
                Complete all checkpoints to continue
            </button>
            )}
        </div>
      </div>
    </main>
  );
}