/** Bulan kalender berjalan dalam zona waktu Asia/Jakarta (YYYY-MM). */
export function getCurrentMonthWIB(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
  }).format(new Date());
}

/** Rentang instant UTC untuk satu bulan kalender Asia/Jakarta, batas akhir eksklusif. */
export function getWIBMonthDateRange(year: number, month: number): {
  startDate: Date;
  endDate: Date;
} {
  const startDate = new Date(Date.UTC(year, month - 1, 1, -7, 0, 0, 0));
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const endDate = new Date(Date.UTC(nextYear, nextMonth - 1, 1, -7, 0, 0, 0));

  return { startDate, endDate };
}
