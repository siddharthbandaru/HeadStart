"use client";

import { useState } from "react";
import { useHeadstart } from "../context/HeadstartContext";

export default function ClassesPage() {
  const {
    classes,
    assignments,
    addClass,
    updateClass,
    deleteClass,
  } = useHeadstart();

  const [newClassName, setNewClassName] = useState("");
  const [newClassColor, setNewClassColor] = useState(
    "bg-blue-200 border-blue-400"
  );

  const [editingClassId, setEditingClassId] =
    useState<number | null>(null);

  const [editingClassName, setEditingClassName] =
    useState("");

  const classColors = [
    {
      name: "Blue",
      value: "bg-blue-200 border-blue-400",
      preview: "bg-blue-300",
    },
    {
      name: "Purple",
      value: "bg-purple-200 border-purple-400",
      preview: "bg-purple-300",
    },
    {
      name: "Green",
      value: "bg-green-200 border-green-400",
      preview: "bg-green-300",
    },
    {
      name: "Pink",
      value: "bg-pink-200 border-pink-400",
      preview: "bg-pink-300",
    },
    {
      name: "Yellow",
      value: "bg-yellow-200 border-yellow-400",
      preview: "bg-yellow-300",
    },
    {
      name: "Orange",
      value: "bg-orange-200 border-orange-400",
      preview: "bg-orange-300",
    },
  ];

  const handleAddClass = () => {
    if (!newClassName.trim()) return;

    addClass({
      name: newClassName.trim(),
      colorClasses: newClassColor,
    });

    setNewClassName("");
  };

  const handleStartEditing = (
    id: number,
    name: string
  ) => {
    setEditingClassId(id);
    setEditingClassName(name);
  };

  const handleSaveEdit = () => {
    if (
      editingClassId === null ||
      !editingClassName.trim()
    ) {
      return;
    }

    updateClass(
      editingClassId,
      editingClassName.trim()
    );

    setEditingClassId(null);
    setEditingClassName("");
  };

  const handleDeleteClass = (id: number) => {
    const classHasAssignments = assignments.some(
        (assignment) => assignment.classId === id
    );

    if (classHasAssignments) {
        alert(
        "This class has assignments attached to it. Remove or move those assignments before deleting the class."
        );

        return;
    }

    deleteClass(id);
    };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Classes
          </h1>

          <p className="mt-2 text-gray-600">
            Manage the classes you use in Headstart.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            Add Class
          </h2>

          <input
            type="text"
            value={newClassName}
            onChange={(event) =>
              setNewClassName(event.target.value)
            }
            placeholder="e.g. COP 3530"
            className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-3"
          />

          <p className="mt-4 text-sm font-medium text-gray-600">
            Class color
          </p>

          <div className="mt-2 flex gap-3">
            {classColors.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() =>
                  setNewClassColor(color.value)
                }
                aria-label={`Choose ${color.name}`}
                className={`h-8 w-8 rounded-full ${color.preview} ${
                  newClassColor === color.value
                    ? "ring-2 ring-black ring-offset-2"
                    : ""
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddClass}
            className="mt-5 rounded-lg bg-black px-5 py-3 font-medium text-white"
          >
            Add Class
          </button>
        </div>

        <div className="mt-8 space-y-3">
          {classes.map((classInfo) => (
            <div
              key={classInfo.id}
              className={`rounded-xl border p-4 ${classInfo.colorClasses}`}
            >
              {editingClassId === classInfo.id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingClassName}
                    onChange={(event) =>
                      setEditingClassName(
                        event.target.value
                      )
                    }
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2"
                  />

                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setEditingClassId(null)
                    }
                    className="rounded-lg border border-gray-400 px-4 py-2 text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold">
                    {classInfo.name}
                  </p>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        handleStartEditing(
                          classInfo.id,
                          classInfo.name
                        )
                      }
                      className="text-sm font-medium"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteClass(classInfo.id)
                      }
                      className="text-sm font-medium text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}