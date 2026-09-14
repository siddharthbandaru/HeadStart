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

type AssignmentType =
  | "programming"
  | "presentation"
  | "paper"
  | "homework"
  | "lab"
  | "exam"
  | "reading"
  | "general";

function detectAssignmentType(input: AssignmentInput): AssignmentType {
  const text = `${input.title} ${input.directions}`.toLowerCase();

  if (
    text.includes("program") ||
    text.includes("code") ||
    text.includes("coding") ||
    text.includes("software") ||
    text.includes("implementation")
  ) {
    return "programming";
  }

  if (
    text.includes("presentation") ||
    text.includes("slides") ||
    text.includes("powerpoint") ||
    text.includes("present")
  ) {
    return "presentation";
  }

  if (
    text.includes("paper") ||
    text.includes("essay") ||
    text.includes("research") ||
    text.includes("report")
  ) {
    return "paper";
  }

  if (
    text.includes("homework") ||
    text.includes("problem set") ||
    text.includes("worksheet") ||
    text.includes("problems") ||
    text.includes("questions")
  ) {
    return "homework";
  }

  if (
    text.includes("lab") ||
    text.includes("experiment") ||
    text.includes("laboratory")
  ) {
    return "lab";
  }

  if (
    text.includes("exam") ||
    text.includes("midterm") ||
    text.includes("final exam") ||
    text.includes("quiz") ||
    text.includes("test")
  ) {
    return "exam";
  }

  if (
    text.includes("reading") ||
    text.includes("chapter") ||
    text.includes("read ")
  ) {
    return "reading";
  }

  return "general";
}

