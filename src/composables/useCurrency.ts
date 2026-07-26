const formatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

const plainFormatter = new Intl.NumberFormat('es-CO', {
  maximumFractionDigits: 0,
})

export function formatCOP(monto: number): string {
  return formatter.format(Number.isFinite(monto) ? monto : 0)
}

/** Thousands-separated number without the currency symbol, e.g. for input fields. */
export function formatNumber(monto: number): string {
  return plainFormatter.format(Number.isFinite(monto) ? monto : 0)
}

/** Parses a possibly `es-CO` formatted string (period thousands separator) back to a number. */
export function parseCurrencyInput(value: string): number {
  const cleaned = value.replace(/[^\d-]/g, '')
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? parsed : 0
}
