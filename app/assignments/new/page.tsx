
"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Love_Ya_Like_A_Sister, Itim } from "next/font/google";
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

const inputStyle =
  "w-full rounded-lg border border-white/40 bg-white/30 px-4 py-3 text-[18px] text-black outline-none transition focus:border-[#2573B8] focus:bg-white/40";

const labelStyle = "mb-2 block text-[20px] text-black";

const classColors = [
  { name: "Blue", value: "#8DB5C7" },
  { name: "Purple", value: "#B8A3D9" },
  { name: "Green", value: "#A8CFA8" },
  { name: "Pink", value: "#E8A6C9" },
  { name: "Yellow", value: "#E8D77D" },
  { name: "Orange", value: "#E8B58A" },
];

export default function NewAssignmentPage() {
  const router = useRouter();
  const { addClass, classes } = useHeadstart();

  const [formError, setFormError] = useState("");

  const [assignmentName, setAssignmentName] = useState("");
  const [directions, setDirections] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [classId, setClassId] = useState<number>(0);

  const [showAddClass, setShowAddClass] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassColor, setNewClassColor] = useState("#8DB5C7");

  const handleAddClass = async () => {
    if (!newClassName.trim()) return;

    const { data, error } = await supabase
      .from("classes")
      .insert({
        name: newClassName.trim(),
        color_classes: newClassColor,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding class:", error);
      setFormError("Could not add class. Please try again.");
      return;
    }

    const newClass = addClass({
      id: data.id,
      name: data.name,
      colorClasses: data.color_classes,
    });

    setClassId(newClass.id);
    setNewClassName("");
    setShowAddClass(false);
    setFormError("");
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setFormError("");

    if (!assignmentName.trim()) {
      setFormError("Please enter an assignment name.");
      return;
    }

    if (!directions.trim()) {
      setFormError(
        "Please add assignment directions so HeadStart can generate your plan."
      );
      return;
    }

    if (!dueDate) {
      setFormError("Please select a due date.");
      return;
    }

    if (!classId) {
      setFormError("Please select a class.");
      return;
    }

    const selectedClass = classes.find(
      (classInfo) => classInfo.id === classId
    );

    const pendingAssignment = {
      title: assignmentName.trim(),
      course: selectedClass?.name ?? "",
      classId,
      directions: directions.trim(),
      availableFrom:
        availableFrom || new Date().toISOString().split("T")[0],
      dueDate,
    };

    sessionStorage.setItem(
      "pendingAssignment",
      JSON.stringify(pendingAssignment)
    );

    router.push("/assignments/plan", { scroll: true });
  };

  const selectedClass = classes.find(
    (classInfo) => classInfo.id === classId
  );

  return (
    <main
      className={`min-h-screen px-6 py-12 ${itim.className}`}
      style={notebookBackground}
    >
      <div className="mx-auto max-w-2xl">
        <h1
          className={`${loveYaLikeASister.className} text-[44px] leading-tight text-black`}
        >
          Create Assignment
        </h1>

        <p className="mt-2 text-[19px] text-gray-600">
          Add your assignment details and Head
          <span className="text-[#2573B8]">Start</span> will build a plan
          for you.
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-6 space-y-6 rounded-xl border border-white/40 bg-white/20 p-6 backdrop-blur-[0.75px] shadow-md md:p-8"
        >
          {/* Assignment Name */}
          <div>
            <label htmlFor="assignment-name" className={labelStyle}>
              Assignment Name
            </label>

            <input
              id="assignment-name"
              type="text"
              placeholder="Assignment Name"
              value={assignmentName}
              onChange={(event) =>
                setAssignmentName(event.target.value)
              }
              required
              className={inputStyle}
            />
          </div>

          {/* Class */}
          <div>
            <label htmlFor="assignment-class" className={labelStyle}>
              Class
            </label>

            <select
              id="assignment-class"
              value={classId}
              onChange={(event) =>
                setClassId(Number(event.target.value))
              }
              required
              className={inputStyle}
              style={{
                color: selectedClass?.colorClasses ?? "#6B7280",
              }}
            >
              <option value={0} disabled>
                Choose a class
              </option>

              {classes.map((classInfo) => (
                <option
                  key={classInfo.id}
                  value={classInfo.id}
                  style={{ color: classInfo.colorClasses }}
                >
                  {classInfo.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setShowAddClass(!showAddClass)}
              className="mx-4 text-[17px] text-[#2573B8] hover:underline"
            >
              {showAddClass ? "Cancel" : "+ Add a class"}
            </button>

            {showAddClass && (
              <div className="mt-4 rounded-xl border border-white/40 bg-white/20 p-4 backdrop-blur-[0.75px] shadow-md">
                <label htmlFor="new-class-name" className={labelStyle}>
                  Class Name
                </label>

                <input
                  id="new-class-name"
                  type="text"
                  value={newClassName}
                  onChange={(event) =>
                    setNewClassName(event.target.value)
                  }
                  placeholder="e.g. COP 4600"
                  className={inputStyle}
                />

                <p className="mt-4 text-[18px] text-gray-600">
                  Class Color
                </p>

                <div className="mt-3 flex flex-wrap gap-3">
                  {classColors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setNewClassColor(color.value)}
                      aria-label={`Choose ${color.name}`}
                      aria-pressed={newClassColor === color.value}
                      className={`h-9 w-9 rounded-full border-2 transition ${
                        newClassColor === color.value
                          ? "border-black ring-2 ring-black/30 ring-offset-2"
                          : "border-white/70"
                      }`}
                      style={{ backgroundColor: color.value }}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddClass}
                  className="mt-5 w-full rounded-lg bg-[#2573B8] px-4 py-3 text-[19px] text-white transition hover:bg-[#1c609c]"
                >
                  Add Class
                </button>
              </div>
            )}
          </div>

          {/* Assignment Directions */}
          <div>
            <label
              htmlFor="assignment-directions"
              className={labelStyle}
            >
              Assignment Directions
            </label>

            <textarea
              id="assignment-directions"
              placeholder="Paste your assignment instructions here..."
              rows={7}
              value={directions}
              onChange={(event) =>
                setDirections(event.target.value)
              }
              className={`${inputStyle} resize-y`}
            />
          </div>

          {/* Available From */}
          <div>
            <label htmlFor="available-from" className={labelStyle}>
              Available From
            </label>

            <input
              id="available-from"
              type="date"
              value={availableFrom}
              onChange={(event) =>
                setAvailableFrom(event.target.value)
              }
              className={inputStyle}
            />

            <p className="mx-4 text-[16px] text-gray-500">
              Optional. If left blank, HeadStart will plan from today.
            </p>
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="due-date" className={labelStyle}>
              Due Date
            </label>

            <input
              id="due-date"
              type="datetime-local"
              value={dueDate}
              onChange={(event) =>
                setDueDate(event.target.value)
              }
              required
              className={inputStyle}
            />
          </div>

          {/* Assignment File */}
          <div>
            <label htmlFor="assignment-file" className={labelStyle}>
              Assignment File
            </label>

            <input
              id="assignment-file"
              type="file"
              className={`${inputStyle} file:mr-4 file:rounded-lg file:border-0 file:bg-white/60 file:px-3 file:py-2 file:text-[16px] file:text-black`}
            />
          </div>

          {/* Rubric */}
          <div>
            <label htmlFor="assignment-rubric" className={labelStyle}>
              Rubric
            </label>

            <input
              id="assignment-rubric"
              type="file"
              className={`${inputStyle} file:mr-4 file:rounded-lg file:border-0 file:bg-white/60 file:px-3 file:py-2 file:text-[16px] file:text-black`}
            />

          </div>

          {formError && (
            <div
              role="alert"
              className="rounded-lg border border-[#9c2133]/30 bg-white/30 px-4 py-3 text-[17px] text-[#9c2133]"
            >
              {formError}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-[#2573B8] px-6 py-3 text-[21px] text-white transition hover:bg-[#1c609c]"
          >
            Generate Plan
          </button>
        </form>
      </div>
    </main>
  );
}