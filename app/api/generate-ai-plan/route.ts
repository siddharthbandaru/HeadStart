import Groq from "groq-sdk";
import { GoogleGenAI } from "@google/genai";
import { generatePlan } from "@/lib/planner/generatePlan";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const gemini = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

type AIPlanRequest = {
    title?: string;
    directions?: string;
    availableFrom?: string;
    dueDate?: string;
    dailyAvailableMinutes?: number;
};

type AITask = {
    id: string;
    title: string;
    estimatedMinutes: number;
    scheduledStart: string;
};

type AIPlan = {
    tasks: AITask[];
};

function buildPrompt(
    title: string,
    directions: string,
    startDate: string,
    dueDate: string,
    dailyAvailableMinutes: number
) {
    return `
You are the planning engine for HeadStart, a student assignment planner.

Create a realistic work plan for the following assignment.

Assignment:
Title: ${title}

Directions:
${directions}

Available from: ${startDate}
Due date: ${dueDate}
Maximum work per day: ${dailyAvailableMinutes} minutes

Requirements:
- Break the assignment into specific, useful checkpoints.
- Aim for 6 to 12 checkpoints depending on assignment complexity.
- Combine closely related work into one checkpoint when appropriate.
- Do not create unnecessary micro-tasks.
- Estimate a realistic number of minutes for each checkpoint.
- Schedule every checkpoint between the available date and due date.
- Do not schedule work before the available date.
- Do not schedule work after the due date.
- Do not schedule more than ${dailyAvailableMinutes} total minutes on one day.
- Put tasks in a logical order.
- Respect dependencies between tasks.
- Start difficult work early when appropriate.
- Spread large assignments across multiple days.
- Avoid leaving major work until the final day.
- Leave buffer time before the deadline when possible.
- Keep checkpoint titles concise, specific, and action-oriented.
- Each title should clearly describe what the student needs to accomplish.
- Include important assignment-specific details when useful.
- Avoid vague titles such as "Work on project", "Testing", or "Review".
- Keep most checkpoint titles between 3 and 8 words.
- Do not create artificial checkpoints for buffer time, waiting, breaks, or backup days.
- Create checkpoints only for actual work required to complete the assignment.
- scheduledStart must use YYYY-MM-DD format.

Return ONLY valid JSON in exactly this shape:

{
  "tasks": [
    {
      "id": "task-1",
      "title": "Example checkpoint",
      "estimatedMinutes": 60,
      "scheduledStart": "YYYY-MM-DD"
    }
  ]
}

Do not include markdown.
Do not include code fences.
Do not include explanations outside the JSON.
`;
}

function validatePlan(plan: AIPlan): AIPlan {
    if (!Array.isArray(plan.tasks) || plan.tasks.length === 0) {
        throw new Error("AI returned an empty task list.");
    }

    for (const task of plan.tasks) {
        if (
            typeof task.id !== "string" ||
            typeof task.title !== "string" ||
            typeof task.estimatedMinutes !== "number" ||
            task.estimatedMinutes <= 0 ||
            typeof task.scheduledStart !== "string"
        ) {
            throw new Error("AI returned an invalid task.");
        }
    }

    return plan;
}

async function generateWithGroq(
    prompt: string
): Promise<AIPlan> {
    if (!process.env.GROQ_API_KEY) {
        throw new Error("Groq API key is not configured.");
    }

    const response = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
            {
                role: "system",
                content:
                    "You are HeadStart's scheduling engine. Return only valid JSON.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        response_format: {
            type: "json_object",
        },
        temperature: 0.2,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
        throw new Error("Groq returned an empty response.");
    }

    return validatePlan(JSON.parse(content) as AIPlan);
}

async function generateWithGemini(
    prompt: string
): Promise<AIPlan> {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Gemini API key is not configured.");
    }

    const response = await gemini.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "object",
                properties: {
                    tasks: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: {
                                    type: "string",
                                },
                                title: {
                                    type: "string",
                                },
                                estimatedMinutes: {
                                    type: "number",
                                },
                                scheduledStart: {
                                    type: "string",
                                },
                            },
                            required: [
                                "id",
                                "title",
                                "estimatedMinutes",
                                "scheduledStart",
                            ],
                        },
                    },
                },
                required: ["tasks"],
            },
        },
    });

    if (!response.text) {
        throw new Error("Gemini returned an empty response.");
    }

    return validatePlan(
        JSON.parse(response.text) as AIPlan
    );
}

