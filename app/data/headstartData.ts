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

export const classes: ClassInfo[] = [
  {
    id: 1,
    name: "ENC 1102",
    colorClasses: "bg-blue-200 border-blue-400",
  },
  {
    id: 2,
    name: "COP 4600",
    colorClasses: "bg-purple-200 border-purple-400",
  },
  {
    id: 3,
    name: "DIG 2121",
    colorClasses: "bg-green-200 border-green-400",
  },
];

export const assignments: Assignment[] = [
  {
    id: 1,
    title: "Research Paper",
    classId: 1,
    directions: "Write a research paper using academic sources.",
    availableFrom: "2026-09-05",
    dueDate: "2026-09-15",
  },
  {
    id: 2,
    title: "Operating Systems Project",
    classId: 2,
    directions: "Complete the operating systems programming project.",
    availableFrom: "2026-09-05",
    dueDate: "2026-09-20",
  },
  {
    id: 3,
    title: "Design Presentation",
    classId: 3,
    directions: "Create and present a design presentation.",
    availableFrom: "2026-09-05",
    dueDate: "2026-09-25",
  },
];

export const checkpoints: Checkpoint[] = [
  {
    id: 1,
    assignmentId: 1,
    title: "Read + annotate sources",
    date: "2026-09-06",
    estimatedMinutes: 120,
    completed: true,
  },
  {
    id: 2,
    assignmentId: 2,
    title: "Complete kernel setup",
    date: "2026-09-06",
    estimatedMinutes: 90,
    completed: false,
  },
  {
    id: 3,
    assignmentId: 1,
    title: "Finish source notes",
    date: "2026-09-07",
    estimatedMinutes: 60,
    completed: false,
  },
  {
    id: 4,
    assignmentId: 2,
    title: "Review project requirements",
    date: "2026-09-07",
    estimatedMinutes: 30,
    completed: false,
  },
  {
    id: 5,
    assignmentId: 3,
    title: "Brainstorm presentation",
    date: "2026-09-07",
    estimatedMinutes: 45,
    completed: false,
  },
  {
    id: 6,
    assignmentId: 1,
    title: "Create thesis + outline",
    date: "2026-09-08",
    estimatedMinutes: 60,
    completed: false,
  },
  {
    id: 7,
    assignmentId: 1,
    title: "Write first draft",
    date: "2026-09-10",
    estimatedMinutes: 180,
    completed: false,
  },
  {
    id: 8,
    assignmentId: 3,
    title: "Create presentation outline",
    date: "2026-09-10",
    estimatedMinutes: 60,
    completed: false,
  },
  {
    id: 9,
    assignmentId: 2,
    title: "Test kernel changes",
    date: "2026-09-11",
    estimatedMinutes: 90,
    completed: false,
  },
  {
    id: 10,
    assignmentId: 1,
    title: "Revise first draft",
    date: "2026-09-12",
    estimatedMinutes: 120,
    completed: false,
  },
  {
    id: 11,
    assignmentId: 1,
    title: "Final review + buffer",
    date: "2026-09-14",
    estimatedMinutes: 45,
    completed: false,
  },
];