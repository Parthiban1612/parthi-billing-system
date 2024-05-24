export function formatRupees(amount) {
  return amount.toLocaleString('en-IN').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}