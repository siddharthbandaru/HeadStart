export type AssignmentInput = {
  title: string;
  directions: string;
  rubric?: string;
  availableFrom: string;
  dueDate: string;
};

export type PlannerTask = {
  id: string;
  title: string;
  estimatedMinutes: number;
  weight: number;
  dependencies: string[];
  scheduledStart?: string;
  scheduledEnd?: string;
};

export type GeneratedPlan = {
  assignmentTitle: string;
  estimatedTotalMinutes: number;
  bufferDays: number;
  warning?: string;
  tasks: PlannerTask[];
};
