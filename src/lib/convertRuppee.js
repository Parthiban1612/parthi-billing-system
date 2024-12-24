export function formatRupees(amount) {
  const validAmount = Number(amount) || 0;
  return validAmount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}