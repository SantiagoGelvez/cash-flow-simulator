import type { IncomeSource, SalaryIncrease } from '@/types/scenario'

/**
 * Amount in effect for a given month: the most recent increase whose
 * mesInicio <= mes. Increases may be stored out of chronological order,
 * so they're sorted on a copy before searching.
 */
export function montoVigente(incrementos: SalaryIncrease[], mes: number): number {
  const aplicables = [...incrementos]
    .filter((inc) => inc.mesInicio <= mes)
    .sort((a, b) => a.mesInicio - b.mesInicio)

  if (aplicables.length === 0) return 0
  return aplicables[aplicables.length - 1].monto
}

export function calcularIngresoMes(fuentes: IncomeSource[], mes: number): number {
  return fuentes.reduce((total, fuente) => total + montoVigente(fuente.incrementos, mes), 0)
}
