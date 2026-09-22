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
  ) => Promise<void>;

  addClass: (
    classInfo: NewClass
  ) => ClassInfo;

  updateClass: (
    id: number,
    name: string,
    color: string
  ) => Promise<void>;

  deleteClass: (
    id: number
  ) => Promise<void>;

  addCheckpoints: (
    checkpoints: NewCheckpoint[]
  ) => Promise<void>;

  toggleCheckpoint: (
    id: number
  ) => Promise<void>;
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
    useState<Assignment[]>([]);

  const [classes, setClasses] =
    useState<ClassInfo[]>([]);

  const [checkpoints, setCheckpoints] =
    useState<Checkpoint[]>([]);

  const [hasLoaded, setHasLoaded] =
    useState(false);

  const getCurrentUserId = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      throw new Error("User must be logged in.");
    }

    return user.id;
  };  

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setClasses([]);
        setAssignments([]);
        setCheckpoints([]);
        setHasLoaded(true);
        return;
      }

      const [
        classesResult,
        assignmentsResult,
        checkpointsResult,
      ] = await Promise.all([
        supabase
          .from("classes")
          .select("*")
          .order("id"),

        supabase
          .from("assignments")
          .select("*")
          .order("id"),

        supabase
          .from("checkpoints")
          .select("*")
          .order("id"),
      ]);

      if (classesResult.error) {
        console.error(
          "Error loading classes:",
          classesResult.error
        );
      } else {
        const formattedClasses: ClassInfo[] =
          classesResult.data.map((classInfo) => ({
            id: Number(classInfo.id),
            name: classInfo.name,
            colorClasses: classInfo.color_classes,
          }));

        setClasses(formattedClasses);
      }

      if (assignmentsResult.error) {
        console.error(
          "Error loading assignments:",
          assignmentsResult.error
        );
      } else {
        const formattedAssignments: Assignment[] =
          assignmentsResult.data.map((assignment) => ({
            id: Number(assignment.id),
            title: assignment.title,
            classId: Number(assignment.class_id),
            directions: assignment.directions ?? "",
            availableFrom: assignment.available_from ?? "",
            dueDate:
              assignment.due_date?.split("T")[0] ?? "",
          }));

        setAssignments(formattedAssignments);
      }

      if (checkpointsResult.error) {
        console.error(
          "Error loading checkpoints:",
          checkpointsResult.error
        );
      } else {
        const formattedCheckpoints: Checkpoint[] =
          checkpointsResult.data.map((checkpoint) => ({
            id: Number(checkpoint.id),
            assignmentId: Number(
              checkpoint.assignment_id
            ),
            title: checkpoint.title,
            date: checkpoint.date,
            estimatedMinutes:
              checkpoint.estimated_minutes,
            completed: checkpoint.completed,
          }));

        setCheckpoints(formattedCheckpoints);
      }

      setHasLoaded(true);
    };

    loadData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadData();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);


  const addAssignment = (
    assignment: NewAssignment
  ): Assignment => {

    setAssignments(
      (currentAssignments) => [
        ...currentAssignments,
        assignment,
      ]
    );

    return assignment;
  };

  const deleteAssignment = async (id: number) => {
    const { error } = await supabase
      .from("assignments")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Error deleting assignment", JSON.stringify(error, null, 2)
      );
      return;
    }

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

  const updateClass = async (
  id: number,
  name: string,
  color: string
) => {
  const { error } = await supabase
    .from("classes")
    .update({
      name,
      color_classes: color,
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating class:", error);
    throw error;
  }

  setClasses((currentClasses) =>
    currentClasses.map((classInfo) =>
      classInfo.id === id
        ? {
            ...classInfo,
            name,
            colorClasses: color,
          }
        : classInfo
    )
  );
};

  const deleteClass = async (
    id: number
  ) => {
    const { error } = await supabase
      .from("classes")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error("Error deleting class", error);
      return;
    }

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
    const userId = await getCurrentUserId();

    const rows = newCheckpoints.map((checkpoint) => ({
      user_id: userId,
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

  const toggleCheckpoint = async (
    id: number
  ) => {
    const checkpoint = checkpoints.find(
      (checkpoint) => checkpoint.id === id
    );

    if (!checkpoint) return;

    const newCompleted = !checkpoint.completed;

    const { error } = await supabase
    .from("checkpoints")
    .update({
      completed: newCompleted,
    })
    .eq("id", id);

    if (error) {
      console.error("Error updating checkpoint:", error);
      return;
    }
    setCheckpoints(
      (currentCheckpoints) =>
        currentCheckpoints.map(
          (checkpoint) =>
            checkpoint.id === id
              ? {
                  ...checkpoint,
                  completed: newCompleted,
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