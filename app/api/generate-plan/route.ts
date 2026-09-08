import { generatePlan } from "../../../lib/planner/generatePlan";
import { AssignmentInput } from "../../../lib/planner/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<AssignmentInput>;

    if (!body.title || !body.directions || !body.availableFrom || !body.dueDate) {
      return Response.json(
        {
          error:
            "title, directions, availableFrom, and dueDate are required.",
        },
        { status: 400 }
      );
    }

    const plan = generatePlan({
      title: body.title,
      directions: body.directions,
      rubric: body.rubric,
      availableFrom: body.availableFrom,
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
