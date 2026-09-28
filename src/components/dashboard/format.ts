export function formatRupiah(value: string): string {
  const negative = value.startsWith("-");
  const [whole, fraction] = (negative ? value.slice(1) : value).split(".");
  const grouped = new Intl.NumberFormat("id-ID").format(BigInt(whole));
  return `${negative ? "-" : ""}Rp${grouped}${fraction === "00" ? "" : `,${fraction}`}`;
}

export function formatTanggal(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
}
