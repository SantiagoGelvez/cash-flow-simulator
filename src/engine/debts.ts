import type { Debt } from '@/types/scenario'
import type { DebtMonthState } from '@/types/simulation'

export const PISO_MINIMO_DEFAULT = 30000

/** Monthly effective rate derived from an annual effective rate. */
export function tasaMensualEfectiva(tasaEA: number): number {
  return Math.pow(1 + tasaEA, 1 / 12) - 1
}

/**
 * Minimum payment for the month, given the balance after interest has
 * already accrued. Never exceeds the remaining balance.
 */
export function calcularPagoMinimo(deuda: Debt, saldoConInteres: number): number {
  if (saldoConInteres <= 0) return 0

  if (deuda.tipo === 'cuota_fija') {
    const cuota = deuda.cuotaMensual ?? 0
    return Math.min(cuota, saldoConInteres)
  }

  const piso = deuda.pisoMinimo ?? PISO_MINIMO_DEFAULT
  return Math.max(0.03 * saldoConInteres, Math.min(piso, saldoConInteres))
}

/**
 * Accrues one month of interest and applies the minimum payment.
 * Intentionally does NOT clamp saldoFinal to be <= saldoAnterior: a fixed
 * installment that doesn't cover interest is allowed to grow the balance.
 */
export function aplicarInteresYPagoMinimo(deuda: Debt, saldoAnterior: number): DebtMonthState {
  const interes = saldoAnterior > 0 ? saldoAnterior * tasaMensualEfectiva(deuda.tasaEA) : 0
  const saldoConInteres = saldoAnterior + interes
  const pagoMinimo = calcularPagoMinimo(deuda, saldoConInteres)
  const saldoFinal = saldoConInteres - pagoMinimo

  return {
    debtId: deuda.id,
    nombre: deuda.nombre,
    saldoInicial: saldoAnterior,
    interes,
    pagoMinimo,
    abonoExtra: 0,
    saldoFinal,
    pagadaEsteMes: false,
  }
}

/**
 * Applies the extra-paydown pool in strict descending-tasaEA avalanche
 * order, each debt capped at its remaining balance, cascading any
 * leftover to the next debt. Returns poolAplicado (what was actually
 * usable) rather than the full requested pool, so unused pool can be
 * left in cash by the caller instead of vanishing.
 */
export function aplicarAbonoExtra(
  deudas: DebtMonthState[],
  tasas: Record<string, number>,
  poolDisponible: number,
): { deudas: DebtMonthState[]; poolAplicado: number } {
  const orden = [...deudas]
    .filter((d) => d.saldoFinal > 0)
    .sort((a, b) => (tasas[b.debtId] ?? 0) - (tasas[a.debtId] ?? 0))
    .map((d) => d.debtId)

  const porId = new Map(deudas.map((d) => [d.debtId, { ...d }]))
  let restante = poolDisponible

  for (const debtId of orden) {
    if (restante <= 0) break
    const estado = porId.get(debtId)!
    const abono = Math.min(restante, estado.saldoFinal)
    estado.abonoExtra = abono
    estado.saldoFinal -= abono
    restante -= abono
  }

  return {
    deudas: deudas.map((d) => porId.get(d.debtId)!),
    poolAplicado: poolDisponible - restante,
  }
}
