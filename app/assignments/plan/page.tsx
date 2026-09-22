
"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Love_Ya_Like_A_Sister, Itim } from "next/font/google";
import { supabase } from "@/lib/supabase";
import { useHeadstart } from "../../context/HeadstartContext";

const loveYaLikeASister = Love_Ya_Like_A_Sister({
  weight: "400",
  subsets: ["latin"],
});

const itim = Itim({
  weight: "400",
  subsets: ["latin"],
});

const notebookBackground = {
  backgroundColor: "#F0EEE9",
  backgroundImage:
    "repeating-linear-gradient(to bottom, transparent 0px, transparent 35px, #8db5c7a7 35px, #8db5c7a7 36px), linear-gradient(to right, transparent 115px, #E44B4B 115px, #E44B4B 116px, transparent 116px)",
};

const cardStyle =
  "rounded-xl border border-white/40 bg-white/20 p-6 backdrop-blur-[0.75px] shadow-md";

const inputStyle =
  "w-full rounded-lg border border-white/40 bg-white/30 px-4 py-3 text-[18px] text-black outline-none focus:border-[#2573B8]";

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
  const { addAssignment, addCheckpoints } = useHeadstart();

  const [assignment, setAssignment] =
    useState<PendingAssignment | null>(null);

  const [checkpoints, setCheckpoints] =
    useState<EditableCheckpoint[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [warning, setWarning] = useState<string | undefined>();
  const [feasible, setFeasible] = useState<boolean | null>(null);
  const [estimatedTotalMinutes, setEstimatedTotalMinutes] = useState(0);
  const [bufferDays, setBufferDays] = useState(0);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    const storedAssignment = sessionStorage.getItem("pendingAssignment");

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

        const response = await fetch("/api/generate-plan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: pendingAssignment.title,
            directions: pendingAssignment.directions,
            availableFrom: pendingAssignment.availableFrom,
            dueDate: pendingAssignment.dueDate,
            dailyAvailableMinutes: 120,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error(
            `Planner failed with status ${response.status}: ${JSON.stringify(data)}`
          );

          setSaveError(data.error ?? "Unable to generate plan.");
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
        setSaveError(
          "Something went wrong while generating your plan."
        );
      } finally {
        setLoading(false);
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
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
          ? { ...checkpoint, [field]: value }
          : checkpoint
      )
    );
  };

  const deleteCheckpoint = (id: number) => {
    setCheckpoints((currentCheckpoints) =>
      currentCheckpoints.filter((checkpoint) => checkpoint.id !== id)
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
    if (!assignment || !isPlanValid || saving) return;

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
          available_from: assignment.availableFrom || null,
          due_date: assignment.dueDate,
          estimated_hours: estimatedTotalMinutes / 60,
          difficulty: null,
          status: "Not Started",
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving assignment:", error);
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
        availableFrom: data.available_from ?? "",
        dueDate: data.due_date?.split("T")[0] ?? "",
      });

      await addCheckpoints(
        checkpoints.map((checkpoint) => ({
          assignmentId: newAssignmentId,
          title: checkpoint.title,
          date: checkpoint.date,
          estimatedMinutes: checkpoint.estimatedMinutes,
          completed: false,
        }))
      );

      sessionStorage.removeItem("pendingAssignment");
      router.push(`/assignments/${newAssignmentId}`);
    } catch (error) {
      console.error("Failed to accept plan:", error);
      setSaveError("Unable to save your plan. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main
        className={`min-h-screen px-6 py-12 ${itim.className}`}
        style={notebookBackground}
      >
        <div className="mx-auto max-w-3xl">
          <div className={cardStyle}>
            <h1
              className={`${loveYaLikeASister.className} text-[36px]`}
            >
              Generating your plan...
            </h1>
            <p className="mt-2 text-[18px] text-gray-600">
              Head<span className="text-[#2573B8]">Start</span> is
              putting your checkpoints together.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!assignment) {
    return (
      <main
        className={`min-h-screen px-6 py-12 ${itim.className}`}
        style={notebookBackground}
      >
        <div className="mx-auto max-w-3xl">
          <div className={cardStyle}>
            <h1
              className={`${loveYaLikeASister.className} text-[40px]`}
            >
              Assignment not found
            </h1>

            <p className="mt-2 text-[18px] text-gray-600">
              Go back and create an assignment first.
            </p>

            <button
              type="button"
              onClick={() => router.push("/assignments/new")}
              className="mt-6 rounded-lg bg-[#2573B8] px-5 py-3 text-[19px] text-white hover:bg-[#1c609c]"
            >
              Create Assignment
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`min-h-screen px-6 py-12 ${itim.className}`}
      style={notebookBackground}
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <p className="text-[18px] text-gray-600">Your Plan</p>

          <h1
            className={`${loveYaLikeASister.className} mt-1 break-words text-[44px] leading-tight`}
          >
            {assignment.title}
          </h1>

          <p className="mt-2 text-[18px] text-gray-600">
            Due{" "}
            {new Date(assignment.dueDate).toLocaleDateString(
              "en-US",
              {
                month: "long",
                day: "numeric",
                year: "numeric",
              }
            )}
          </p>
        </div>

        {/* Plan overview */}
        <section className={`${cardStyle} mb-8`}>
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <p className="text-[17px] text-gray-600">
                Estimated workload
              </p>
              <p className="mt-1 text-[24px] text-[#2573B8]">
                {Math.ceil(estimatedTotalMinutes / 60)} hrs
              </p>
            </div>

            <div>
              <p className="text-[17px] text-gray-600">Buffer</p>
              <p className="mt-1 text-[24px] text-[#2573B8]">
                {bufferDays} {bufferDays === 1 ? "day" : "days"}
              </p>
            </div>

            <div>
              <p className="text-[17px] text-gray-600">Status</p>
              <p
                className={`mt-1 text-[24px] ${
                  feasible ? "text-green-700" : "text-amber-700"
                }`}
              >
                {feasible ? "On track" : "Tight schedule"}
              </p>
            </div>
          </div>

          {warning && (
            <div className="mt-5 rounded-lg border border-amber-300/50 bg-amber-100/40 p-4 text-[17px] text-amber-900">
              <p>This schedule may be ambitious.</p>
              <p className="mt-2">{warning}</p>
              <p className="mt-2">
                You can still accept the plan and adjust your
                checkpoints.
              </p>
            </div>
          )}
        </section>

        <h2
          className={`${loveYaLikeASister.className} mb-4 text-[40px]`}
        >
          Checkpoints
        </h2>

        {/* Editable checkpoints */}
        <div className="space-y-4">
          {checkpoints.map((checkpoint, index) => (
            <section key={checkpoint.id} className={cardStyle}>
              <p className="mb-3 text-[17px] text-gray-500">
                Checkpoint {index + 1}
              </p>

              <label
                htmlFor={`checkpoint-title-${checkpoint.id}`}
                className="mb-2 block text-[18px]"
              >
                Task
              </label>

              <input
                id={`checkpoint-title-${checkpoint.id}`}
                type="text"
                value={checkpoint.title}
                onChange={(event) =>
                  updateCheckpoint(
                    checkpoint.id,
                    "title",
                    event.target.value
                  )
                }
                placeholder="Checkpoint title"
                className={inputStyle}
              />

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor={`checkpoint-date-${checkpoint.id}`}
                    className="mb-2 block text-[18px]"
                  >
                    Date
                  </label>

                  <input
                    id={`checkpoint-date-${checkpoint.id}`}
                    type="date"
                    value={checkpoint.date}
                    onChange={(event) =>
                      updateCheckpoint(
                        checkpoint.id,
                        "date",
                        event.target.value
                      )
                    }
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label
                    htmlFor={`checkpoint-time-${checkpoint.id}`}
                    className="mb-2 block text-[18px]"
                  >
                    Estimated time
                  </label>

                  <select
                    id={`checkpoint-time-${checkpoint.id}`}
                    value={checkpoint.estimatedMinutes}
                    onChange={(event) =>
                      updateCheckpoint(
                        checkpoint.id,
                        "estimatedMinutes",
                        Number(event.target.value)
                      )
                    }
                    className={inputStyle}
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
              </div>

              <button
                type="button"
                onClick={() => deleteCheckpoint(checkpoint.id)}
                className="mt-4 text-[17px] text-[#9c2133] hover:underline"
              >
                Remove checkpoint
              </button>
            </section>
          ))}
        </div>

        <button
          type="button"
          onClick={addCheckpoint}
          className="mt-4 w-full rounded-xl border border-white/40 bg-white/20 px-6 py-3 text-[19px] text-[#2573B8] backdrop-blur-[0.75px] shadow-md transition hover:bg-white/30"
        >
          + Add Checkpoint
        </button>

        {saveError && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-[#9c2133]/30 bg-white/20 p-4 text-[17px] text-[#9c2133] backdrop-blur-[0.75px] shadow-md"
          >
            {saveError}
          </div>
        )}

        <div className="mt-8">
          <button
            type="button"
            onClick={handleAcceptPlan}
            disabled={!isPlanValid || saving}
            className="w-full rounded-lg bg-[#2573B8] px-6 py-3 text-[21px] text-white transition hover:bg-[#1c609c] disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {saving
              ? "Saving Plan..."
              : !isPlanValid
                ? "Complete all checkpoints to continue"
                : feasible
                  ? "Accept Plan"
                  : "Accept Plan Anyway"}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function AssignmentPlanPage() {
  return (
    <Suspense
      fallback={
        <main
          className={`min-h-screen px-6 py-12 ${itim.className}`}
          style={notebookBackground}
        >
          <div className="mx-auto max-w-3xl">
            <div className={cardStyle}>
              <p className="text-[18px]">Loading plan...</p>
            </div>
          </div>
        </main>
      }
    >
      <AssignmentPlanContent />
    </Suspense>
  );
}