export type AssignmentInput = {
  title: string;
  directions: string;
  rubric?: string;
  availableFrom: string;
  dueDate: string;
  dailyAvailableMinutes?: number;
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
  availableCapacityMinutes: number;
  estimatedDailyMinutes: number;
  bufferDays: number;
  feasible: boolean;
  warning?: string;
  tasks: PlannerTask[];
};
