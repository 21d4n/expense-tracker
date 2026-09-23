type TransactionTypeChipProps = {
  type: "INCOME" | "EXPENSE";
};

export default function TransactionTypeChip({ type }: TransactionTypeChipProps) {
  const isIncome = type === "INCOME";
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-1 font-display text-xs tracking-wide ${
        isIncome ? "border-success/50 text-success" : "border-danger/50 text-danger"
      }`}
    >
      {isIncome ? "Pemasukan" : "Pengeluaran"}
    </span>
  );
}
