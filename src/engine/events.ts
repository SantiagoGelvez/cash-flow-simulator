import type { PlannedEvent } from '@/types/scenario'
import type { MonthlyEventRecord } from '@/types/simulation'

export interface ResultadoEventosMes {
  registros: MonthlyEventRecord[]
  ingresoEventos: number
  gastoEventos: number
}

export function eventosDelMes(eventos: PlannedEvent[], mes: number): ResultadoEventosMes {
  const registros: MonthlyEventRecord[] = []
  let ingresoEventos = 0
  let gastoEventos = 0

  for (const evento of eventos) {
    const cuotas = evento.cuotas ?? 1
    const mesFinal = evento.mes + cuotas - 1
    if (mes < evento.mes || mes > mesFinal) continue

    const montoCuota = evento.monto / cuotas
    registros.push({
      id: evento.id,
      nombre: evento.nombre,
      tipo: evento.tipo,
      monto: montoCuota,
    })

    if (evento.tipo === 'ingreso') {
      ingresoEventos += montoCuota
    } else {
      gastoEventos += montoCuota
    }
  }

  return { registros, ingresoEventos, gastoEventos }
}
