export interface SalaryIncrease {
  id: string
  /** Simulation month (1-based) this amount takes effect from. */
  mesInicio: number
  monto: number
}

export interface IncomeSource {
  id: string
  nombre: string
  /** May be entered/edited out of chronological order. */
  incrementos: SalaryIncrease[]
}

export type DebtType = 'cuota_fija' | 'revolvente'

export interface Debt {
  id: string
  nombre: string
  saldoInicial: number
  /** Annual effective rate, e.g. 0.24 = 24% EA. */
  tasaEA: number
  tipo: DebtType
  /** Required when tipo === 'cuota_fija'. */
  cuotaMensual?: number
  /** Used when tipo === 'revolvente'; defaults to 30000 at the point of use. */
  pisoMinimo?: number
}

export type PlannedEventType = 'gasto' | 'ingreso'

export interface PlannedEvent {
  id: string
  nombre: string
  tipo: PlannedEventType
  /** Total amount; split evenly across `cuotas` when > 1. */
  monto: number
  /** First month this event applies. */
  mes: number
  /** Number of equal installments starting at `mes`. Defaults to 1. */
  cuotas?: number
}

export interface Imprevisto {
  id: string
  nombre: string
  monto: number
  mes: number
}

export interface EmergencyFund {
  aporteMensual: number
  tope: number
  imprevistos: Imprevisto[]
}

export interface Settings {
  cajaInicial: number
  gastoFijoMensual: number
  /** 0-100. Share of the monthly surplus above colchonMinimo sent to extra debt paydown. */
  pctExcedenteAAbonoExtra: number
  colchonMinimo: number
  /** Default 24, editable range 6-60. */
  mesesSimulacion: number
}

export interface Scenario {
  id: string
  nombre: string
  createdAt: string
  updatedAt: string
  incomeSources: IncomeSource[]
  debts: Debt[]
  plannedEvents: PlannedEvent[]
  emergencyFund: EmergencyFund
  settings: Settings
}
