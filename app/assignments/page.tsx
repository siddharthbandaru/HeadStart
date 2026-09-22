
"use client";

import Link from "next/link";
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

const formatDate = (date: string) => {
  return new Date(`${date.split("T")[0]}T00:00:00`).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
    }
  );
};

const notebookBackground = {
  backgroundColor: "#F0EEE9",
  backgroundImage:
    "repeating-linear-gradient(to bottom, transparent 0px, transparent 35px, #8db5c7a7 35px, #8db5c7a7 36px), linear-gradient(to right, transparent 115px, #E44B4B 115px, #E44B4B 116px, transparent 116px)",
};

export default function AssignmentsPage() {
  const { assignments, checkpoints, classes } = useHeadstart();

  return (
    <main
      className={`min-h-screen px-6 py-12 ${itim.className}`}
      style={notebookBackground}
    >
      <div className="mx-auto max-w-4xl">
        {/* Page heading */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1
              className={`${loveYaLikeASister.className} text-[44px] leading-tight text-black`}
            >
              Assignments
            </h1>

            <p className="mt-2 text-[19px] text-gray-600">
              View and manage your active assignments.
            </p>
          </div>

          <Link
            href="/assignments/new"
            className="rounded-lg bg-[#2573B8] px-5 py-3 text-[19px] text-white transition hover:bg-[#1c609c]"
          >
            + New Assignment
          </Link>
        </div>

        {/* Assignment cards */}
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
              (item) => item.id === assignment.classId
            );

            return (
              <Link
                key={assignment.id}
                href={`/assignments/${assignment.id}`}
                className="block rounded-xl border border-white/40 bg-white/20 p-6 backdrop-blur-[0.75px] shadow-md transition hover:bg-white/30"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2
                        className={`${loveYaLikeASister.className} break-words text-[28px] leading-tight text-black`}
                      >
                        {assignment.title}
                      </h2>

                      {classInfo && (
                        <span
                          className="rounded-full border px-3 py-1 text-[16px]"
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

                    <p className="mt-2 text-[18px] text-gray-600">
                      Due {formatDate(assignment.dueDate)}
                    </p>
                  </div>

                  <span className="text-[24px] text-[#2573B8]">
                    {progress}%
                  </span>
                </div>

                <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-white/60">
                  <div
                    className="h-full rounded-full bg-[#2573B8] transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="mt-2 text-[16px] text-gray-600">
                  {completedCheckpoints} of {totalCheckpoints} checkpoints
                  completed
                </p>
              </Link>
            );
          })}

          {assignments.length === 0 && (
            <div className="rounded-xl border border-white/40 bg-white/20 p-8 text-center backdrop-blur-[0.75px] shadow-md">
              <h2
                className={`${loveYaLikeASister.className} text-[30px]`}
              >
                No assignments yet!
              </h2>

              <p className="mt-2 text-[18px] text-gray-600">
                Create your first assignment to get started.
              </p>

              <Link
                href="/assignments/new"
                className="mt-5 inline-block rounded-lg bg-[#2573B8] px-5 py-3 text-[19px] text-white transition hover:bg-[#1c609c]"
              >
                + New Assignment
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}