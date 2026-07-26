import type { EmergencyFund, Imprevisto } from '@/types/scenario'

export interface ResultadoFondoMes {
  aporte: number
  acumuladoFinal: number
  pagadoDelFondo: number
  faltante: number
}

/**
 * Contribution is credited first (capped at tope), then that month's
 * imprevistos are paid from the resulting balance; any shortfall is
 * reported separately for the caller to draw from cash.
 */
export function procesarFondoImprevistos(
  acumuladoAnterior: number,
  fund: Pick<EmergencyFund, 'aporteMensual' | 'tope'>,
  imprevistosDelMes: Imprevisto[],
): ResultadoFondoMes {
  const aporte = Math.max(0, Math.min(fund.aporteMensual, fund.tope - acumuladoAnterior))
  let disponible = acumuladoAnterior + aporte

  let pagadoDelFondo = 0
  let faltante = 0

  for (const imprevisto of imprevistosDelMes) {
    const pagar = Math.min(imprevisto.monto, disponible)
    pagadoDelFondo += pagar
    faltante += imprevisto.monto - pagar
    disponible -= pagar
  }

  return {
    aporte,
    acumuladoFinal: disponible,
    pagadoDelFondo,
    faltante,
  }
}
