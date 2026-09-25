"use client";

import Link from "next/link";

import { useHeadstart } from "./context/HeadstartContext";
import { supabase } from "@/lib/supabase";
import { Love_Ya_Like_A_Sister } from "next/font/google";
import { Itim } from "next/font/google";
import { useRef, useEffect, useState } from "react";


const itim = Itim({
  weight: "400",
  subsets: ["latin"],
});
const loveYaLikeASister = Love_Ya_Like_A_Sister({
  weight: "400",
  subsets: ["latin"],
});


type TaskStatus = "late" | "today" | "upcoming";

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

const formatDueDate = (date: string) => {
  const dueDate = new Date(date);

  const day = dueDate.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
  });

  const time = dueDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${day} at ${time}`;
};

const getTaskStatus = (date: string): TaskStatus => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const taskDate = new Date(`${date}T00:00:00`);

  if (taskDate < today) return "late";
  if (taskDate.getTime() === today.getTime()) return "today";

  return "upcoming";
};

const getOrdinal = (day: number) => {
  if (day >= 11 && day <= 13) return `${day}th`;

  switch (day % 10) {
    case 1: return `${day}st`;
    case 2: return `${day}nd`;
    case 3: return `${day}rd`;
    default: return `${day}th`;
  }
};

export default function Home() {
  const {
    assignments,
    checkpoints,
    classes,
    toggleCheckpoint,
  } = useHeadstart();


  const [recentlyCompleted, setRecentlyCompleted] = useState<number[]>([]);

  const completionTimers = useRef<
    Map<number, ReturnType<typeof setTimeout>>
  >(new Map());

  const [notes, setNotes] = useState("");
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    setNotes(localStorage.getItem("headstart-notes") ?? "");
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setFirstName(user.user_metadata?.first_name ?? "");
      }
    };

    loadUser();
  }, []);

  const updateNotes = (value: string) => {
    setNotes(value);
    localStorage.setItem("headstart-notes", value);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayString = today.toLocaleDateString("en-CA");

  const checkpointsDueToday = checkpoints.filter(
    (checkpoint) =>
      checkpoint.date === todayString &&
      (!checkpoint.completed || recentlyCompleted.includes(checkpoint.id))
  );

  const incompleteAssignments = assignments
    .filter((assignment) => {
      const assignmentCheckpoints = checkpoints.filter(
        (checkpoint) => checkpoint.assignmentId === assignment.id
      );

      return (
        assignmentCheckpoints.length === 0 ||
        assignmentCheckpoints.some((checkpoint) => !checkpoint.completed)
      );
    })
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const upcomingAssignments = incompleteAssignments.slice(0, 3);

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const weekRange = `${startOfWeek.toLocaleDateString("en-US", {
    month: "long",
  })} ${getOrdinal(startOfWeek.getDate())} – ${getOrdinal(endOfWeek.getDate())}`;

  const oneWeekFromToday = new Date(today);
  oneWeekFromToday.setDate(today.getDate() + 6);

  const activeCheckpoints = checkpoints.filter(
    (checkpoint) => !checkpoint.completed || recentlyCompleted.includes(checkpoint.id)
  );

  const dashboardTasks = activeCheckpoints
    .sort((a, b) => {
      const aRecent = recentlyCompleted.includes(a.id);
      const bRecent = recentlyCompleted.includes(b.id);

      if (aRecent !== bRecent) return aRecent ? -1 : 1;

      return a.date.localeCompare(b.date);
    })
    .slice(0, 3);

  const weekCheckpoints = checkpoints.filter((checkpoint) => {
    const checkpointDate = new Date(
      `${checkpoint.date}T00:00:00`
    );

    return (
      checkpointDate >= today &&
      checkpointDate <= oneWeekFromToday
    );
  });

  const completedThisWeek = weekCheckpoints.filter(
    (checkpoint) => checkpoint.completed
  ).length;

  const weeklyTotal = weekCheckpoints.length;

  const weeklyProgress =
    weeklyTotal === 0
      ? 0
      : Math.round(
        (completedThisWeek / weeklyTotal) * 100
      );

  const nextDeadline = assignments
    .filter((assignment) => {
      const dueDate = new Date(
        `${assignment.dueDate}T00:00:00`
      );

      return dueDate >= today;
    })
    .sort(
      (a, b) =>
        new Date(`${a.dueDate}T00:00:00`).getTime() -
        new Date(`${b.dueDate}T00:00:00`).getTime()
    )[0];

  const taskStyles: Record<TaskStatus, string> = {
    late: "text-[##9c2133]",
    today: "text-[#DBA901]",
    upcoming: "text-[#64A249]",
  };

  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);

    const dateString = date.toLocaleDateString("en-CA");

    const dayCheckpoints = checkpoints.filter(
      (checkpoint) => checkpoint.date === dateString
    );

    return {
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      date: date.getDate(),
      checkpoints: dayCheckpoints,
    };
  });

  return (
    <main className="min-h-screen"
      style={{
        backgroundColor: "#F0EEE9",
        backgroundImage: "repeating-linear-gradient(to bottom, transparent 0px, transparent 35px, #8db5c7a7 35px, #8DB5C7a7 36px), linear-gradient(to right, transparent 115px, #E44B4B 115px, #E44B4B 116px, transparent 116px)",
      }}>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>

            <h1
              className={`${itim.className} text-[40px] -mt-3 -mb-4 -mx-6`}
            >
              <span className="text-[#000000]">welcome back, </span>
              <span className="text-[#2573B8]">
                {firstName || "there"}
              </span>
            </h1>

            <p className={`${itim.className} text-[28px] mt-1.5 -mb-4 mx-6`}>
              get a head start on your work today!
            </p>
          </div>

          <div className={`${itim.className} flex items-center gap-3 my-3 text-[24px]`}>
            <Link
              href="/assignments/new"
              className="rounded-lg border border-white/40 bg-black/20 px-3 py-1 text-[#F0EEE9] shadow-md backdrop-blur-[0.75px] transition hover:bg-white/40 hover:text-black/40 hover:shadow-lg text-[24px]"
            >
              + new assignment
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="min-w-0">
            <div className={`${loveYaLikeASister.className} text-[45px] mt-6 -mb-4`}>
              <h1>
                Today
              </h1>
            </div>

            <section className={`${itim.className} mx-10 my-3 text-[#000000] text-[21px]`}>
              <div className="space-y-3 w-65/100">
                {checkpointsDueToday.length > 0 ? (
                  checkpointsDueToday.slice(0, 3).map((checkpoint) => {
                    const assignment = assignments.find(
                      (assignment) => assignment.id === checkpoint.assignmentId
                    );

                    const classInfo = classes.find(
                      (classInfo) => classInfo.id === assignment?.classId
                    );

                    return (
                      <div
                        key={checkpoint.id}
                        className={`flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-2 shadow-md backdrop-blur-[0.75px] transition ${checkpoint.completed
                            ? "border-gray-300 bg-gray-100/60"
                            : "border-white/40 bg-white/20"}`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={checkpoint.completed}
                            onChange={() => {
                              const id = checkpoint.id;
                              const existingTimer = completionTimers.current.get(id);

                              if (recentlyCompleted.includes(id)) {
                                if (existingTimer) {
                                  clearTimeout(existingTimer);
                                  completionTimers.current.delete(id);
                                }

                                setRecentlyCompleted((prev) =>
                                  prev.filter((taskId) => taskId !== id)
                                );

                                toggleCheckpoint(id);
                                return;
                              }

                              setRecentlyCompleted((prev) => [...prev, id]);
                              toggleCheckpoint(id);

                              const timer = setTimeout(() => {
                                setRecentlyCompleted((prev) =>
                                  prev.filter((taskId) => taskId !== id)
                                );

                                completionTimers.current.delete(id);
                              }, 2000);

                              completionTimers.current.set(id, timer);
                            }}
                            className="h-5 w-5 appearance-none rounded-full border-2 border-gray-400 checked:border-gray-400 checked:bg-gray-400"
                          />

                          <div>
                            <p
                              className={
                                checkpoint.completed
                                  ? "text-gray-400 line-through"
                                  : "text-black"
                              }
                            >
                              {checkpoint.title}
                            </p>

                            <p className="text-[14px]">
                              {classInfo && (
                                <span style={{ color: classInfo.colorClasses }}>
                                  {classInfo.name}
                                </span>
                              )}

                              <span className="text-gray-500">
                                {" • "}{assignment?.title}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="text-right text-[21px] text-[#000000]">
                          <span>
                            <p>{formatTime(checkpoint.estimatedMinutes)}</p>
                          </span>
                          <span className={`text-[14px] ${taskStyles[getTaskStatus(checkpoint.date)]}`}>
                            <p>Due {formatDueDate(checkpoint.date)}</p>
                          </span>
                        </div>
                      </div>
                    );
                  })

                ) : (<p className="text-gray-500">No tasks scheduled for today!</p>

                )}

                {checkpointsDueToday.length > 3 && (
                  <div className="flex w-full justify-end -mx-3 -my-1">
                    <Link
                      href="/todo"
                      className="text-[18px] text-gray-500 hover:text-black"
                    >
                      See all tasks →
                    </Link>
                  </div>
                )}
              </div>
            </section>


            <div className={`${loveYaLikeASister.className} text-[45px] mt-6 -mb-4`}>
              <h1>
                Coming Up
              </h1>
            </div>

            <section
              className={`${itim.className} mx-10 my-5 grid grid-cols-1 gap-3 md:grid-cols-4`}>
              {upcomingAssignments.length === 0 ? (
                <p className="col-span-full text-[21px] text-gray-500">
                  All assignments completed!
                </p>
              ) : (
                upcomingAssignments.map((assignment) => {
                  const classInfo = classes.find(
                    (classInfo) => classInfo.id === assignment.classId
                  );

                  const assignmentCheckpoints = checkpoints.filter(
                    (checkpoint) => checkpoint.assignmentId === assignment.id
                  );

                  const completedCheckpoints = assignmentCheckpoints.filter(
                    (checkpoint) => checkpoint.completed
                  ).length;

                  const progress =
                    assignmentCheckpoints.length === 0
                      ? 0
                      : Math.round(
                        (completedCheckpoints / assignmentCheckpoints.length) * 100
                      );

                  return (
                    <Link
                      key={assignment.id}
                      href={`/assignments/${assignment.id}`}
                      className="flex min-h-32 flex-col justify-between rounded-lg  px-4 py-1 shadow-md backdrop-blur-[0.75px] transition hover:shadow-lg"
                      style={{
                        backgroundColor: classInfo?.colorClasses
                          ? `${classInfo.colorClasses}2c`
                          : "#FFFFFF2c",
                      }}>
                      <div>
                        <p className="text-[25px] text-black">
                          {assignment.title}
                        </p>

                        <p
                          className="text-[17px]"
                          style={{ color: classInfo?.colorClasses }}
                        >
                          {classInfo?.name}
                          <span className="text-gray-500">
                            {" • "}
                            <span
                              className={`text-[14px] ${assignment ? taskStyles[getTaskStatus(assignment.dueDate)] : "text-gray-500"}`}>
                              Due {formatDueDate(assignment.dueDate)}
                            </span>
                          </span>
                        </p>

                      </div>
                      <div className="mt-4 w-full">
                        <div className="mb-1 flex px-1 text-[14px] text-gray-600">
                          <span>{progress}%  Complete</span>
                        </div>

                        <div className="h-3 w-full mb-2 rounded-full overflow-hidden rounded-full bg-white/20">
                          <div
                            className="h-full rounded-full bg-[#2573B8] transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>


                    </Link>
                  );
                })
              )}
            </section>

            {incompleteAssignments.length > 3 && (
              <div className="mx-7 -mt-4 mb-4 w-[70%] text-right">
                <Link
                  href="/assignments"
                  className={`${itim.className} text-[16px] text-gray-500 hover:text-black`}
                >
                  See all assignments →
                </Link>
              </div>
            )}

            <div className={`${loveYaLikeASister.className} text-[45px] mt-6 -mb-4`}>
              <h1>
                Weekly Progress
              </h1>
            </div>

            <section className="w-70/100 rounded-lg border border-white/40 bg-white/20 px-4 mx-10 my-4 py-1 text-[#000000] shadow-md backdrop-blur-[0.75px] transition hover:bg-white/40 hover:shadow">
              <div className={`${itim.className} flex items-start justify-between`}>

                <h2 className="mt-2 text-2xl">
                  {weekRange}
                </h2>

                <span className="flex items-center text-gray-400 gap-3 my-3 text-[18px]">
                  {completedThisWeek} of {weeklyTotal} checkpoints completed this week
                </span>
              </div>

              <div className={`${itim.className} -mt-1 text-[18px]`}>
                <p className="mb-1 text-gray-600">
                  {weeklyProgress}% Complete
                </p>

                <div className="h-3 w-full mb-3 rounded-full bg-gray-200">
                  <div
                    className="h-3 rounded-full bg-[#2573B8]"
                    style={{ width: weeklyProgress + "%" }}
                  />
                </div>
              </div>


            </section>
          </div>

          <aside className="hidden lg:block absolute -right-7 -top-4 w-[25%] h-full">
            <div className="sticky top-6 space-y-6">

              <section className="flex min-h-64 flex-col rounded-sm bg-[#EEF078] p-5 shadow-lg">
                <h2 className={`${loveYaLikeASister.className} text-[32px] text-center`}>
                  To-Do
                </h2>
                <div className={`${itim.className} text-[22px] space-y-3`}>
                  {dashboardTasks.length > 0 ? (
                    dashboardTasks.map((checkpoint) => {
                      const assignment = assignments.find(
                        (assignment) => assignment.id === checkpoint.assignmentId
                      );

                      const classInfo = classes.find(
                        (classInfo) => classInfo.id === assignment?.classId
                      );

                      return (
                        <label

                          key={checkpoint.id}
                          className={`flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-1 shadow-md backdrop-blur-[0.75px] transition ${checkpoint.completed
                              ? "border-gray-300 bg-gray-100/60"
                              : "border-white/40 bg-white/20"}`}
                        >
                          <div className="flex min-w-0 w-full items-center gap-3">
                            <input
                              type="checkbox"
                              checked={checkpoint.completed || recentlyCompleted.includes(checkpoint.id)}
                              onChange={() => {
                                const id = checkpoint.id;
                                const existingTimer = completionTimers.current.get(id);

                                if (recentlyCompleted.includes(id)) {
                                  if (existingTimer) {
                                    clearTimeout(existingTimer);
                                    completionTimers.current.delete(id);
                                  }

                                  setRecentlyCompleted((prev) =>
                                    prev.filter((taskId) => taskId !== id)
                                  );

                                  toggleCheckpoint(id);
                                  return;
                                }

                                setRecentlyCompleted((prev) => [...prev, id]);
                                toggleCheckpoint(id);

                                const timer = setTimeout(() => {
                                  setRecentlyCompleted((prev) =>
                                    prev.filter((taskId) => taskId !== id)
                                  );

                                  completionTimers.current.delete(id);
                                }, 2000);

                                completionTimers.current.set(id, timer);
                              }}
                              className="!w-[18px] !h-[18px] !min-w-[18px] !min-h-[18px] !max-w-[18px] !max-h-[18px] !shrink-0 !grow-0 !p-0 appearance-none rounded-full border-2 border-gray-400 checked:bg-gray-400"
                            />

                            <div className="min-w-0 flex-1">
                              <p
                                className={
                                  checkpoint.completed || recentlyCompleted.includes(checkpoint.id)
                                    ? "text-gray-500 line-through"
                                    : "text-black"
                                }
                              ><span className="block min-w-0 truncate">
                                  {checkpoint.title}
                                </span>
                              </p>
                              <p className="mx-1 -my-1.5 pb-1 text-[16px]">
                                {classInfo && (
                                  <span style={{ color: classInfo.colorClasses }}>
                                    {classInfo.name}
                                  </span>
                                )}

                                <span className="text-gray-500">
                                  {" • "}{assignment?.title}
                                </span>
                              </p>

                            </div>
                          </div>
                        </label>
                      );
                    })
                  ) : (
                    <p className="text-center text-[20px] text-gray-500">All caught up!</p>
                  )}

                  {activeCheckpoints.filter(
                    (checkpoint) => !checkpoint.completed
                  ).length > 3 && (
                      <Link
                        href="/todo"
                        className={`${itim.className} mt-3 block text-right text-[16px] text-gray-500`}
                      >
                        See all tasks →
                      </Link>
                    )}
                </div>

              </section>

              <section className="min-h-64 rounded-sm bg-[#FFB8F1] p-5 shadow-lg">
                <h2 className={`${loveYaLikeASister.className} text-[32px] text-center`}>
                  Notes
                </h2>

                <textarea
                  value={notes}
                  onChange={(e) => updateNotes(e.target.value)}
                  onInput={(e) => {
                    e.currentTarget.style.height = "auto";
                    e.currentTarget.style.height = `${Math.min(e.currentTarget.scrollHeight, 320)}px`;
                  }}
                  placeholder="Write a note..."
                  className={`${itim.className} text-[18px] notes-scrollbar w-full max-h-80 resize-none overflow-y-auto bg-transparent outline-none`}
                />
              </section>

            </div>
          </aside>

        </div>

        <div className={`${loveYaLikeASister.className} text-[45px] mt-9 -mb-4`}>
          <h1>
            Calendar
          </h1>
        </div>

        <section className="w-100/100 rounded-lg border border-white/40 bg-white/20 px-4 mx-10 my-4 py-1 text-[#000000] shadow-md backdrop-blur-[0.75px] transition hover:bg-white/40 hover:shadow">
          <div className={`${itim.className} flex items-start justify-between`}>
            <h2 className="mt-1 text-2xl ">
              This Week
            </h2>

            <Link
              href="/calendar"
              className="text-[16px] mt-2 text-gray-400 hover:text-black"
            >
              View full calendar →
            </Link>
          </div>

          <div className={`${itim.className} mt-3 mx-4 grid grid-cols-7 gap-2`}>
            {weekDays.map((day) => (
              <div
                key={day.day}
                className="min-w-0 rounded-xl border border-gray-200 p-3"
              >
                <p className="mx-0.5 flex items-start justify-between text-[16px] text-gray-500">
                  <span className="text-[#2573B8]">{day.day}</span>
                  <span>{day.date}</span>
                </p>

                <div className="mt-3 space-y-2">
                  {day.checkpoints.length > 0 ? (
                    day.checkpoints.map(
                      (checkpoint) => {
                        const assignment =
                          assignments.find(
                            (assignment) =>
                              assignment.id ===
                              checkpoint.assignmentId
                          );

                        const classInfo =
                          classes.find(
                            (classInfo) =>
                              classInfo.id ===
                              assignment?.classId
                          );

                        return (
                          <Link
                            key={checkpoint.id}
                            href={
                              "/assignments/" +
                              checkpoint.assignmentId
                            }
                            className="block rounded-lg border border-white/40 px-2 py-2"
                            style={{
                              backgroundColor: classInfo?.colorClasses
                                ? `${classInfo.colorClasses}2c`
                                : "#ffffff2c",
                            }}>
                            <p className="break-words text-xs font-medium leading-tight">
                              {checkpoint.title}
                            </p>
                          </Link>
                        );
                      }
                    )
                  ) : (
                    <span className="text-sm text-gray-300">
                      —
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}