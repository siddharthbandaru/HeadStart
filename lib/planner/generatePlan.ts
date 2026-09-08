import {
  AssignmentInput,
  GeneratedPlan,
  PlannerTask,
} from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;

function toDateOnly(date: Date) {
  return date.toISOString().split("T")[0];
}

function daysBetween(start: Date, end: Date) {
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / DAY_MS));
}

export function generatePlan(input: AssignmentInput): GeneratedPlan {
  const start = new Date(input.availableFrom);
  const due = new Date(input.dueDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(due.getTime())) {
    throw new Error("Start date and due date must be valid.");
  }

  if (due <= start) {
    throw new Error("Due date must be after the available date.");
  }

  // These tasks are temporary. Later, AI will create them from the
  // assignment directions and rubric.
  const tasks: PlannerTask[] = [
    {
      id: "research",
      title: "Research and gather materials",
      estimatedMinutes: 180,
      weight: 0,
      dependencies: [],
    },
    {
      id: "outline",
      title: "Create an outline",
      estimatedMinutes: 60,
      weight: 0,
      dependencies: ["research"],
    },
    {
      id: "draft",
      title: "Complete the main draft",
      estimatedMinutes: 300,
      weight: 0,
      dependencies: ["outline"],
    },
    {
      id: "revision",
      title: "Revise against assignment requirements",
      estimatedMinutes: 120,
      weight: 0,
      dependencies: ["draft"],
    },
    {
      id: "final-review",
      title: "Final proofread and formatting",
      estimatedMinutes: 45,
      weight: 0,
      dependencies: ["revision"],
    },
  ];

  const totalMinutes = tasks.reduce(
    (total, task) => total + task.estimatedMinutes,
    0
  );

  for (const task of tasks) {
    task.weight = task.estimatedMinutes / totalMinutes;
  }

  const totalDays = daysBetween(start, due);
  const bufferDays = Math.max(1, Math.ceil(totalDays * 0.1));
  const workDays = Math.max(1, totalDays - bufferDays);

  let dayOffset = 0;

  for (const task of tasks) {
    const taskDays = Math.max(1, Math.round(task.weight * workDays));

    const taskStart = new Date(start.getTime() + dayOffset * DAY_MS);
    const taskEnd = new Date(
      start.getTime() +
        Math.min(dayOffset + taskDays - 1, workDays - 1) * DAY_MS
    );

    task.scheduledStart = toDateOnly(taskStart);
    task.scheduledEnd = toDateOnly(taskEnd);

    dayOffset += taskDays;
    dayOffset = Math.min(dayOffset, workDays - 1);
  }

  const estimatedDailyMinutes = totalMinutes / workDays;
  const warning =
    estimatedDailyMinutes > 240
      ? "This plan requires more than 4 hours of work per day on average."
      : undefined;

  return {
    assignmentTitle: input.title,
    estimatedTotalMinutes: totalMinutes,
    bufferDays,
    warning,
    tasks,
  };
}
