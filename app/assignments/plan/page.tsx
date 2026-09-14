"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useHeadstart } from "../../context/HeadstartContext";

type PendingAssignment = {
  title: string;
  course: string;
  classId: number;
  directions: string;
  availableFrom: string;
  dueDate: string;
};

type EditableCheckpoint = {
  id: number;
  date: string;
  title: string;
  estimatedMinutes: number;
};

function AssignmentPlanContent() {
  const router = useRouter();

  const {
    addAssignment,
    addCheckpoints,
  } = useHeadstart();

  const [assignment, setAssignment] =
    useState<PendingAssignment | null>(null);

  const [checkpoints, setCheckpoints] =
    useState<EditableCheckpoint[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [warning, setWarning] =
    useState<string | undefined>();

  const [feasible, setFeasible] =
    useState<boolean | null>(null);

  const [
    estimatedTotalMinutes,
    setEstimatedTotalMinutes,
  ] = useState(0);

  const [bufferDays, setBufferDays] = useState(0);

  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    const storedAssignment =
      sessionStorage.getItem("pendingAssignment");

    if (!storedAssignment) {
      setLoading(false);
      return;
    }

    const pendingAssignment: PendingAssignment =
      JSON.parse(storedAssignment);

    setAssignment(pendingAssignment);

    const loadPlan = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "/api/generate-plan",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: pendingAssignment.title,
              directions: pendingAssignment.directions,
              availableFrom:
                pendingAssignment.availableFrom,
              dueDate: pendingAssignment.dueDate,
              dailyAvailableMinutes: 120,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.error(
            `Planner failed with status ${
              response.status
            }: ${JSON.stringify(data)}`
          );

          setSaveError(
            data.error ?? "Unable to generate plan."
          );

          return;
        }

        setFeasible(data.feasible);
        setWarning(data.warning);

        setEstimatedTotalMinutes(
          data.estimatedTotalMinutes
        );

        setBufferDays(data.bufferDays);

        setCheckpoints(
          data.tasks.map(
            (
              task: {
                id: string;
                title: string;
                estimatedMinutes: number;
                scheduledStart?: string;
              },
              index: number
            ) => ({
              id: index + 1,
              title: task.title,
              estimatedMinutes:
                task.estimatedMinutes,
              date: task.scheduledStart ?? "",
            })
          )
        );
      } catch (error) {
        console.error(
          "Failed to generate plan:",
          error
        );

        setSaveError(
          "Something went wrong while generating your plan."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPlan();
  }, []);

  const updateCheckpoint = (
    id: number,
    field: "title" | "date" | "estimatedMinutes",
    value: string | number
  ) => {
    setCheckpoints((currentCheckpoints) =>
      currentCheckpoints.map((checkpoint) =>
        checkpoint.id === id
          ? {
              ...checkpoint,
              [field]: value,
            }
          : checkpoint
      )
    );
  };

  const deleteCheckpoint = (id: number) => {
    setCheckpoints((currentCheckpoints) =>
      currentCheckpoints.filter(
        (checkpoint) => checkpoint.id !== id
      )
    );
  };

  const addCheckpoint = () => {
    const newCheckpoint: EditableCheckpoint = {
      id: Date.now(),
      date: "",
      title: "",
      estimatedMinutes: 0,
    };

    setCheckpoints((currentCheckpoints) => [
      ...currentCheckpoints,
      newCheckpoint,
    ]);
  };

  const isPlanValid =
    checkpoints.length > 0 &&
    checkpoints.every(
      (checkpoint) =>
        checkpoint.date !== "" &&
        checkpoint.title.trim() !== "" &&
        checkpoint.estimatedMinutes > 0
    );

  const handleAcceptPlan = async () => {
    if (!assignment || !isPlanValid || saving) {
      return;
    }

    try {
      setSaving(true);
      setSaveError("");

      const { data, error } = await supabase
        .from("assignments")
        .insert({
          title: assignment.title,
          course: assignment.course,
          class_id: assignment.classId,
          directions: assignment.directions,
          available_from:
            assignment.availableFrom || null,
          due_date: assignment.dueDate,
          estimated_hours:
            estimatedTotalMinutes / 60,
          difficulty: null,
          status: "Not Started",
        })
        .select()
        .single();

      if (error) {
        console.error(
          "Error saving assignment:",
          error
        );

        setSaveError(
          "Unable to save the assignment. Please try again."
        );

        return;
      }

      const newAssignmentId = Number(data.id);

      addAssignment({
        id: newAssignmentId,
        title: data.title,
        classId: Number(data.class_id),
        directions: data.directions ?? "",
        availableFrom:
          data.available_from ?? "",
        dueDate:
          data.due_date?.split("T")[0] ?? "",
      });

      await addCheckpoints(
        checkpoints.map((checkpoint) => ({
          assignmentId: newAssignmentId,
          title: checkpoint.title,
          date: checkpoint.date,
          estimatedMinutes:
            checkpoint.estimatedMinutes,
          completed: false,
        }))
      );

      sessionStorage.removeItem(
        "pendingAssignment"
      );

      router.push(
        `/assignments/${newAssignmentId}`
      );
    } catch (error) {
      console.error(
        "Failed to accept plan:",
        error
      );

      setSaveError(
        "Unable to save your plan. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <p>Generating your plan...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!assignment) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold">
              Assignment not found
            </h1>

            <p className="mt-2 text-gray-600">
              Go back and create an assignment first.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push("/assignments/new")
              }
              className="mt-6 rounded-lg bg-black px-5 py-3 font-medium text-white"
            >
              Create Assignment
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-500">
            YOUR PLAN
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            {assignment.title}
          </h1>

          <p className="mt-2 text-gray-600">
            Due{" "}
            {new Date(
              assignment.dueDate
            ).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-gray-500">
                Estimated workload
              </p>

              <p className="mt-1 text-xl font-semibold">
                {Math.ceil(
                  estimatedTotalMinutes / 60
                )}{" "}
                hrs
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Buffer
              </p>

              <p className="mt-1 text-xl font-semibold">
                {bufferDays}{" "}
                {bufferDays === 1 ? "day" : "days"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Status
              </p>

              <p
                className={`mt-1 text-xl font-semibold ${
                  feasible
                    ? "text-green-600"
                    : "text-amber-600"
                }`}
              >
                {feasible
                  ? "On track"
                  : "Tight schedule"}
              </p>
            </div>
          </div>

          {warning && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <p className="font-medium">
                This schedule may be ambitious.
              </p>

              <p className="mt-1">
                {warning}
              </p>

              <p className="mt-2">
                You can still accept the plan and
                adjust your checkpoints.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {checkpoints.map(
            (checkpoint, index) => (
              <div
                key={checkpoint.id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Checkpoint {index + 1}
                </p>

                <input
                  type="date"
                  value={checkpoint.date}
                  onChange={(event) =>
                    updateCheckpoint(
                      checkpoint.id,
                      "date",
                      event.target.value
                    )
                  }
                  className="rounded-lg border border-gray-300 px-3 py-2"
                />

                <input
                  type="text"
                  value={checkpoint.title}
                  onChange={(event) =>
                    updateCheckpoint(
                      checkpoint.id,
                      "title",
                      event.target.value
                    )
                  }
                  className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-xl font-semibold"
                />

                <div className="mt-3">
                  <label className="mb-2 block text-sm text-gray-600">
                    Estimated time
                  </label>

                  <select
                    value={
                      checkpoint.estimatedMinutes
                    }
                    onChange={(event) =>
                      updateCheckpoint(
                        checkpoint.id,
                        "estimatedMinutes",
                        Number(
                          event.target.value
                        )
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  >
                    <option value={0} disabled>
                      Choose a time
                    </option>

                    <option value={15}>
                      15 min
                    </option>
                    <option value={30}>
                      30 min
                    </option>
                    <option value={45}>
                      45 min
                    </option>
                    <option value={60}>
                      1 hr
                    </option>
                    <option value={90}>
                      1 hr 30 min
                    </option>
                    <option value={120}>
                      2 hr
                    </option>
                    <option value={150}>
                      2 hr 30 min
                    </option>
                    <option value={180}>
                      3 hr
                    </option>
                    <option value={240}>
                      4 hr
                    </option>
                    <option value={300}>
                      5 hr
                    </option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    deleteCheckpoint(
                      checkpoint.id
                    )
                  }
                  className="mt-4 text-sm font-medium text-red-600"
                >
                  Remove checkpoint
                </button>
              </div>
            )
          )}
        </div>

        <button
          type="button"
          onClick={addCheckpoint}
          className="mt-4 w-full rounded-lg border border-gray-300 px-6 py-3 font-medium"
        >
          + Add Checkpoint
        </button>

        {saveError && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {saveError}
          </div>
        )}

        <div className="mt-8">
          {isPlanValid ? (
            <button
              type="button"
              onClick={handleAcceptPlan}
              disabled={saving}
              className="block w-full rounded-lg bg-black px-6 py-3 text-center font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {saving
                ? "Saving Plan..."
                : feasible
                ? "Accept Plan"
                : "Accept Plan Anyway"}
            </button>
          ) : (
            <button
              disabled
              className="w-full cursor-not-allowed rounded-lg bg-gray-300 px-6 py-3 font-medium text-gray-500"
            >
              Complete all checkpoints to continue
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

export default function AssignmentPlanPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 px-6 py-12">
          <div className="mx-auto max-w-3xl">
            <p>Loading plan...</p>
          </div>
        </main>
      }
    >
      <AssignmentPlanContent />
    </Suspense>
  );
}