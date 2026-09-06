"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import {
  assignments,
  checkpoints as initialCheckpoints,
  classes,
  Checkpoint,
} from "../data/headstartData";

type HeadstartContextType = {
  assignments: typeof assignments;
  classes: typeof classes;
  checkpoints: Checkpoint[];
  toggleCheckpoint: (id: number) => void;
};

const HeadstartContext = createContext<
  HeadstartContextType | undefined
>(undefined);

export function HeadstartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [checkpoints, setCheckpoints] =
    useState<Checkpoint[]>(initialCheckpoints);

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

  return (
    <HeadstartContext.Provider
      value={{
        assignments,
        classes,
        checkpoints,
        toggleCheckpoint,
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