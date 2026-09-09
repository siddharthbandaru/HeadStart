"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useHeadstart } from "../../context/HeadstartContext";

function AssignmentPlanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    assignments,
    addCheckpoints,
  } = useHeadstart();

  const assignmentId = Number(
    searchParams.get("assignmentId")
  );

  const assignment = assignments.find(
    (assignment) => assignment.id === assignmentId
  );

  const [checkpoints, setCheckpoints] = useState<
    {
      id: number;
      date: string;
      title: string;
      estimatedMinutes: number;
    }[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState<string | undefined>();
  const [feasible, setFeasible] = useState<boolean | null>(null);
  const [estimatedTotalMinutes, setEstimatedTotalMinutes] = useState(0);
  const [bufferDays, setBufferDays] = useState(0);

  useEffect(() => {
    if (!assignment) return;

    const loadPlan = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/generate-plan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: assignment.title,
            directions: assignment.directions,
            availableFrom:
              assignment.availableFrom ||
              new Date().toISOString().split("T")[0],
            dueDate: assignment.dueDate,
            dailyAvailableMinutes: 120,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Planner error:", data);
          return;
        }

        setFeasible(data.feasible);
        setWarning(data.warning);
        setEstimatedTotalMinutes(data.estimatedTotalMinutes);
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
              estimatedMinutes: task.estimatedMinutes,
              date: task.scheduledStart ?? "",
            })
          )
        );
      } catch (error) {
        console.error("Failed to generate plan:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPlan();
  }, [assignment]);

  const updateCheckpoint = (
    id: number,
    field: "title" | "date" | "estimatedMinutes",
    value: string | number
  ) => {
    setCheckpoints(
      checkpoints.map((checkpoint) =>
        checkpoint.id === id
          ? { ...checkpoint, [field]: value }
          : checkpoint
      )
    );
  };

  const deleteCheckpoint = (id: number) => {
    setCheckpoints(
      checkpoints.filter((checkpoint) => checkpoint.id !== id)
    );
  };

  const addCheckpoint = () => {
    const newCheckpoint = {
      id: Date.now(),
      date: "",
      title: "",
      estimatedMinutes: 0,
    };

    setCheckpoints([...checkpoints, newCheckpoint]);
  };

    const isPlanValid = checkpoints.every(
    (checkpoint) =>
        checkpoint.date !== "" &&
        checkpoint.title.trim() !== "" &&
        checkpoint.estimatedMinutes > 0
    );

    const handleAcceptPlan = async () => {
      if (!assignment) return;

      await addCheckpoints(
        checkpoints.map((checkpoint) => ({
          assignmentId: assignment.id,
          title: checkpoint.title,
          date: checkpoint.date,
          estimatedMinutes: checkpoint.estimatedMinutes,
          completed: false,
        }))
      );

      router.push(
        `/assignments/${assignment.id}`
      );
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
            </div>
          </div>
        </main>
      );
    }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-500">YOUR PLAN</p>

          <h1 className="mt-2 text-4xl font-bold">
            {assignment.title}
          </h1>

          <p className="mt-2 text-gray-600">
            Due{" "}
            {new Date(
              `${assignment.dueDate}T00:00:00`
            ).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
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
                {Math.ceil(estimatedTotalMinutes / 60)} hrs
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Buffer
              </p>
              <p className="mt-1 text-xl font-semibold">
                {bufferDays} days
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Status
              </p>
              <p
                className={`mt-1 text-xl font-semibold ${
                  feasible ? "text-green-600" : "text-red-600"
                }`}
              >
                {feasible ? "On track" : "Not feasible"}
              </p>
            </div>
          </div>

          {warning && (
            <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {warning}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {checkpoints.map((checkpoint) => (
            <div
              key={checkpoint.id}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
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
                    value={checkpoint.estimatedMinutes}
                    onChange={(event) =>
                    updateCheckpoint(
                        checkpoint.id,
                        "estimatedMinutes",
                        Number(event.target.value)
                    )
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                    <option value={0} disabled>
                        Choose a time
                    </option>

                    <option value={15}>15 min</option>
                    <option value={30}>30 min</option>
                    <option value={45}>45 min</option>
                    <option value={60}>1 hr</option>
                    <option value={90}>1 hr 30 min</option>
                    <option value={120}>2 hr</option>
                    <option value={150}>2 hr 30 min</option>
                    <option value={180}>3 hr</option>
                    <option value={240}>4 hr</option>
                    <option value={300}>5 hr</option>
                </select>
                </div>

              <button
                type="button"
                onClick={() => deleteCheckpoint(checkpoint.id)}
                className="mt-4 text-sm font-medium text-red-600"
              >
                Remove checkpoint
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addCheckpoint}
          className="mt-4 w-full rounded-lg border border-gray-300 px-6 py-3 font-medium"
        >
          + Add Checkpoint
        </button>

        <div className="mt-8">
          {isPlanValid ? (
            <button
              type="button"
              onClick={handleAcceptPlan}
              className="block w-full rounded-lg bg-black px-6 py-3 text-center font-medium text-white"
            >
                Accept Plan
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