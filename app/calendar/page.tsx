
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

const dateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function CalendarPage() {
  const { assignments, checkpoints, classes } = useHeadstart();

  const [displayedMonth, setDisplayedMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const todayKey = dateKey(new Date());

  const year = displayedMonth.getFullYear();
  const month = displayedMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOffset = new Date(year, month, 1).getDay();

  const calendarCells: (number | null)[] = [
    ...Array(firstDayOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  // Complete the final week so the calendar stays rectangular.
  while (calendarCells.length % 7 !== 0) {
    calendarCells.push(null);
  }

  const changeMonth = (offset: number) => {
    setDisplayedMonth(new Date(year, month + offset, 1));
  };

  return (
    <main
      className={`min-h-screen px-6 py-12 ${itim.className}`}
      style={notebookBackground}
    >
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1
              className={`${loveYaLikeASister.className} text-[44px] leading-tight text-black`}
            >
              Calendar
            </h1>

            <p className="mt-2 text-[19px] text-gray-600">
              See when every checkpoint is scheduled.
            </p>
          </div>

          <Link
            href="/assignments/new"
            className="rounded-lg bg-[#2573B8] px-5 py-3 text-[19px] text-white transition hover:bg-[#1c609c]"
          >
            + New Assignment
          </Link>
        </div>

        {/* Month navigation */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <h2
            className={`${loveYaLikeASister.className} text-[36px] text-black`}
          >
            {displayedMonth.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h2>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              aria-label="Previous month"
              className="rounded-lg border border-white/40 bg-white/20 px-4 py-2 text-[22px] backdrop-blur-[0.75px] shadow-md transition hover:bg-white/30"
            >
              ←
            </button>

            <button
              type="button"
              onClick={() => {
                const today = new Date();
                setDisplayedMonth(
                  new Date(today.getFullYear(), today.getMonth(), 1)
                );
              }}
              className="rounded-lg border border-white/40 bg-white/20 px-4 py-2 text-[17px] backdrop-blur-[0.75px] shadow-md transition hover:bg-white/30"
            >
              Today
            </button>

            <button
              type="button"
              onClick={() => changeMonth(1)}
              aria-label="Next month"
              className="rounded-lg border border-white/40 bg-white/20 px-4 py-2 text-[22px] backdrop-blur-[0.75px] shadow-md transition hover:bg-white/30"
            >
              →
            </button>
          </div>
        </div>

        {/* Class color key */}
        {classes.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-3">
            {classes.map((classInfo) => (
              <div
                key={classInfo.id}
                className="rounded-full border px-3 py-1 text-[16px]"
                style={{
                  color: classInfo.colorClasses,
                  borderColor: classInfo.colorClasses,
                  backgroundColor: `${classInfo.colorClasses}1a`,
                }}
              >
                {classInfo.name}
              </div>
            ))}
          </div>
        )}

        {/* Calendar grid */}
        <div className="mt-6 overflow-x-auto rounded-xl border border-white/40 bg-white/20 backdrop-blur-[0.75px] shadow-md">
          <div className="min-w-[700px]">
            {/* Day headings */}
            <div className="grid grid-cols-7 border-b border-white/40">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day) => (
                  <div
                    key={day}
                    className="border-r border-white/40 px-3 py-3 text-center text-[17px] text-gray-600 last:border-r-0"
                  >
                    {day}
                  </div>
                )
              )}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7">
              {calendarCells.map((day, index) => {
                const cellDate =
                  day === null
                    ? null
                    : dateKey(new Date(year, month, day));

                const dayCheckpoints = cellDate
                  ? checkpoints.filter(
                      (checkpoint) =>
                        checkpoint.date.split("T")[0] === cellDate
                    )
                  : [];

                const isToday = cellDate === todayKey;

                return (
                  <div
                    key={index}
                    className={`min-h-44 min-w-0 border-b border-r border-white/40 p-2 last:border-r-0 md:p-3 ${
                      day === null ? "bg-white/10" : "bg-white/5"
                    }`}
                  >
                    {day !== null && (
                      <>
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-[17px] ${
                            isToday
                              ? "bg-[#2573B8] text-white"
                              : "text-gray-700"
                          }`}
                        >
                          {day}
                        </div>

                        <div className="mt-3 space-y-2">
                          {dayCheckpoints.map((checkpoint) => {
                            const assignment = assignments.find(
                              (item) =>
                                item.id === checkpoint.assignmentId
                            );

                            const classInfo = classes.find(
                              (item) =>
                                item.id === assignment?.classId
                            );

                            return (
                              <Link
                                key={checkpoint.id}
                                href={`/assignments/${checkpoint.assignmentId}`}
                                className="block rounded-lg border px-2 py-2 transition hover:opacity-80"
                                style={{
                                  borderColor:
                                    classInfo?.colorClasses ??
                                    "#D1D5DB",
                                  backgroundColor: classInfo?.colorClasses
                                    ? `${classInfo.colorClasses}1a`
                                    : "#FFFFFF33",
                                }}
                              >
                                <p
                                  className={`break-words text-[15px] leading-tight ${
                                    checkpoint.completed
                                      ? "text-gray-500 line-through"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {checkpoint.title}
                                </p>

                                <p
                                  className="mt-1 text-[13px]"
                                  style={{
                                    color:
                                      classInfo?.colorClasses ??
                                      "#6B7280",
                                  }}
                                >
                                  {classInfo?.name ?? "No class"}
                                </p>

                                <p className="mt-1 truncate text-[13px] text-gray-500">
                                  {assignment?.title ??
                                    "Unknown assignment"}
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
        </div>
      </div>
    </main>
  );
}