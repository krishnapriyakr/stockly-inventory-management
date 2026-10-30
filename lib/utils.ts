export function getStartDate(range: string): Date | null {
  const now = new Date();
  switch (range) {
    case "today":
      return new Date(now.setHours(0, 0, 0, 0));
    case "week":
      now.setDate(now.getDate() - 7);
      return now;
    case "month":
      now.setMonth(now.getMonth() - 1);
      return now;
    case "year":
      now.setFullYear(now.getFullYear() - 1);
      return now;
    default:
      return null; // All time
  }
}