import { Assignment } from "../data/headstartData";
import { scheduleCheckpoints } from "./scheduleCheckpoints";

export type GeneratedCheckpoint = {
  id: number;
  date: string;
  title: string;
  estimatedMinutes: number;
};

export function generatePlan(
  assignment: Assignment
): GeneratedCheckpoint[] {
  const startDate =
    assignment.availableFrom ||
    new Date().toISOString().split("T")[0];

  const dueDate =
    assignment.dueDate || startDate;


  const assignmentText = (
    assignment.title +
    " " +
    assignment.directions
  ).toLowerCase();

  let checkpointTitles: string[];

  if (
    assignmentText.includes("paper") ||
    assignmentText.includes("essay") ||
    assignmentText.includes("research")
  ) {
    checkpointTitles = [
      "Review assignment requirements",
      "Gather and review sources",
      "Create thesis and outline",
      "Write first draft",
      "Revise and complete final review",
    ];
  } else if (
    assignmentText.includes("presentation") ||
    assignmentText.includes("slides")
  ) {
    checkpointTitles = [
      "Review presentation requirements",
      "Research and gather content",
      "Create presentation outline",
      "Build slides",
      "Practice and complete final review",
    ];
  } else if (
    assignmentText.includes("project") ||
    assignmentText.includes("program") ||
    assignmentText.includes("code")
  ) {
    checkpointTitles = [
      "Review project requirements",
      "Plan implementation",
      "Build core functionality",
      "Test and debug",
      "Complete final review",
    ];
  } else {
    checkpointTitles = [
      "Review assignment requirements",
      "Gather necessary materials",
      "Begin assignment work",
      "Complete main assignment work",
      "Final review + buffer",
    ];
  }


  const estimatedTimes = [
    30,
    60,
    90,
    120,
    45,
  ];

  const unscheduledCheckpoints =
    checkpointTitles.map((title, index) => ({
        title,
        estimatedMinutes:
        estimatedTimes[index],
    }));

return scheduleCheckpoints(
    unscheduledCheckpoints,
    startDate,
    dueDate
    );
}