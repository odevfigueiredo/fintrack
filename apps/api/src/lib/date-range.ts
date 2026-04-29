export function monthRange(month: string) {
  const parts = month.split("-");
  const yearValue = Number(parts[0]);
  const monthValue = Number(parts[1]);
  const start = new Date(Date.UTC(yearValue, monthValue - 1, 1));
  const end = new Date(Date.UTC(yearValue, monthValue, 1));

  return { start, end };
}

export function currentMonthRange(now = new Date()) {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

  return { start, end };
}

export function lastMonths(count: number, now = new Date()) {
  return Array.from({ length: count })
    .map((_, index) => {
      const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - index, 1));
      return date.toISOString().slice(0, 7);
    })
    .reverse();
}
