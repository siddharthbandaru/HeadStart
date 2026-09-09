"use client";

import { supabase } from "@/lib/supabase";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  assignments as initialAssignments,
  checkpoints as initialCheckpoints,
  classes as initialClasses,
  Assignment,
  Checkpoint,
  ClassInfo,
} from "../data/headstartData";

type NewAssignment = Assignment;
type NewCheckpoint = Omit<Checkpoint, "id">;
type NewClass = ClassInfo;

type HeadstartContextType = {
  assignments: Assignment[];
  classes: ClassInfo[];
  checkpoints: Checkpoint[];

  addAssignment: (
    assignment: NewAssignment
  ) => Assignment;

  deleteAssignment: (
    id: number
  ) => void;

  addClass: (
    classInfo: NewClass
  ) => ClassInfo;

  updateClass: (
    id: number,
    name: string
  ) => void;

  deleteClass: (
    id: number
  ) => void;

  addCheckpoints: (
    checkpoints: NewCheckpoint[]
  ) => Promise<void>;

  toggleCheckpoint: (
    id: number
  ) => void;
};

const HeadstartContext =
  createContext<HeadstartContextType | undefined>(
    undefined
  );

export function HeadstartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [assignments, setAssignments] =
    useState<Assignment[]>(initialAssignments);

  const [classes, setClasses] =
    useState<ClassInfo[]>(initialClasses);

  const [checkpoints, setCheckpoints] =
    useState<Checkpoint[]>(initialCheckpoints);

  const [hasLoaded, setHasLoaded] =
    useState(false);


  useEffect(() => {
    const loadCheckpoints = async () => {
    const { data, error } = await supabase
      .from("checkpoints")
      .select("*")
      .order("id");

    if (error) {
      console.error("Error loading checkpoints:", error);
      return;
    }

    const formattedCheckpoints: Checkpoint[] = data.map(
      (checkpoint) => ({
        id: Number(checkpoint.id),
        assignmentId: Number(checkpoint.assignment_id),
        title: checkpoint.title,
        date: checkpoint.date,
        estimatedMinutes: checkpoint.estimated_minutes,
        completed: checkpoint.completed,
      })
    );

    setCheckpoints(formattedCheckpoints);
  };

  loadCheckpoints();

    const loadClasses = async () => {
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .order("id");

      if (error) {
        console.error("Error loading classes:", error);
        return;
      }

      const formattedClasses: ClassInfo[] = data.map((classInfo) => ({
        id: classInfo.id,
        name: classInfo.name,
        colorClasses: classInfo.color_classes,
      }));

      setClasses(formattedClasses);
    };

    loadClasses();

    const loadAssignments = async () => {
      const { data, error } = await supabase
        .from("assignments")
        .select("*")
        .order("id");
              
      if (error) {
        console.error("Error loading assignments:", error);
        return;
      }

      const formattedAssignments: Assignment[] = data.map(
        (assignment) => ({
          id: Number(assignment.id),
          title: assignment.title,
          classId: Number(assignment.class_id),
          directions: assignment.directions ?? "",
          availableFrom: assignment.available_from ?? "",
          dueDate: assignment.due_date?.split("T")[0] ?? "",
        })
      );

      setAssignments(formattedAssignments);
    };

    loadAssignments();


    setHasLoaded(true);
  }, []);


  const addAssignment = (
    assignment: NewAssignment
  ): Assignment => {
    const newAssignment: Assignment = {
      ...assignment,

      id:
        assignments.length === 0
          ? 1
          : Math.max(
              ...assignments.map(
                (assignment) =>
                  assignment.id
              )
            ) + 1,
    };

    setAssignments(
      (currentAssignments) => [
        ...currentAssignments,
        assignment,
      ]
    );

    return newAssignment;
  };

  const deleteAssignment = (id: number) => {
    setAssignments((currentAssignments) =>
      currentAssignments.filter(
        (assignment) => assignment.id !== id
      )
    );

    setCheckpoints((currentCheckpoints) =>
      currentCheckpoints.filter(
        (checkpoint) =>
          checkpoint.assignmentId !== id
      )
    );
  };

  const addClass = (
    classInfo: NewClass
  ): ClassInfo => {
    const newClass: ClassInfo = {
      ...classInfo,
    };

    setClasses(
      (currentClasses) => [
        ...currentClasses,
        newClass,
      ]
    );

    return newClass;
  };

  const updateClass = (
    id: number,
    name: string
  ) => {
    setClasses(
      (currentClasses) =>
        currentClasses.map(
          (classInfo) =>
            classInfo.id === id
              ? {
                  ...classInfo,
                  name,
                }
              : classInfo
        )
    );
  };

  const deleteClass = (
    id: number
  ) => {
    setClasses(
      (currentClasses) =>
        currentClasses.filter(
          (classInfo) =>
            classInfo.id !== id
        )
    );
  };

  const addCheckpoints = async (
    newCheckpoints: NewCheckpoint[]
  ) => {
    const rows = newCheckpoints.map((checkpoint) => ({
      assignment_id: checkpoint.assignmentId,
      title: checkpoint.title,
      date: checkpoint.date,
      estimated_minutes: checkpoint.estimatedMinutes,
      completed: checkpoint.completed,
    }));

    const { data, error } = await supabase
      .from("checkpoints")
      .insert(rows)
      .select();

    if (error) {
      console.error("Error saving checkpoints:", error);
      return;
    }

    const formattedCheckpoints: Checkpoint[] = data.map(
      (checkpoint) => ({
        id: Number(checkpoint.id),
        assignmentId: Number(checkpoint.assignment_id),
        title: checkpoint.title,
        date: checkpoint.date,
        estimatedMinutes: checkpoint.estimated_minutes,
        completed: checkpoint.completed,
      })
    );

    setCheckpoints((currentCheckpoints) => [
      ...currentCheckpoints,
      ...formattedCheckpoints,
    ]);
  };

  const toggleCheckpoint = (
    id: number
  ) => {
    setCheckpoints(
      (currentCheckpoints) =>
        currentCheckpoints.map(
          (checkpoint) =>
            checkpoint.id === id
              ? {
                  ...checkpoint,
                  completed:
                    !checkpoint.completed,
                }
              : checkpoint
        )
    );
  };

  return (
    <HeadstartContext.Provider
      value={{
        assignments,
        classes,
        checkpoints,
        addAssignment,
        deleteAssignment,
        addClass,
        updateClass,
        deleteClass,
        addCheckpoints,
        toggleCheckpoint,
      }}
    >
      {children}
    </HeadstartContext.Provider>
  );
}

export function useHeadstart() {
  const context =
    useContext(HeadstartContext);

  if (!context) {
    throw new Error(
      "useHeadstart must be used inside HeadstartProvider"
    );
  }

  return context;
}