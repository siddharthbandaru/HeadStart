"use client";

import {
  createContext,
  useContext,
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

type NewAssignment = Omit<Assignment, "id">;

type NewCheckpoint = Omit<Checkpoint, "id">;

type NewClass = Omit<ClassInfo, "id">;

type HeadstartContextType = {
  assignments: Assignment[];
  classes: ClassInfo[];
  checkpoints: Checkpoint[];
  addAssignment: (assignment: NewAssignment) => Assignment;
  addCheckpoints: (checkpoints: NewCheckpoint[]) => void;
  addClass: (classInfo: NewClass) => ClassInfo;
  toggleCheckpoint: (id: number) => void;
  updateClass: (id: number, name: string) => void;
  deleteClass: (id: number) => void;
};


const HeadstartContext = createContext<
  HeadstartContextType | undefined
>(undefined);

export function HeadstartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [assignments, setAssignments] =
    useState<Assignment[]>(initialAssignments);

  const [checkpoints, setCheckpoints] =
    useState<Checkpoint[]>(initialCheckpoints);

  const [classes, setClasses] =
    useState<ClassInfo[]>(initialClasses);

  const addAssignment = (
    assignment: NewAssignment
  ): Assignment => {
    const newAssignment: Assignment = {
      ...assignment,
      id:
      assignments.length === 0
      ? 1
      : Math.max(
        ...assignments.map((assignment) => assignment.id)
      ) +1
    };
    
    setAssignments((currentAssignments) => [
      ...currentAssignments,
      newAssignment,
    ]);

    return newAssignment;
  };

  const addCheckpoints = (
    newCheckpoints: NewCheckpoint[]
  ) => {
    setCheckpoints((currentCheckpoints) => {
      const startingId =
        currentCheckpoints.length === 0
          ? 1
          : Math.max(
              ...currentCheckpoints.map(
                (checkpoint) => checkpoint.id
              )
            ) + 1;

      const checkpointsWithIds =
        newCheckpoints.map(
          (checkpoint, index) => ({
            ...checkpoint,
            id: startingId + index,
          })
        );

      return [
        ...currentCheckpoints,
        ...checkpointsWithIds,
      ];
    });
  };

  const addClass = (
    classInfo: NewClass
  ): ClassInfo => {
    const newClass: ClassInfo = {
      ...classInfo,
      id:
        classes.length === 0
          ? 1
          : Math.max(
              ...classes.map(
                (classInfo) => classInfo.id
              )
            ) + 1,
    };

    setClasses((currentClasses) => [
      ...currentClasses,
      newClass,
    ]);

    return newClass;
  };

  const toggleCheckpoint = (id: number) => {
    setCheckpoints((currentCheckpoints) =>
      currentCheckpoints.map((checkpoint) =>
        checkpoint.id === id
          ? {
              ...checkpoint,
              completed: !checkpoint.completed,
            }
          : checkpoint
      )
    );
  };

  const updateClass = (id: number, name: string) => {
    setClasses((currentClasses) =>
      currentClasses.map((classInfo) =>
        classInfo.id === id
          ? {
              ...classInfo,
              name,
            }
          : classInfo
      )
    );
  };

  const deleteClass = (id: number) => {
    setClasses((currentClasses) =>
      currentClasses.filter(
        (classInfo) => classInfo.id !== id
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
        addCheckpoints,
        addClass,
        toggleCheckpoint,
        updateClass,
        deleteClass,
      }}
    >
      {children}
    </HeadstartContext.Provider>
  );
}

export function useHeadstart() {
  const context = useContext(HeadstartContext);

  if (!context) {
    throw new Error(
      "useHeadstart must be used inside HeadstartProvider"
    );
  }

  return context;
}