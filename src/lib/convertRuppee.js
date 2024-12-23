export function formatRupees(amount) {
  const validAmount = Number(amount) || 0; // Convert to number or default to 0 if conversion fails
  return validAmount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}