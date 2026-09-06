"use client"
import Link from "next/link";
import { useHeadstart } from "../context/HeadstartContext";


const daysInMonth = 30;
const firstDayOffset = 2;

export default function CalendarPage() {
  const {
    assignments,
    checkpoints,
    classes,
  } = useHeadstart();

  const calendarCells = [
    ...Array(firstDayOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">
              CALENDAR
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              September 2026
            </h1>

            <p className="mt-2 text-gray-600">
              See when every checkpoint is scheduled.
            </p>
          </div>

          <Link
            href="/assignments/new"
            className="rounded-lg bg-black px-5 py-3 font-medium text-white"
          >
            + New Assignment
          </Link>
        </div>

        {/* Class color key */}
        <div className="mt-6 flex flex-wrap gap-3">
          {classes.map((classInfo) => (
            <div
              key={classInfo.id}
              className={`rounded-lg border px-3 py-2 text-sm font-medium ${classInfo.colorClasses}`}
            >
              {classInfo.name}
            </div>
          ))}
        </div>

        {/* Day headings */}
        <div className="mt-10 grid grid-cols-7 border-b border-gray-200">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
            (day) => (
              <div
                key={day}
                className="px-3 py-3 text-sm font-semibold text-gray-500"
              >
                {day}
              </div>
            )
          )}
        </div>

        {/* Calendar */}
        <div className="grid grid-cols-7 border-l border-gray-200">
          {calendarCells.map((day, index) => {
            const dayCheckpoints =
              day === null
                ? []
                : checkpoints.filter((checkpoint) => {
                    const checkpointDay = Number(
                      checkpoint.date.split("-")[2]
                    );

                    return checkpointDay === day;
                  });

            const isToday = day === 6;

            return (
              <div
                key={index}
                className={`min-h-44 border-b border-r border-gray-200 p-3 ${
                  day === null ? "bg-gray-100" : "bg-white"
                }`}
              >
                {day !== null && (
                  <>
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                        isToday
                          ? "bg-black text-white"
                          : "text-gray-700"
                      }`}
                    >
                      {day}
                    </div>

                    <div className="mt-3 space-y-2">
                      {dayCheckpoints.map((checkpoint) => {
                        const assignment = assignments.find(
                          (assignment) =>
                            assignment.id === checkpoint.assignmentId
                        );

                        const classInfo = classes.find(
                          (classInfo) =>
                            classInfo.id === assignment?.classId
                        );

                        return (
                          <Link
                            key={checkpoint.id}
                            href={
                              "/assignments/" +
                              checkpoint.assignmentId
                            }
                            className={`block rounded-lg border px-2 py-2 transition hover:opacity-80 ${
                              classInfo?.colorClasses ??
                              "border-gray-200 bg-gray-100"
                            }`}
                          >
                            <p className="text-xs font-semibold leading-tight text-gray-900">
                              {checkpoint.title}
                            </p>

                            <p className="mt-1 text-xs text-gray-600">
                              {classInfo?.name ?? "No class"}
                            </p>

                            <p className="mt-1 truncate text-xs text-gray-500">
                              {assignment?.title ?? "Unknown assignment"}
                            </p>
                          </Link>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}