function calculateBufferDays(
    tasks: AITask[],
    dueDate: string
): number {
    if (tasks.length === 0) return 0;

    const latestTaskDate = tasks
        .map((task) => task.scheduledStart)
        .sort()
        .at(-1);

    if (!latestTaskDate) return 0;

    const lastTask = new Date(`${latestTaskDate}T00:00:00`);
    const due = new Date(dueDate);

    const differenceMs = due.getTime() - lastTask.getTime();

    return Math.max(
        0,
        Math.floor(differenceMs / (1000 * 60 * 60 * 24))
    );
}

function validateSchedule(
    tasks: AITask[],
    startDate: string,
    dueDate: string,
    dailyAvailableMinutes: number
): void {
    const minutesByDay = new Map<string, number>();

    const available = new Date(`${startDate}T00:00:00`);
    const due = new Date(dueDate);

    for (const task of tasks) {
        const taskDate = new Date(`${task.scheduledStart}T00:00:00`);

        if (Number.isNaN(taskDate.getTime())) {
            throw new Error(
                `Invalid scheduled date for "${task.title}".`
            );
        }

        if (taskDate < available) {
            throw new Error(
                `"${task.title}" was scheduled before the assignment is available.`
            );
        }

        if (taskDate > due) {
            throw new Error(
                `"${task.title}" was scheduled after the due date.`
            );
        }

        const currentMinutes =
            minutesByDay.get(task.scheduledStart) ?? 0;

        const newTotal =
            currentMinutes + task.estimatedMinutes;

        if (newTotal > dailyAvailableMinutes) {
            throw new Error(
                `AI scheduled ${newTotal} minutes on ${task.scheduledStart}, exceeding the ${dailyAvailableMinutes}-minute daily limit.`
            );
        }

        minutesByDay.set(task.scheduledStart, newTotal);
    }
}

export async function POST(request: Request) {
    try {
        const body: AIPlanRequest = await request.json();

        const {
            title,
            directions,
            availableFrom,
            dueDate,
            dailyAvailableMinutes = 120,
        } = body;

        if (!title?.trim() || !directions?.trim() || !dueDate) {
            return Response.json(
                {
                    error:
                        "Title, directions, and due date are required to generate a plan.",
                },
                { status: 400 }
            );
        }

        const startDate =
            availableFrom ||
            new Date().toISOString().split("T")[0];

        const prompt = buildPrompt(
            title.trim(),
            directions.trim(),
            startDate,
            dueDate,
            dailyAvailableMinutes
        );

        let plan: AIPlan;
        let provider: "groq" | "gemini" | "standard";

        try {
            console.log("AI planner: trying Groq...");

            plan = await generateWithGroq(prompt);

            validateSchedule(
                plan.tasks,
                startDate,
                dueDate,
                dailyAvailableMinutes
            );

            provider = "groq";

            console.log("AI planner: Groq succeeded.");
        } catch (groqError) {
            console.warn(
                "AI planner: Groq failed. Trying Gemini...",
                groqError
            );

            try {
                plan = await generateWithGemini(prompt);

                validateSchedule(
                    plan.tasks,
                    startDate,
                    dueDate,
                    dailyAvailableMinutes
                );

                provider = "gemini";

                console.log("AI planner: Gemini succeeded.");
            } catch (geminiError) {
                console.error(
                    "AI planner: Gemini also failed. Falling back to Standard planner.",
                    geminiError
                );

                const standardPlan = generatePlan({
                    title: title.trim(),
                    directions: directions.trim(),
                    availableFrom: startDate,
                    dueDate,
                    dailyAvailableMinutes,
                });

                console.log("AI planner: Standard fallback succeeded.");

                return Response.json({
                    ...standardPlan,
                    provider: "standard",
                    aiFallback: true,
                    warning:
                        standardPlan.warning ??
                        "AI scheduling is temporarily unavailable. HeadStart generated a Standard plan instead.",
                });
            }
        }

        const estimatedTotalMinutes = plan.tasks.reduce(
            (total, task) =>
                total + task.estimatedMinutes,
            0
        );

        const bufferDays = calculateBufferDays(
            plan.tasks,
            dueDate
        );

        return Response.json({
            feasible: true,
            warning: undefined,
            estimatedTotalMinutes,
            bufferDays,
            tasks: plan.tasks,
            provider,
        });
    } catch (error) {
        console.error("AI planner failed:", error);

        return Response.json(
            {
                error:
                    "Unable to generate an AI plan. Please try again.",
            },
            { status: 500 }
        );
    }
}