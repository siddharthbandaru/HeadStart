export type ClassInfo = {
  id: number;
  name: string;
  colorClasses: string;
};

export type Assignment = {
  id: number;
  title: string;
  classId: number;
  directions: string;
  availableFrom: string;
  dueDate: string;
};

export type Checkpoint = {
  id: number;
  assignmentId: number;
  title: string;
  date: string;
  estimatedMinutes: number;
  completed: boolean;
};

export const classes: ClassInfo[] = [];

export const assignments: Assignment[] = [];

export const checkpoints: Checkpoint[] = [];