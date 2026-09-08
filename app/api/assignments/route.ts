type AssignmentRequest = {
  name?: string;
  directions?: string;
  availableFrom?: string;
  dueDate?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AssignmentRequest;

    const { name, directions, availableFrom, dueDate } = body;

    if (!name || !directions || !availableFrom || !dueDate) {
      return Response.json(
        {
          error:
            "name, directions, availableFrom, and dueDate are all required.",
        },
        { status: 400 }
      );
    }

    const availableDate = new Date(availableFrom);
    const deadline = new Date(dueDate);

    if (
      Number.isNaN(availableDate.getTime()) ||
      Number.isNaN(deadline.getTime())
    ) {
      return Response.json(
        { error: "availableFrom and dueDate must be valid dates." },
        { status: 400 }
      );
    }

    if (deadline <= availableDate) {
      return Response.json(
        { error: "dueDate must be after availableFrom." },
        { status: 400 }
      );
    }

    const plan = [
      {
        title: "Review assignment requirements",
        estimatedMinutes: 30,
      },
      {
        title: "Complete the main work",
        estimatedMinutes: 120,
      },
      {
        title: "Review against the directions",
        estimatedMinutes: 45,
      },
      {
        title: "Final proofread and submit",
        estimatedMinutes: 30,
      },
    ];

    return Response.json(
      {
        assignment: {
          name,
          directions,
          availableFrom,
          dueDate,
        },
        plan,
      },
      { status: 201 }
    );
  } catch {
    return Response.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }
}
