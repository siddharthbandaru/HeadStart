"use client";

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

type NewAssignment = Omit<Assignment, "id">;
type NewCheckpoint = Omit<Checkpoint, "id">;
type NewClass = Omit<ClassInfo, "id">;

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
  ) => void;

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
    const savedAssignments =
      localStorage.getItem(
        "headstart-assignments"
      );

    const savedClasses =
      localStorage.getItem(
        "headstart-classes"
      );

    const savedCheckpoints =
      localStorage.getItem(
        "headstart-checkpoints"
      );

    if (savedAssignments) {
      setAssignments(
        JSON.parse(savedAssignments)
      );
    }

    if (savedClasses) {
      setClasses(
        JSON.parse(savedClasses)
      );
    }

    if (savedCheckpoints) {
      setCheckpoints(
        JSON.parse(savedCheckpoints)
      );
    }

    setHasLoaded(true);
  }, []);


  useEffect(() => {
    if (!hasLoaded) return;

    localStorage.setItem(
      "headstart-assignments",
      JSON.stringify(assignments)
    );
  }, [assignments, hasLoaded]);


  useEffect(() => {
    if (!hasLoaded) return;

    localStorage.setItem(
      "headstart-classes",
      JSON.stringify(classes)
    );
  }, [classes, hasLoaded]);


  useEffect(() => {
    if (!hasLoaded) return;

    localStorage.setItem(
      "headstart-checkpoints",
      JSON.stringify(checkpoints)
    );
  }, [checkpoints, hasLoaded]);

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
        newAssignment,
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

      id:
        classes.length === 0
          ? 1
          : Math.max(
              ...classes.map(
                (classInfo) =>
                  classInfo.id
              )
            ) + 1,
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

  const addCheckpoints = (
    newCheckpoints: NewCheckpoint[]
  ) => {
    setCheckpoints(
      (currentCheckpoints) => {
        const startingId =
          currentCheckpoints.length === 0
            ? 1
            : Math.max(
                ...currentCheckpoints.map(
                  (checkpoint) =>
                    checkpoint.id
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
      }
    );
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