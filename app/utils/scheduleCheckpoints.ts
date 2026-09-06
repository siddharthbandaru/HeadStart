export type SchedulableCheckpoint = {
  title: string;
  estimatedMinutes: number;
};

export type ScheduledCheckpoint = {
  id: number;
  title: string;
  estimatedMinutes: number;
  date: string;
};

export function scheduleCheckpoints(
  checkpoints: SchedulableCheckpoint[],
  startDateString: string,
  dueDateString: string
): ScheduledCheckpoint[] {
  const start = new Date(`${startDateString}T00:00:00`);
  const due = new Date(`${dueDateString}T00:00:00`);

  const oneDay = 1000 * 60 * 60 * 24;

  const totalDays = Math.max(
    1,
    Math.floor(
      (due.getTime() - start.getTime()) / oneDay
    )
  );

  const usableDays = Math.max(1, totalDays - 1);

  const totalMinutes = checkpoints.reduce(
    (sum, checkpoint) =>
      sum + checkpoint.estimatedMinutes,
    0
  );

  let cumulativeMinutes = 0;

  return checkpoints.map((checkpoint, index) => {
    const progress =
      totalMinutes === 0
        ? index / Math.max(1, checkpoints.length - 1)
        : cumulativeMinutes / totalMinutes;

    const dayOffset = Math.min(
      usableDays - 1,
      Math.floor(progress * usableDays)
    );

    const scheduledDate = new Date(start);

    scheduledDate.setDate(
      start.getDate() + dayOffset
    );

    cumulativeMinutes +=
      checkpoint.estimatedMinutes;

    return {
      id: index + 1,
      title: checkpoint.title,
      estimatedMinutes:
        checkpoint.estimatedMinutes,
      date: scheduledDate
        .toISOString()
        .split("T")[0],
    };
  });
}