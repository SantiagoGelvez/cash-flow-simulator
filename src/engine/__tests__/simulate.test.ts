import { describe, expect, it } from 'vitest'
import { crearEscenarioVacio, simularEscenario } from '../simulate'
import type { Scenario } from '@/types/scenario'

function buildScenario(overrides: Partial<Scenario>): Scenario {
  return { ...crearEscenarioVacio(), ...overrides }
}

describe('simularEscenario — empty scenario', () => {
  it('does not crash with zero earners, debts, and events, and cash follows only settings', () => {
    const scenario = buildScenario({
      settings: {
        cajaInicial: 500000,
        gastoFijoMensual: 100000,
        pctExcedenteAAbonoExtra: 50,
        colchonMinimo: 0,
        mesesSimulacion: 3,
      },
    })
    const output = simularEscenario(scenario)
    expect(output.meses).toHaveLength(3)
    expect(output.meses[0].cajaFinal).toBeCloseTo(400000, 6)
    expect(output.meses[1].cajaFinal).toBeCloseTo(300000, 6)
    expect(output.meses[2].cajaFinal).toBeCloseTo(200000, 6)
    expect(output.resumen.deudaTotalFinal).toBe(0)
    expect(output.resumen.mesLibreDeDeuda).toBe(1) // no debts at all -> already debt-free
  })
})

describe('simularEscenario — earner starting mid-simulation', () => {
  it('contributes 0 before mesInicio and the full salary from then on', () => {
    const scenario = buildScenario({
      incomeSources: [
        { id: 'e1', nombre: 'Yo', incrementos: [{ id: 'i1', mesInicio: 3, monto: 1000000 }] },
      ],
      settings: {
        cajaInicial: 0,
        gastoFijoMensual: 0,
        pctExcedenteAAbonoExtra: 0,
        colchonMinimo: 0,
        mesesSimulacion: 4,
      },
    })
    const output = simularEscenario(scenario)
    expect(output.meses[0].ingresoTotal).toBe(0)
    expect(output.meses[1].ingresoTotal).toBe(0)
    expect(output.meses[2].ingresoTotal).toBe(1000000)
    expect(output.meses[3].ingresoTotal).toBe(1000000)
  })
})

describe('simularEscenario — fixed installment that does not cover interest', () => {
  it('lets the debt balance grow month over month instead of clamping it', () => {
    const scenario = buildScenario({
      debts: [
        { id: 'd1', nombre: 'Deuda cara', saldoInicial: 1000000, tasaEA: 0.8, tipo: 'cuota_fija', cuotaMensual: 1000 },
      ],
      settings: {
        cajaInicial: 10000000,
        gastoFijoMensual: 0,
        pctExcedenteAAbonoExtra: 0,
        colchonMinimo: 0,
        mesesSimulacion: 6,
      },
    })
    const output = simularEscenario(scenario)
    const saldos = output.meses.map((m) => m.deudaTotalFinal)
    for (let i = 1; i < saldos.length; i++) {
      expect(saldos[i]).toBeGreaterThan(saldos[i - 1])
    }
  })
})

