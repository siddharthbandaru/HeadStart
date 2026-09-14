import { generatePlan } from "../../../lib/planner/generatePlan";
import { AssignmentInput } from "../../../lib/planner/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<AssignmentInput>;

    const startDate = body.availableFrom || new Date().toISOString().split("T")[0];

    if (!body.title || !body.directions || !body.dueDate) {
      return Response.json(
        {
          error:
            "title, directions, and dueDate are required.",
        },
        { status: 400 }
      );
    }

    const plan = generatePlan({
      title: body.title,
      directions: body.directions,
      rubric: body.rubric,
      availableFrom: startDate,
      dueDate: body.dueDate,
      dailyAvailableMinutes: body.dailyAvailableMinutes,
    });

    return Response.json(plan, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to generate plan.";

    return Response.json({ error: message }, { status: 400 });
  }
}
