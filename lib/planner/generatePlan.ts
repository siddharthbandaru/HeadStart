import {
  AssignmentInput,
  GeneratedPlan,
  PlannerTask,
} from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_DAILY_AVAILABLE_MINUTES = 120;

function toDateOnly(date: Date) {
  return date.toISOString().split("T")[0];
}

function daysBetween(start: Date, end: Date) {
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / DAY_MS));
}

function getTasksForAssignment(
  input: AssignmentInput
): PlannerTask[] {
  const text = `${input.title} ${input.directions}`.toLowerCase();

  if (
    text.includes("program") ||
    text.includes("code") ||
    text.includes("coding") ||
    text.includes("software") ||
    text.includes("project")
  ) {
    return [
      {
        id: "requirements",
        title: "Review project requirements",
        estimatedMinutes: 45,
        weight: 0,
        dependencies: [],
      },
      {
        id: "planning",
        title: "Plan implementation",
        estimatedMinutes: 60,
        weight: 0,
        dependencies: ["requirements"],
      },
      {
        id: "implementation",
        title: "Build core functionality",
        estimatedMinutes: 300,
        weight: 0,
        dependencies: ["planning"],
      },
      {
        id: "testing",
        title: "Test and debug",
        estimatedMinutes: 180,
        weight: 0,
        dependencies: ["implementation"],
      },
      {
        id: "final-review",
        title: "Final review and submission check",
        estimatedMinutes: 45,
        weight: 0,
        dependencies: ["testing"],
      },
    ];
  }

  if (
    text.includes("presentation") ||
    text.includes("slides") ||
    text.includes("powerpoint")
  ) {
    return [
      {
        id: "requirements",
        title: "Review presentation requirements",
        estimatedMinutes: 30,
        weight: 0,
        dependencies: [],
      },
      {
        id: "research",
        title: "Research and gather content",
        estimatedMinutes: 120,
        weight: 0,
        dependencies: ["requirements"],
      },
      {
        id: "outline",
        title: "Create presentation outline",
        estimatedMinutes: 60,
        weight: 0,
        dependencies: ["research"],
      },
      {
        id: "slides",
        title: "Build slides",
        estimatedMinutes: 180,
        weight: 0,
        dependencies: ["outline"],
      },
      {
        id: "practice",
        title: "Practice and complete final review",
        estimatedMinutes: 90,
        weight: 0,
        dependencies: ["slides"],
      },
    ];
  }

  if (
    text.includes("paper") ||
    text.includes("essay") ||
    text.includes("research")
  ) {
    return [
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
  }

  return [
    {
      id: "requirements",
      title: "Review assignment requirements",
      estimatedMinutes: 30,
      weight: 0,
      dependencies: [],
    },
    {
      id: "materials",
      title: "Gather necessary materials",
      estimatedMinutes: 60,
      weight: 0,
      dependencies: ["requirements"],
    },
    {
      id: "work",
      title: "Complete main assignment work",
      estimatedMinutes: 180,
      weight: 0,
      dependencies: ["materials"],
    },
    {
      id: "review",
      title: "Review and improve work",
      estimatedMinutes: 60,
      weight: 0,
      dependencies: ["work"],
    },
    {
      id: "final-review",
      title: "Final review and submission check",
      estimatedMinutes: 30,
      weight: 0,
      dependencies: ["review"],
    },
  ];
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

  const dailyAvailableMinutes =
    input.dailyAvailableMinutes ?? DEFAULT_DAILY_AVAILABLE_MINUTES;

  if (
    !Number.isFinite(dailyAvailableMinutes) ||
    dailyAvailableMinutes <= 0
  ) {
    throw new Error("dailyAvailableMinutes must be greater than 0.");
  }

  const tasks = getTasksForAssignment(input);

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

  const availableCapacityMinutes = workDays * dailyAvailableMinutes;
  const estimatedDailyMinutes = totalMinutes / workDays;
  const feasible = totalMinutes <= availableCapacityMinutes;

  const requiredWorkDays = Math.ceil(
    totalMinutes / dailyAvailableMinutes
  );
  
  const extraDaysNeeded = Math.max(
    0,
    requiredWorkDays - workDays
  );

  let dayOffset = 0;

for (const task of tasks) {
  const taskDays = Math.ceil(
    task.estimatedMinutes / dailyAvailableMinutes
  );

  // Not enough days left for this task
  if (dayOffset + taskDays > workDays) {
    task.overflow = true;
    continue;
  }

  const taskStart = new Date(
    start.getTime() + dayOffset * DAY_MS
  );

  const taskEnd = new Date(
    start.getTime() +
      (dayOffset + taskDays - 1) * DAY_MS
  );

  task.scheduledStart = toDateOnly(taskStart);
  task.scheduledEnd = toDateOnly(taskEnd);
  task.overflow = false;

  dayOffset += taskDays;
}

  let warning: string | undefined;

  if (!feasible) {
    const shortfall = totalMinutes - availableCapacityMinutes;
    warning =
      `This assignment needs about ${Math.ceil(totalMinutes / 60)} hours, ` +
      `but the current schedule only has about ${Math.floor(
        availableCapacityMinutes / 60
      )} hours available. You are short by about ${Math.ceil(
        shortfall / 60
      )} hours.`;
  }

  return {
    assignmentTitle: input.title,
    estimatedTotalMinutes: totalMinutes,
    availableCapacityMinutes,
    estimatedDailyMinutes,
    bufferDays,
    feasible,
    extraDaysNeeded,
    warning,
    tasks,
  };
}