describe('simularEscenario — emergency fund cap and drawdown', () => {
  it('stops contributing at tope and resumes after a withdrawal, correctly paying imprevistos', () => {
    const scenario = buildScenario({
      emergencyFund: {
        aporteMensual: 200000,
        tope: 500000,
        imprevistos: [{ id: 'imp1', nombre: 'Emergencia', monto: 300000, mes: 4 }],
      },
      settings: {
        cajaInicial: 5000000,
        gastoFijoMensual: 0,
        pctExcedenteAAbonoExtra: 0,
        colchonMinimo: 0,
        mesesSimulacion: 6,
      },
    })
    const output = simularEscenario(scenario)
    expect(output.meses[0].fondoAcumulado).toBe(200000)
    expect(output.meses[1].fondoAcumulado).toBe(400000)
    expect(output.meses[2].fondoAcumulado).toBe(500000) // capped at tope
    expect(output.meses[2].aporteFondo).toBe(100000) // only the remaining room contributed
    // month 4: imprevisto draws 300000 from a fund that received no further contribution (already at tope in month 3)
    expect(output.meses[3].imprevistosPagadosDelFondo).toBe(300000)
    expect(output.meses[3].imprevistosFaltante).toBe(0)
    expect(output.meses[3].fondoAcumulado).toBe(200000)
    // month 5: contributions resume since balance is now below tope
    expect(output.meses[4].aporteFondo).toBe(200000)
    expect(output.meses[4].fondoAcumulado).toBe(400000)
  })

  it('draws the shortfall straight from cash when the fund cannot cover an imprevisto', () => {
    const scenario = buildScenario({
      emergencyFund: {
        aporteMensual: 0,
        tope: 100000,
        imprevistos: [{ id: 'imp1', nombre: 'Grande', monto: 1000000, mes: 1 }],
      },
      settings: {
        cajaInicial: 5000000,
        gastoFijoMensual: 0,
        pctExcedenteAAbonoExtra: 0,
        colchonMinimo: 0,
        mesesSimulacion: 1,
      },
    })
    const output = simularEscenario(scenario)
    expect(output.meses[0].imprevistosPagadosDelFondo).toBe(0)
    expect(output.meses[0].imprevistosFaltante).toBe(1000000)
    expect(output.meses[0].cajaFinal).toBeCloseTo(5000000 - 1000000, 6)
  })
})

describe('simularEscenario — multiple events and imprevistos in the same month', () => {
  it('nets out several simultaneous events and imprevistos correctly', () => {
    const scenario = buildScenario({
      plannedEvents: [
        { id: 'ev1', nombre: 'Moto', tipo: 'gasto', monto: 500000, mes: 2 },
        { id: 'ev2', nombre: 'Venta', tipo: 'ingreso', monto: 800000, mes: 2 },
      ],
      emergencyFund: {
        aporteMensual: 0,
        tope: 1000000,
        imprevistos: [
          { id: 'imp1', nombre: 'A', monto: 50000, mes: 2 },
          { id: 'imp2', nombre: 'B', monto: 70000, mes: 2 },
        ],
      },
      settings: {
        cajaInicial: 2000000,
        gastoFijoMensual: 0,
        pctExcedenteAAbonoExtra: 0,
        colchonMinimo: 0,
        mesesSimulacion: 2,
      },
    })
    const output = simularEscenario(scenario)
    const mes2 = output.meses[1]
    expect(mes2.eventos).toHaveLength(4) // 2 planned events + 2 imprevistos
    expect(mes2.gastoEventos).toBe(500000)
    expect(mes2.ingresoEventos).toBe(800000)
    expect(mes2.imprevistosFaltante).toBe(120000) // fund has 0, both imprevistos come from cash
  })
})

