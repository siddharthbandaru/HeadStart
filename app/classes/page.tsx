
"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Love_Ya_Like_A_Sister, Itim } from "next/font/google";
import { useHeadstart } from "../context/HeadstartContext";

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

const classColors = [
  { name: "Blue", value: "#93C5FD" },
  { name: "Purple", value: "#C4B5FD" },
  { name: "Green", value: "#86EFAC" },
  { name: "Pink", value: "#F9A8D4" },
  { name: "Yellow", value: "#FDE047" },
  { name: "Orange", value: "#FDBA74" },
];

const cardStyle =
  "rounded-xl border border-white/40 bg-white/20 p-6 backdrop-blur-[0.75px] shadow-md";

const inputStyle =
  "w-full rounded-lg border border-white/40 bg-white/30 px-4 py-3 text-[18px] outline-none focus:border-[#2573B8]";

export default function ClassesPage() {
  const {
    classes,
    assignments,
    addClass,
    updateClass,
    deleteClass,
  } = useHeadstart();

  const [newClassName, setNewClassName] = useState("");
  const [newClassColor, setNewClassColor] = useState("#93C5FD");

  const [editingClassId, setEditingClassId] =
    useState<number | null>(null);
  const [editingClassName, setEditingClassName] = useState("");
  const [editingClassColor, setEditingClassColor] =
    useState("#93C5FD");

  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");

  // Displays saved color changes immediately on this page.
  const [updatedColors, setUpdatedColors] = useState<
    Record<number, string>
  >({});

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
      console.error("Error saving class:", error);
      return;
    }

    addClass({
      id: data.id,
      name: data.name,
      colorClasses: data.color_classes,
    });

    setNewClassName("");
  };

  const handleStartEditing = (
    id: number,
    name: string,
    color: string
  ) => {
    setEditingClassId(id);
    setEditingClassName(name);
    setEditingClassColor(color);
    setEditError("");
  };

  const handleSaveEdit = async () => {
    if (
      editingClassId === null ||
      !editingClassName.trim() ||
      savingEdit
    ) {
      return;
    }

    const classId = editingClassId;
    const updatedName = editingClassName.trim();
    const updatedColor = editingClassColor;

    try {
      setSavingEdit(true);
      setEditError("");

      
      await updateClass(classId, updatedName, updatedColor);

      // Show the new color immediately on this page.
      setUpdatedColors((current) => ({
        ...current,
        [classId]: updatedColor,
      }));

      setEditingClassId(null);
      setEditingClassName("");
    } catch (error) {
      console.error("Error updating class:", error);
      setEditError(
        "Unable to update the class. Please try again."
      );
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteClass = async (id: number) => {
    const classHasAssignments = assignments.some(
      (assignment) => assignment.classId === id
    );

    if (classHasAssignments) {
      alert(
        "This class has assignments attached to it. Remove or move those assignments before deleting the class."
      );
      return;
    }

    await deleteClass(id);
  };

  return (
    <main
      className={`min-h-screen px-6 py-12 ${itim.className}`}
      style={notebookBackground}
    >
      <div className="mx-auto max-w-3xl">
        {/* Heading */}
        <div className="mb-8">
          <h1
            className={`${loveYaLikeASister.className} text-[44px] leading-tight text-black`}
          >
            Classes
          </h1>

          <p className="mt-2 text-[19px] text-gray-600">
            Manage the classes you use in Head
            <span className="text-[#2573B8]">Start</span>.
          </p>
        </div>

        {/* Add class */}
        <section className={cardStyle}>
          <h2
            className={`${loveYaLikeASister.className} text-[30px] text-black`}
          >
            Add Class
          </h2>

          <label
            htmlFor="new-class-name"
            className="mb-2 mt-4 block text-[18px]"
          >
            Class Name
          </label>

          <input
            id="new-class-name"
            type="text"
            value={newClassName}
            onChange={(event) =>
              setNewClassName(event.target.value)
            }
            placeholder="e.g. COP 3530"
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
            className="mt-5 rounded-lg bg-[#2573B8] px-5 py-3 text-[19px] text-white transition hover:bg-[#1c609c]"
          >
            Add Class
          </button>
        </section>

        {/* Existing classes */}
        <div className="mt-8 space-y-3">
          {classes.map((classInfo) => {
            const displayedColor =
              updatedColors[classInfo.id] ??
              classInfo.colorClasses;

            return (
              <section
                key={classInfo.id}
                className="rounded-xl border p-4 backdrop-blur-[0.75px] shadow-md"
                style={{
                  backgroundColor: `${displayedColor}1a`,
                  borderColor: displayedColor,
                }}
              >
                {editingClassId === classInfo.id ? (
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor={`edit-class-${classInfo.id}`}
                        className="mb-2 block text-[18px]"
                      >
                        Class Name
                      </label>

                      <input
                        id={`edit-class-${classInfo.id}`}
                        type="text"
                        value={editingClassName}
                        onChange={(event) =>
                          setEditingClassName(
                            event.target.value
                          )
                        }
                        className={inputStyle}
                      />
                    </div>

                    <div>
                      <p className="mb-3 text-[18px] text-gray-600">
                        Class Color
                      </p>

                      <div className="flex flex-wrap gap-3">
                        {classColors.map((color) => (
                          <button
                            key={color.name}
                            type="button"
                            onClick={() =>
                              setEditingClassColor(color.value)
                            }
                            aria-label={`Choose ${color.name}`}
                            aria-pressed={
                              editingClassColor === color.value
                            }
                            className={`h-9 w-9 rounded-full border-2 transition ${
                              editingClassColor === color.value
                                ? "border-black ring-2 ring-black/30 ring-offset-2"
                                : "border-white/70"
                            }`}
                            style={{
                              backgroundColor: color.value,
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {editError && (
                      <p
                        role="alert"
                        className="text-[17px] text-[#9c2133]"
                      >
                        {editError}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleSaveEdit}
                        disabled={
                          savingEdit || !editingClassName.trim()
                        }
                        className="rounded-lg bg-[#2573B8] px-4 py-2 text-[17px] text-white hover:bg-[#1c609c] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {savingEdit ? "Saving..." : "Save"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingClassId(null);
                          setEditError("");
                        }}
                        disabled={savingEdit}
                        className="rounded-lg border border-white/40 bg-white/20 px-4 py-2 text-[17px] hover:bg-white/30 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <p
                      className="text-[22px]"
                      style={{ color: displayedColor }}
                    >
                      {classInfo.name}
                    </p>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() =>
                          handleStartEditing(
                            classInfo.id,
                            classInfo.name,
                            displayedColor
                          )
                        }
                        className="text-[17px] text-[#2573B8] hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteClass(classInfo.id)
                        }
                        className="text-[17px] text-[#9c2133] hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </section>
            );
          })}

          {classes.length === 0 && (
            <div className={cardStyle}>
              <p className="text-[18px] text-gray-600">
                No classes yet. Add your first class above!
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}