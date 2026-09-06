"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import {
  assignments,
  checkpoints,
  classes,
} from "../../data/headstartData";

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

export default function AssignmentPage() {
  const params = useParams();

  const assignmentId = Number(params.id);

  const assignment = assignments.find(
    (assignment) => assignment.id === assignmentId
  );

  const assignmentCheckpoints = checkpoints.filter(
    (checkpoint) => checkpoint.assignmentId === assignmentId
  );

  const classInfo = classes.find(
    (classInfo) => classInfo.id === assignment?.classId
  );

  const [completed, setCompleted] = useState<number[]>(
    assignmentCheckpoints
      .filter((checkpoint) => checkpoint.completed)
      .map((checkpoint) => checkpoint.id)
  );

  const toggleCheckpoint = (id: number) => {
    if (completed.includes(id)) {
      setCompleted(
        completed.filter((checkpointId) => checkpointId !== id)
      );
    } else {
      setCompleted([...completed, id]);
    }
  };

  const progress =
    assignmentCheckpoints.length === 0
      ? 0
      : Math.round(
          (completed.length / assignmentCheckpoints.length) * 100
        );

  if (!assignment) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/assignments"
            className="text-sm font-medium text-gray-600 hover:text-black"
          >
            ← Back to assignments
          </Link>

          <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-bold">
              Assignment not found
            </h1>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/assignments"
          className="mb-6 inline-block text-sm font-medium text-gray-600 hover:text-black"
        >
          ← Back to assignments
        </Link>

        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">
                ACTIVE ASSIGNMENT
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-bold">
                  {assignment.title}
                </h1>

                {classInfo && (
                  <span
                    className={`rounded-full border px-3 py-1 text-sm font-medium ${classInfo.colorClasses}`}
                  >
                    {classInfo.name}
                  </span>
                )}
              </div>

              <p className="mt-3 text-gray-600">
                Due {formatDate(assignment.dueDate)}
              </p>
            </div>

            <span className="text-lg font-semibold">
              {progress}%
            </span>
          </div>

          <div className="mt-6 h-3 rounded-full bg-gray-200">
            <div
              className="h-3 rounded-full bg-black transition-all"
              style={{ width: progress + "%" }}
            />
          </div>

          <p className="mt-3 text-sm text-gray-500">
            {completed.length} of {assignmentCheckpoints.length} checkpoints complete
          </p>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold">
            Checkpoints
          </h2>

          <div className="mt-4 space-y-4">
            {assignmentCheckpoints.map((checkpoint) => {
              const isCompleted = completed.includes(
                checkpoint.id
              );

              return (
                <div
                  key={checkpoint.id}
                  className={`rounded-2xl border p-6 transition ${
                    isCompleted
                      ? "border-gray-200 bg-gray-100 opacity-60"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        toggleCheckpoint(checkpoint.id)
                      }
                      className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                        isCompleted
                          ? "border-black bg-black text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isCompleted && (
                        <span className="text-xs">
                          ✓
                        </span>
                      )}
                    </button>

                    <div className="flex-1">
                      <h3
                        className={`text-lg font-semibold ${
                          isCompleted
                            ? "text-gray-500 line-through"
                            : ""
                        }`}
                      >
                        {checkpoint.title}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>
                          {formatDate(checkpoint.date)}
                        </span>

                        <span>
                          {formatTime(
                            checkpoint.estimatedMinutes
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {assignmentCheckpoints.length === 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-500">
                No checkpoints yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}