describe('simularEscenario — extra paydown strategy', () => {
  it('applies zero extra paydown when pctExcedenteAAbonoExtra is 0, regardless of surplus', () => {
    const scenario = buildScenario({
      debts: [{ id: 'd1', nombre: 'Deuda', saldoInicial: 1000000, tasaEA: 0.2, tipo: 'cuota_fija', cuotaMensual: 100000 }],
      settings: {
        cajaInicial: 5000000,
        gastoFijoMensual: 0,
        pctExcedenteAAbonoExtra: 0,
        colchonMinimo: 0,
        mesesSimulacion: 3,
      },
    })
    const output = simularEscenario(scenario)
    expect(output.meses.every((m) => m.abonoExtraTotal === 0)).toBe(true)
  })

  it('applies zero extra paydown when colchonMinimo exceeds available cash every month', () => {
    const scenario = buildScenario({
      debts: [{ id: 'd1', nombre: 'Deuda', saldoInicial: 1000000, tasaEA: 0.2, tipo: 'cuota_fija', cuotaMensual: 100000 }],
      settings: {
        cajaInicial: 500000,
        gastoFijoMensual: 0,
        pctExcedenteAAbonoExtra: 100,
        colchonMinimo: 100000000, // unreachable
        mesesSimulacion: 3,
      },
    })
    const output = simularEscenario(scenario)
    expect(output.meses.every((m) => m.abonoExtraTotal === 0)).toBe(true)
  })

  it('cascades leftover pool from the highest-rate debt to the next-highest in the same month', () => {
    const scenario = buildScenario({
      debts: [
        { id: 'low', nombre: 'Tasa baja', saldoInicial: 2000000, tasaEA: 0.1, tipo: 'cuota_fija', cuotaMensual: 0 },
        { id: 'high', nombre: 'Tasa alta', saldoInicial: 100000, tasaEA: 0.5, tipo: 'cuota_fija', cuotaMensual: 0 },
      ],
      settings: {
        cajaInicial: 5000000,
        gastoFijoMensual: 0,
        pctExcedenteAAbonoExtra: 100,
        colchonMinimo: 0,
        mesesSimulacion: 1,
      },
    })
    const output = simularEscenario(scenario)
    const high = output.meses[0].deudas.find((d) => d.debtId === 'high')!
    const low = output.meses[0].deudas.find((d) => d.debtId === 'low')!
    expect(high.saldoFinal).toBe(0)
    expect(high.pagadaEsteMes).toBe(true)
    expect(low.abonoExtra).toBeGreaterThan(0) // leftover cascaded into the lower-rate debt
  })
})

describe('simularEscenario — all debts paid off before the simulation ends', () => {
  it('lands the unused avalanche pool in cash instead of losing it, and does not re-fire milestones', () => {
    const scenario = buildScenario({
      debts: [{ id: 'd1', nombre: 'Deuda chica', saldoInicial: 50000, tasaEA: 0.2, tipo: 'cuota_fija', cuotaMensual: 10000 }],
      settings: {
        cajaInicial: 2000000,
        gastoFijoMensual: 0,
        pctExcedenteAAbonoExtra: 100,
        colchonMinimo: 0,
        mesesSimulacion: 5,
      },
    })
    const output = simularEscenario(scenario)

    const milestoneMonths = output.hitos.filter((h) => h.tipo === 'deuda_pagada')
    expect(milestoneMonths).toHaveLength(1) // fires exactly once, not every subsequent zero-balance month

    const paidMonthIndex = output.meses.findIndex((m) => m.deudaTotalFinal === 0)
    expect(paidMonthIndex).toBeGreaterThan(-1)
    const afterPaidOff = output.meses[paidMonthIndex + 1]
    expect(afterPaidOff.abonoExtraTotal).toBe(0) // no debt left to receive the pool
    expect(Number.isFinite(afterPaidOff.cajaFinal)).toBe(true)
    // with no income and the debt gone, cash is simply held steady month to month (not lost to a void)
    expect(afterPaidOff.cajaFinal).toBeCloseTo(output.meses[paidMonthIndex].cajaFinal, 6)
  })
})

describe('simularEscenario — JSON export/import round trip', () => {
  it('reproduces identical simulation output after a JSON round trip', () => {
    const scenario = buildScenario({
      incomeSources: [{ id: 'e1', nombre: 'Yo', incrementos: [{ id: 'i1', mesInicio: 1, monto: 1000000 }] }],
      debts: [{ id: 'd1', nombre: 'Deuda', saldoInicial: 500000, tasaEA: 0.3, tipo: 'revolvente' }],
      plannedEvents: [{ id: 'ev1', nombre: 'Compra', tipo: 'gasto', monto: 300000, mes: 2, cuotas: 2 }],
      emergencyFund: { aporteMensual: 20000, tope: 200000, imprevistos: [{ id: 'imp1', nombre: 'X', monto: 50000, mes: 3 }] },
      settings: { cajaInicial: 100000, gastoFijoMensual: 400000, pctExcedenteAAbonoExtra: 30, colchonMinimo: 50000, mesesSimulacion: 6 },
    })
    const original = simularEscenario(scenario)
    const roundTripped: Scenario = JSON.parse(JSON.stringify(scenario))
    const after = simularEscenario(roundTripped)
    expect(after).toEqual(original)
  })
})