function getTasksForAssignment(
  input: AssignmentInput
): PlannerTask[] {
  const type = detectAssignmentType(input);
  const text = `${input.title} ${input.directions}`.toLowerCase();

  if (type === "programming") {
    return [
      {
        id: "requirements",
        title: "Review project requirements and deliverables",
        estimatedMinutes: 45,
        weight: 0,
        dependencies: [],
      },
      {
        id: "planning",
        title: "Plan solution and break project into components",
        estimatedMinutes: 60,
        weight: 0,
        dependencies: ["requirements"],
      },
      {
        id: "setup",
        title: "Set up project files and development environment",
        estimatedMinutes: 45,
        weight: 0,
        dependencies: ["planning"],
      },
      {
        id: "implementation",
        title: "Implement core functionality",
        estimatedMinutes: 240,
        weight: 0,
        dependencies: ["setup"],
      },
      {
        id: "testing",
        title: "Test features and debug issues",
        estimatedMinutes: 150,
        weight: 0,
        dependencies: ["implementation"],
      },
      {
        id: "final-review",
        title: "Review requirements and prepare final submission",
        estimatedMinutes: 45,
        weight: 0,
        dependencies: ["testing"],
      },
    ];
  }

  if (type === "presentation") {
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
        title: "Research topic and gather supporting content",
        estimatedMinutes: 90,
        weight: 0,
        dependencies: ["requirements"],
      },
      {
        id: "outline",
        title: "Create presentation outline",
        estimatedMinutes: 45,
        weight: 0,
        dependencies: ["research"],
      },
      {
        id: "slides",
        title: "Build and design slides",
        estimatedMinutes: 150,
        weight: 0,
        dependencies: ["outline"],
      },
      {
        id: "speaker-notes",
        title: "Prepare speaker notes or talking points",
        estimatedMinutes: 60,
        weight: 0,
        dependencies: ["slides"],
      },
      {
        id: "practice",
        title: "Practice presentation and make final edits",
        estimatedMinutes: 60,
        weight: 0,
        dependencies: ["speaker-notes"],
      },
    ];
  }

  if (type === "paper") {
    return [
      {
        id: "requirements",
        title: "Review prompt and formatting requirements",
        estimatedMinutes: 30,
        weight: 0,
        dependencies: [],
      },
      {
        id: "research",
        title: "Research and gather sources",
        estimatedMinutes: 150,
        weight: 0,
        dependencies: ["requirements"],
      },
      {
        id: "outline",
        title: "Create thesis and outline",
        estimatedMinutes: 60,
        weight: 0,
        dependencies: ["research"],
      },
      {
        id: "draft",
        title: "Write first draft",
        estimatedMinutes: 240,
        weight: 0,
        dependencies: ["outline"],
      },
      {
        id: "revision",
        title: "Revise content and strengthen arguments",
        estimatedMinutes: 90,
        weight: 0,
        dependencies: ["draft"],
      },
      {
        id: "citations",
        title: "Check citations and formatting",
        estimatedMinutes: 45,
        weight: 0,
        dependencies: ["revision"],
      },
      {
        id: "final-review",
        title: "Proofread and prepare final submission",
        estimatedMinutes: 45,
        weight: 0,
        dependencies: ["citations"],
      },
    ];
  }

  if (type === "homework") {
    return [
      {
        id: "review",
        title: "Review instructions and identify required problems",
        estimatedMinutes: 20,
        weight: 0,
        dependencies: [],
      },
      {
        id: "concepts",
        title: "Review relevant notes and concepts",
        estimatedMinutes: 45,
        weight: 0,
        dependencies: ["review"],
      },
      {
        id: "first-half",
        title: "Complete first half of problems",
        estimatedMinutes: 75,
        weight: 0,
        dependencies: ["concepts"],
      },
      {
        id: "second-half",
        title: "Complete remaining problems",
        estimatedMinutes: 75,
        weight: 0,
        dependencies: ["first-half"],
      },
      {
        id: "check",
        title: "Check answers and correct mistakes",
        estimatedMinutes: 45,
        weight: 0,
        dependencies: ["second-half"],
      },
    ];
  }

  if (type === "lab") {
    return [
      {
        id: "prep",
        title: "Review lab instructions and objectives",
        estimatedMinutes: 30,
        weight: 0,
        dependencies: [],
      },
      {
        id: "background",
        title: "Review background concepts and procedures",
        estimatedMinutes: 45,
        weight: 0,
        dependencies: ["prep"],
      },
      {
        id: "lab-work",
        title: "Complete lab procedure or implementation",
        estimatedMinutes: 120,
        weight: 0,
        dependencies: ["background"],
      },
      {
        id: "analysis",
        title: "Analyze results and answer lab questions",
        estimatedMinutes: 75,
        weight: 0,
        dependencies: ["lab-work"],
      },
      {
        id: "report",
        title: "Complete lab report and final review",
        estimatedMinutes: 60,
        weight: 0,
        dependencies: ["analysis"],
      },
    ];
  }

  if (type === "exam") {
    return [
      {
        id: "topics",
        title: "Identify exam topics and weak areas",
        estimatedMinutes: 30,
        weight: 0,
        dependencies: [],
      },
      {
        id: "review",
        title: "Review notes, lectures, and key concepts",
        estimatedMinutes: 120,
        weight: 0,
        dependencies: ["topics"],
      },
      {
        id: "practice",
        title: "Complete practice problems or questions",
        estimatedMinutes: 120,
        weight: 0,
        dependencies: ["review"],
      },
      {
        id: "weak-areas",
        title: "Review missed problems and weak areas",
        estimatedMinutes: 75,
        weight: 0,
        dependencies: ["practice"],
      },
      {
        id: "final-review",
        title: "Complete final review and summary",
        estimatedMinutes: 60,
        weight: 0,
        dependencies: ["weak-areas"],
      },
    ];
  }

  if (type === "reading") {
    return [
      {
        id: "preview",
        title: "Preview reading and learning objectives",
        estimatedMinutes: 15,
        weight: 0,
        dependencies: [],
      },
      {
        id: "reading",
        title: "Complete assigned reading",
        estimatedMinutes: 90,
        weight: 0,
        dependencies: ["preview"],
      },
      {
        id: "notes",
        title: "Take notes on key concepts",
        estimatedMinutes: 45,
        weight: 0,
        dependencies: ["reading"],
      },
      {
        id: "review",
        title: "Review notes and summarize main ideas",
        estimatedMinutes: 30,
        weight: 0,
        dependencies: ["notes"],
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
      title: "Gather required materials and resources",
      estimatedMinutes: 45,
      weight: 0,
      dependencies: ["requirements"],
    },
    {
      id: "work",
      title: "Complete main assignment work",
      estimatedMinutes: 150,
      weight: 0,
      dependencies: ["materials"],
    },
    {
      id: "review",
      title: "Review and improve completed work",
      estimatedMinutes: 60,
      weight: 0,
      dependencies: ["work"],
    },
    {
      id: "final-review",
      title: "Complete final review and submission check",
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

  const extraAvailableDays = Math.max(
    0,
    workDays - requiredWorkDays
  );

  const gapBetweenTasks =
    tasks.length > 1
      ? extraAvailableDays / (tasks.length - 1)
      : 0;

  let dayOffset = 0;

  tasks.forEach((task, index) => {
    const taskDays = Math.ceil(
      task.estimatedMinutes / dailyAvailableMinutes
    );

    if (dayOffset + taskDays > workDays) {
      task.overflow = true;

      const fallbackDate = new Date(
        start.getTime() +
          Math.min(Math.floor(dayOffset), workDays - 1) * DAY_MS
      );

      task.scheduledStart = toDateOnly(fallbackDate);
      task.scheduledEnd = toDateOnly(fallbackDate);

      return;
    }

    const taskStart = new Date(
      start.getTime() + Math.floor(dayOffset) * DAY_MS
    );

    const taskEnd = new Date(
      start.getTime() +
        (Math.floor(dayOffset) + taskDays - 1) * DAY_MS
    );

    task.scheduledStart = toDateOnly(taskStart);
    task.scheduledEnd = toDateOnly(taskEnd);
    task.overflow = false;

    dayOffset += taskDays;

    if (index < tasks.length - 1) {
      dayOffset += gapBetweenTasks;
    }
  });
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
