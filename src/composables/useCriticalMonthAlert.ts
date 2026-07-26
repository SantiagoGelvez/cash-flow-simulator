import type { Settings } from '@/types/scenario'
import type { MonthlyResult, SimulationOutput } from '@/types/simulation'
import { formatCOP } from './useCurrency'

export type AlertLevel = 'critical' | 'warning' | 'ok'

export interface CriticalMonthAlert {
  level: AlertLevel
  mes: number | null
  title: string
  message: string
}

function mayorImpulsorDeGasto(mes: MonthlyResult): { nombre: string; monto: number } {
  const candidatos = [
    { nombre: 'el gasto fijo mensual', monto: mes.gastoFijo },
    { nombre: 'las cuotas de deuda', monto: mes.pagoDeudas },
    { nombre: 'los gastos de eventos planeados', monto: mes.gastoEventos },
    { nombre: 'un imprevisto no cubierto por el fondo', monto: mes.imprevistosFaltante },
    { nombre: 'el aporte al fondo de imprevistos', monto: mes.aporteFondo },
  ]
  return candidatos.reduce((mayor, actual) => (actual.monto > mayor.monto ? actual : mayor))
}

export function buildCriticalMonthAlert(
  output: SimulationOutput,
  settings: Settings,
): CriticalMonthAlert {
  const { resumen, meses } = output

  if (meses.length === 0) {
    return {
      level: 'ok',
      mes: null,
      title: 'Agrega datos para ver tu proyección',
      message:
        'Añade al menos un aportante de ingreso y tu gasto fijo para que la simulación tenga algo que calcular.',
    }
  }

  if (resumen.hayMesesConCajaNegativa) {
    const mesCritico = meses.find((m) => m.cajaFinal < 0) ?? meses[resumen.mesTensionMinima - 1]
    const impulsor = mayorImpulsorDeGasto(mesCritico)
    return {
      level: 'critical',
      mes: mesCritico.mes,
      title: `Tu caja queda en negativo en el mes ${mesCritico.mes}`,
      message:
        `En el mes ${mesCritico.mes} la caja disponible llega a ${formatCOP(mesCritico.cajaFinal)}, ` +
        `principalmente por ${impulsor.nombre} (${formatCOP(impulsor.monto)}). ` +
        `Considera reducir el % de excedente destinado a abono extra, mover algún evento planeado a otro mes, ` +
        `o aumentar el colchón mínimo antes de ese punto para no quedarte corto.`,
    }
  }

  const margenSobreColchon = resumen.cajaMinima - settings.colchonMinimo
  const margenEstrecho = settings.colchonMinimo > 0 && margenSobreColchon < settings.colchonMinimo * 0.25

  if (margenEstrecho) {
    return {
      level: 'warning',
      mes: resumen.mesTensionMinima,
      title: `Tu caja más ajustada es en el mes ${resumen.mesTensionMinima}`,
      message:
        `Ese mes la caja disponible baja a ${formatCOP(resumen.cajaMinima)}, muy cerca de tu colchón mínimo ` +
        `(${formatCOP(settings.colchonMinimo)}). No es negativo, pero deja poco margen para un imprevisto adicional.`,
    }
  }

  const libreDeDeuda =
    resumen.mesLibreDeDeuda !== null
      ? `Quedarás libre de deudas en el mes ${resumen.mesLibreDeDeuda}.`
      : 'Con la estrategia actual, no alcanzas a quedar libre de deudas dentro del periodo simulado.'

  return {
    level: 'ok',
    mes: resumen.mesTensionMinima,
    title: 'Tu flujo de caja se mantiene saludable',
    message: `Tu punto más ajustado es en el mes ${resumen.mesTensionMinima}, con ${formatCOP(resumen.cajaMinima)} disponibles. ${libreDeDeuda}`,
  }
}
