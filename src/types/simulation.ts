export interface DebtMonthState {
  debtId: string
  nombre: string
  /** Balance entering the month, before interest. */
  saldoInicial: number
  interes: number
  pagoMinimo: number
  abonoExtra: number
  /** Balance after interest, minimum payment, and any extra avalanche paydown. */
  saldoFinal: number
  /** True only the first month saldoFinal reaches (or crosses below) zero. */
  pagadaEsteMes: boolean
}

export type MonthlyEventKind = 'gasto' | 'ingreso' | 'imprevisto'

export interface MonthlyEventRecord {
  id: string
  nombre: string
  tipo: MonthlyEventKind
  monto: number
}

export interface MonthlyResult {
  mes: number
  ingresoTotal: number
  gastoFijo: number
  aporteFondo: number
  fondoAcumulado: number
  imprevistosPagadosDelFondo: number
  /** Portion of this month's imprevistos the fund couldn't cover, drawn from cash. */
  imprevistosFaltante: number
  eventos: MonthlyEventRecord[]
  ingresoEventos: number
  gastoEventos: number
  /** Sum of minimum payments across all debts. */
  pagoDeudas: number
  abonoExtraTotal: number
  cajaAntesDeAbono: number
  cajaFinal: number
  flujoNeto: number
  deudaTotalFinal: number
  deudas: DebtMonthState[]
  /** Human-readable milestone strings landing this month (e.g. "Deuda X pagada"). */
  hitos: string[]
}

export type MilestoneType = 'deuda_pagada' | 'fondo_tope_alcanzado' | 'caja_negativa'

export interface Milestone {
  mes: number
  tipo: MilestoneType
  descripcion: string
  debtId?: string
}

export interface SimulationSummary {
  mesTensionMinima: number
  cajaMinima: number
  deudaTotalFinal: number
  /** cajaFinal - deudaTotalFinal, last simulated month. */
  patrimonioNetoFinal: number
  /** First month total debt reaches 0, or null if it never does within the simulation. */
  mesLibreDeDeuda: number | null
  hayMesesConCajaNegativa: boolean
}

export interface SimulationOutput {
  meses: MonthlyResult[]
  hitos: Milestone[]
  resumen: SimulationSummary
}
