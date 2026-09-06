"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useHeadstart } from "../../context/HeadstartContext";

export default function NewAssignmentPage() {
  const router = useRouter();

  const {
    addAssignment,
    addClass,
    classes,
  } = useHeadstart();

  const [assignmentName, setAssignmentName] = useState("");
  const [directions, setDirections] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [classId, setClassId] = useState<number>(0);

  const [showAddClass, setShowAddClass] = useState(false);
  const [newClassName, setNewClassName] = useState("");

  const [newClassColor, setNewClassColor] = useState(
    "bg-blue-200 border-blue-400"
  );
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

    const newClass = addClass({
      name: newClassName.trim(),
      colorClasses: "bg-gray-200 border-gray-400",
    });

    // Automatically select the class the user just created
    setClassId(newClass.id);

    // Reset the add-class form
    setNewClassName("");
    setShowAddClass(false);
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const newAssignment = addAssignment({
      title: assignmentName,
      classId,
      directions,
      availableFrom,
      dueDate: dueDate.split("T")[0],
    });

    router.push(
      `/assignments/plan?assignmentId=${newAssignment.id}`
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">
          Create Assignment
        </h1>

        <p className="mt-2 text-gray-600">
          Add your assignment details and Headstart will build a plan for you.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >
          {/* Assignment Name */}
          <div>
            <label className="mb-2 block font-medium">
              Assignment Name
            </label>

            <input
              type="text"
              placeholder="Assignment Name"
              value={assignmentName}
              onChange={(event) =>
                setAssignmentName(event.target.value)
              }
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />
          </div>

          {/* Class */}
          <div>
            <label className="mb-2 block font-medium">
              Class
            </label>

            <select
              value={classId}
              onChange={(event) =>
                setClassId(Number(event.target.value))
              }
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            >
              <option value={0} disabled>
                Choose a class
              </option>

              {classes.map((classInfo) => (
                <option
                  key={classInfo.id}
                  value={classInfo.id}
                >
                  {classInfo.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() =>
                setShowAddClass(!showAddClass)
              }
              className="mt-2 text-sm font-medium text-gray-600 hover:text-black"
            >
              {showAddClass ? "Cancel" : "+ Add a class"}
            </button>

            {showAddClass && (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={newClassName}
                  onChange={(event) =>
                    setNewClassName(event.target.value)
                  }
                  placeholder="e.g. COP 4600"
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3"
                />

                <button
                  type="button"
                  onClick={handleAddClass}
                  className="rounded-lg bg-black px-4 py-3 font-medium text-white"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          {/* Assignment Directions */}
          <div>
            <label className="mb-2 block font-medium">
              Assignment Directions
            </label>

            <textarea
              placeholder="Paste your assignment instructions here..."
              rows={7}
              value={directions}
              onChange={(event) =>
                setDirections(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />
          </div>

          {/* Available From */}
          <div>
            <label className="mb-2 block font-medium">
              Available From
            </label>

            <input
              type="date"
              value={availableFrom}
              onChange={(event) =>
                setAvailableFrom(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />

            <p className="mt-1 text-sm text-gray-500">
              Optional. If left blank, Headstart will plan from today.
            </p>
          </div>

          {/* Due Date */}
          <div>
            <label className="mb-2 block font-medium">
              Due Date
            </label>

            <input
              type="datetime-local"
              value={dueDate}
              onChange={(event) =>
                setDueDate(event.target.value)
              }
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />
          </div>

          {/* Assignment File */}
          <div>
            <label className="mb-2 block font-medium">
              Assignment File
            </label>

            <input
              type="file"
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />
          </div>

          {/* Rubric */}
          <div>
            <label className="mb-2 block font-medium">
              Rubric
            </label>

            <input
              type="file"
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />

            <p className="mt-1 text-sm text-gray-500">
              Optional
            </p>
          </div>

          {/* Generate Plan */}
          <button
            type="submit"
            className="w-full rounded-lg bg-black px-6 py-3 font-medium text-white"
          >
            Generate Plan
          </button>
        </form>
      </div>
    </main>
  );
}