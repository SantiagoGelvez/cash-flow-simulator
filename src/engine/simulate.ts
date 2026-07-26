import type { Scenario } from '@/types/scenario'
import type {
  Milestone,
  MonthlyEventRecord,
  MonthlyResult,
  SimulationOutput,
  SimulationSummary,
} from '@/types/simulation'

import { calcularIngresoMes } from './income'
import { aplicarAbonoExtra, aplicarInteresYPagoMinimo } from './debts'
import { procesarFondoImprevistos } from './emergencyFund'
import { eventosDelMes } from './events'

export function crearEscenarioVacio(): Scenario {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    nombre: 'Nuevo escenario',
    createdAt: now,
    updatedAt: now,
    incomeSources: [],
    debts: [],
    plannedEvents: [],
    emergencyFund: { aporteMensual: 0, tope: 0, imprevistos: [] },
    settings: {
      cajaInicial: 0,
      gastoFijoMensual: 0,
      pctExcedenteAAbonoExtra: 0,
      colchonMinimo: 0,
      mesesSimulacion: 24,
    },
  }
}

export function simularEscenario(scenario: Scenario): SimulationOutput {
  const { incomeSources, debts, plannedEvents, emergencyFund, settings } = scenario

  const tasas: Record<string, number> = Object.fromEntries(debts.map((d) => [d.id, d.tasaEA]))
  const balances = new Map<string, number>(debts.map((d) => [d.id, d.saldoInicial]))
  const debtsPagadasFlag = new Set<string>()

  let caja = settings.cajaInicial
  let fondoAcumulado = 0

  const meses: MonthlyResult[] = []
  const hitos: Milestone[] = []

  for (let mes = 1; mes <= settings.mesesSimulacion; mes++) {
    const cajaAnterior = caja

    // 1. Income
    const ingresoTotal = calcularIngresoMes(incomeSources, mes)

    // 2. Interest + minimum payment per debt
    let deudasEstado = debts.map((deuda) =>
      aplicarInteresYPagoMinimo(deuda, balances.get(deuda.id) ?? 0),
    )
    const pagoDeudas = deudasEstado.reduce((sum, d) => sum + d.pagoMinimo, 0)

    // 3. Emergency fund contribution + imprevistos this month
    const imprevistosDelMes = emergencyFund.imprevistos.filter((i) => i.mes === mes)
    const fondoResultado = procesarFondoImprevistos(fondoAcumulado, emergencyFund, imprevistosDelMes)
    fondoAcumulado = fondoResultado.acumuladoFinal

    // 4. Planned events this month
    const eventosResultado = eventosDelMes(plannedEvents, mes)

    // 5. Cash before extra paydown
    const cajaAntesDeAbono =
      caja +
      ingresoTotal -
      pagoDeudas -
      settings.gastoFijoMensual -
      fondoResultado.aporte -
      eventosResultado.gastoEventos -
      fondoResultado.faltante +
      eventosResultado.ingresoEventos

    // 6. Extra paydown pool
    const poolDisponible =
      Math.max(0, cajaAntesDeAbono - settings.colchonMinimo) *
      (settings.pctExcedenteAAbonoExtra / 100)

    // 7. Avalanche
    const abonoResultado = aplicarAbonoExtra(deudasEstado, tasas, poolDisponible)
    deudasEstado = abonoResultado.deudas

    // 8. Final cash
    const cajaFinal = cajaAntesDeAbono - abonoResultado.poolAplicado

    // Persist balances for next month
    for (const d of deudasEstado) {
      balances.set(d.debtId, d.saldoFinal)
    }
    caja = cajaFinal

    // 10. Milestones (deuda pagada)
    const hitosDelMes: string[] = []
    for (const d of deudasEstado) {
      if (d.saldoFinal <= 0 && !debtsPagadasFlag.has(d.debtId)) {
        debtsPagadasFlag.add(d.debtId)
        d.pagadaEsteMes = true
        const descripcion = `${d.nombre} pagada`
        hitosDelMes.push(descripcion)
        hitos.push({ mes, tipo: 'deuda_pagada', descripcion, debtId: d.debtId })
      }
    }
    if (cajaFinal < 0) {
      hitos.push({ mes, tipo: 'caja_negativa', descripcion: 'Caja disponible negativa' })
    }

    const eventos: MonthlyEventRecord[] = [
      ...eventosResultado.registros,
      ...imprevistosDelMes.map((imp) => ({
        id: imp.id,
        nombre: imp.nombre,
        tipo: 'imprevisto' as const,
        monto: imp.monto,
      })),
    ]

    const deudaTotalFinal = deudasEstado.reduce((sum, d) => sum + Math.max(0, d.saldoFinal), 0)

    meses.push({
      mes,
      ingresoTotal,
      gastoFijo: settings.gastoFijoMensual,
      aporteFondo: fondoResultado.aporte,
      fondoAcumulado,
      imprevistosPagadosDelFondo: fondoResultado.pagadoDelFondo,
      imprevistosFaltante: fondoResultado.faltante,
      eventos,
      ingresoEventos: eventosResultado.ingresoEventos,
      gastoEventos: eventosResultado.gastoEventos,
      pagoDeudas,
      abonoExtraTotal: abonoResultado.poolAplicado,
      cajaAntesDeAbono,
      cajaFinal,
      flujoNeto: cajaFinal - cajaAnterior,
      deudaTotalFinal,
      deudas: deudasEstado,
      hitos: hitosDelMes,
    })
  }

  const resumen = calcularResumen(meses, settings.cajaInicial)

  return { meses, hitos, resumen }
}

function calcularResumen(meses: MonthlyResult[], cajaInicial: number): SimulationSummary {
  if (meses.length === 0) {
    return {
      mesTensionMinima: 0,
      cajaMinima: cajaInicial,
      deudaTotalFinal: 0,
      patrimonioNetoFinal: cajaInicial,
      mesLibreDeDeuda: null,
      hayMesesConCajaNegativa: false,
    }
  }

  let mesTensionMinima = meses[0].mes
  let cajaMinima = meses[0].cajaFinal
  let mesLibreDeDeuda: number | null = null
  let hayMesesConCajaNegativa = false

  for (const m of meses) {
    if (m.cajaFinal < cajaMinima) {
      cajaMinima = m.cajaFinal
      mesTensionMinima = m.mes
    }
    if (m.cajaFinal < 0) hayMesesConCajaNegativa = true
    if (mesLibreDeDeuda === null && m.deudaTotalFinal <= 0) mesLibreDeDeuda = m.mes
  }

  const ultimo = meses[meses.length - 1]

  return {
    mesTensionMinima,
    cajaMinima,
    deudaTotalFinal: ultimo.deudaTotalFinal,
    patrimonioNetoFinal: ultimo.cajaFinal - ultimo.deudaTotalFinal,
    mesLibreDeDeuda,
    hayMesesConCajaNegativa,
  }
}
