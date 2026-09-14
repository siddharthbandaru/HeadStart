"use client"
import Link from "next/link";

import { useHeadstart } from "../context/HeadstartContext";


const formatDate = (date: string) => {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
};

export default function AssignmentsPage() {
  const {
    assignments,
    checkpoints,
    classes,
  } = useHeadstart();

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Assignments</h1>

            <p className="mt-2 text-gray-600">
              View and manage your active assignments.
            </p>
          </div>

          <Link
            href="/assignments/new"
            className="rounded-lg bg-black px-5 py-3 text-white"
          >
            + New Assignment
          </Link>
        </div>

        <div className="mt-8 space-y-4">
          {assignments.map((assignment) => {
            const assignmentCheckpoints = checkpoints.filter(
              (checkpoint) =>
                checkpoint.assignmentId === assignment.id
            );

            const completedCheckpoints =
              assignmentCheckpoints.filter(
                (checkpoint) => checkpoint.completed
              ).length;

            const totalCheckpoints = assignmentCheckpoints.length;

            const progress =
              totalCheckpoints === 0
                ? 0
                : Math.round(
                    (completedCheckpoints / totalCheckpoints) * 100
                  );

            const classInfo = classes.find(
              (classInfo) => classInfo.id === assignment.classId
            );

            return (
              <Link
                key={assignment.id}
                href={"/assignments/" + assignment.id}
                className="block rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold">
                        {assignment.title}
                      </h2>

                      {classInfo && (
                        <span
                          className={`rounded-full border px-2 py-1 text-xs font-medium ${classInfo.colorClasses}`}
                        >
                          {classInfo.name}
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-gray-600">
                      Due {formatDate(assignment.dueDate)}
                    </p>
                  </div>

                  <span className="text-sm font-medium text-gray-500">
                    {progress}%
                  </span>
                </div>

                <div className="mt-4 h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-black"
                    style={{ width: progress + "%" }}
                  />
                </div>

                <p className="mt-3 text-sm text-gray-500">
                  {completedCheckpoints} of {totalCheckpoints} checkpoints complete
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}