
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Love_Ya_Like_A_Sister, Itim } from "next/font/google";
import { useHeadstart } from "../../context/HeadstartContext";

const loveYaLikeASister = Love_Ya_Like_A_Sister({
  weight: "400",
  subsets: ["latin"],
});

const itim = Itim({
  weight: "400",
  subsets: ["latin"],
});

const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} hr`;

  return `${hours} hr ${mins} min`;
};

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

const notebookBackground = {
  backgroundColor: "#F0EEE9",
  backgroundImage:
    "repeating-linear-gradient(to bottom, transparent 0px, transparent 35px, #8db5c7a7 35px, #8db5c7a7 36px), linear-gradient(to right, transparent 115px, #E44B4B 115px, #E44B4B 116px, transparent 116px)",
};

export default function AssignmentPage() {
  const params = useParams();
  const router = useRouter();

  const {
    assignments,
    checkpoints,
    classes,
    toggleCheckpoint,
    deleteAssignment,
  } = useHeadstart();

  const assignmentId = Number(params.id);

  const assignment = assignments.find(
    (item) => item.id === assignmentId
  );

  const assignmentCheckpoints = checkpoints
    .filter((checkpoint) => checkpoint.assignmentId === assignmentId)
    .sort((a, b) => a.date.localeCompare(b.date));

  const completedCount = assignmentCheckpoints.filter(
    (checkpoint) => checkpoint.completed
  ).length;

  const progress =
    assignmentCheckpoints.length === 0
      ? 0
      : Math.round(
          (completedCount / assignmentCheckpoints.length) * 100
        );

  if (!assignment) {
    return (
      <main
        className={`min-h-screen px-6 py-12 ${itim.className}`}
        style={notebookBackground}
      >
        <div className="mx-auto max-w-4xl">
          <Link
            href="/assignments"
            className="text-[18px] text-gray-600 hover:text-black"
          >
            ← Back to assignments
          </Link>

          <div className="mt-8 rounded-xl border border-white/40 bg-white/20 backdrop-blur-[0.75px] p-8 shadow-md">
            <h1 className={`${loveYaLikeASister.className} text-[40px]`}>
              Assignment not found
            </h1>
          </div>
        </div>
      </main>
    );
  }

  const classInfo = classes.find(
    (item) => item.id === assignment.classId
  );

  const handleDeleteAssignment = async () => {
    const confirmed = window.confirm(
      `Delete "${assignment.title}"? This will also delete all of its checkpoints.`
    );

    if (!confirmed) return;

    await deleteAssignment(assignment.id);
    router.push("/assignments");
  };

  return (
    <main
      className={`min-h-screen px-6 py-12 ${itim.className}`}
      style={notebookBackground}
    >
      <div className="mx-auto max-w-4xl">
        <Link
          href="/assignments"
          className="inline-block text-[18px] text-gray-600 hover:text-black"
        >
          ← Back to assignments
        </Link>

        {/* Assignment overview */}
        <section className="mt-6 rounded-xl border border-white/40 bg-white/20 p-6 backdrop-blur-[0.75px] shadow-md md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">

              <h1
                className={`${loveYaLikeASister.className} -mt-6 break-words text-[42px] leading-tight text-black`}
              >
                {assignment.title}
              </h1>

              <div className="mt-1 flex flex-wrap items-center gap-3">
                {classInfo && (
                  <span
                    className="px-3 py-1 text-[25px]"
                    style={{
                      color: classInfo.colorClasses,
                    }}
                  >
                    {classInfo.name}
                  </span>
                )}

                <span className="text-[18px] text-gray-600">
                  Due {formatDate(assignment.dueDate)}
                </span>
              </div>
            </div>

            <span className="text-[26px] text-[#2573B8]">
              {progress}%
            </span>
          </div>

          <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-white/60">
            <div
              className="h-full rounded-full bg-[#2573B8] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-2 text-[16px] text-gray-600">
            {completedCount} of {assignmentCheckpoints.length} checkpoints
            completed
          </p>
        </section>

        {/* Checkpoints */}
        <div className="mt-8">
          <h2
            className={`${loveYaLikeASister.className} text-[40px] text-black`}
          >
            Checkpoints
          </h2>

          <div className="mt-4 space-y-3">
            {assignmentCheckpoints.map((checkpoint) => {
              const isCompleted = checkpoint.completed;

              return (
                <div
                  key={checkpoint.id}
                  className={`rounded-lg border px-5 py-4 backdrop-blur-[0.75px] shadow-md transition ${
                    isCompleted
                      ? "border-gray-300/50 bg-white/20"
                      : "border-white/40 bg-white/30 hover:bg-white/35"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      aria-label={`Mark ${checkpoint.title} as ${
                        isCompleted ? "incomplete" : "complete"
                      }`}
                      checked={isCompleted}
                      onChange={() => toggleCheckpoint(checkpoint.id)}
                      className="mt-1 h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-full border-2 border-gray-400 checked:border-[#2573B8] checked:bg-[#2573B8]"
                    />

                    <div className="min-w-0 flex-1">
                      <h3
                        className={`break-words text-[22px] ${
                          isCompleted
                            ? "text-gray-500 line-through"
                            : "text-black"
                        }`}
                      >
                        {checkpoint.title}
                      </h3>

                      <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-[16px] text-gray-500">
                        <span>Due {formatDate(checkpoint.date)}</span>
                        <span>{formatTime(checkpoint.estimatedMinutes)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {assignmentCheckpoints.length === 0 && (
              <div className="rounded-lg border border-white/40 bg-white/20 p-6 text-[20px] text-gray-500 backdrop-blur-[0.75px] shadow-md">
                No checkpoints yet.
              </div>
            )}
          </div>
        </div>

        {/* Delete assignment */}
        <div className="mt-1 pt-5">
          <button
            type="button"
            onClick={handleDeleteAssignment}
            className="text-[18px] text-[#9c2133] hover:underline"
          >
            Delete assignment
          </button>
        </div>
      </div>
    </main>
  );
}