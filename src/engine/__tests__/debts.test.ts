import { describe, expect, it } from 'vitest'
import {
  aplicarAbonoExtra,
  aplicarInteresYPagoMinimo,
  calcularPagoMinimo,
  tasaMensualEfectiva,
} from '../debts'
import type { Debt } from '@/types/scenario'

describe('tasaMensualEfectiva', () => {
  it('derives the monthly effective rate from an annual effective rate', () => {
    const tasaMensual = tasaMensualEfectiva(0.24)
    expect(tasaMensual).toBeCloseTo(Math.pow(1.24, 1 / 12) - 1, 10)
    expect(tasaMensual).toBeGreaterThan(0)
  })
})

describe('calcularPagoMinimo — revolvente', () => {
  it('uses the greater of 3% of balance and the floor, capped at the balance', () => {
    const deuda: Debt = { id: 'd1', nombre: 'TC', saldoInicial: 0, tasaEA: 0.3, tipo: 'revolvente', pisoMinimo: 30000 }
    expect(calcularPagoMinimo(deuda, 1000000)).toBeCloseTo(30000, 5) // floor wins over 3%=30000 (tie)
    expect(calcularPagoMinimo(deuda, 2000000)).toBeCloseTo(60000, 5) // 3% wins
    expect(calcularPagoMinimo(deuda, 10000)).toBe(10000) // capped at balance
  })
})

describe('aplicarInteresYPagoMinimo', () => {
  it('never lets a growing installment be clamped: balance can increase when cuotaMensual < interest', () => {
    const deuda: Debt = {
      id: 'd1',
      nombre: 'Deuda lenta',
      saldoInicial: 0,
      tasaEA: 0.6, // very high rate so monthly interest exceeds the fixed installment
      tipo: 'cuota_fija',
      cuotaMensual: 1000,
    }
    const estado = aplicarInteresYPagoMinimo(deuda, 1000000)
    expect(estado.saldoFinal).toBeGreaterThan(1000000)
  })

  it('fixed installment never overpays past the remaining balance', () => {
    const deuda: Debt = {
      id: 'd1',
      nombre: 'Casi pagada',
      saldoInicial: 0,
      tasaEA: 0.24,
      tipo: 'cuota_fija',
      cuotaMensual: 500000,
    }
    const estado = aplicarInteresYPagoMinimo(deuda, 10000)
    expect(estado.pagoMinimo).toBeCloseTo(estado.saldoInicial + estado.interes, 6)
    expect(estado.saldoFinal).toBeCloseTo(0, 6)
  })
})

describe('aplicarAbonoExtra', () => {
  it('applies the pool in strict descending-tasaEA order, cascading leftover to the next debt', () => {
    const deudas = [
      { debtId: 'low', nombre: 'Baja tasa', saldoInicial: 0, interes: 0, pagoMinimo: 0, abonoExtra: 0, saldoFinal: 500000, pagadaEsteMes: false },
      { debtId: 'high', nombre: 'Alta tasa', saldoInicial: 0, interes: 0, pagoMinimo: 0, abonoExtra: 0, saldoFinal: 100000, pagadaEsteMes: false },
    ]
    const tasas = { low: 0.12, high: 0.45 }
    const { deudas: resultado, poolAplicado } = aplicarAbonoExtra(deudas, tasas, 300000)

    const high = resultado.find((d) => d.debtId === 'high')!
    const low = resultado.find((d) => d.debtId === 'low')!
    expect(high.saldoFinal).toBe(0) // fully paid first (highest rate)
    expect(low.saldoFinal).toBe(500000 - 200000) // leftover 200000 cascades to the low-rate debt
    expect(poolAplicado).toBe(300000)
  })

  it('reports poolAplicado less than the requested pool once all debts are paid off (leftover stays in cash)', () => {
    const deudas = [
      { debtId: 'a', nombre: 'A', saldoInicial: 0, interes: 0, pagoMinimo: 0, abonoExtra: 0, saldoFinal: 50000, pagadaEsteMes: false },
    ]
    const { poolAplicado, deudas: resultado } = aplicarAbonoExtra(deudas, { a: 0.2 }, 200000)
    expect(poolAplicado).toBe(50000)
    expect(resultado[0].saldoFinal).toBe(0)
  })

  it('applies nothing when there is no pool or no debts', () => {
    expect(aplicarAbonoExtra([], {}, 100000).poolAplicado).toBe(0)
    const deudas = [
      { debtId: 'a', nombre: 'A', saldoInicial: 0, interes: 0, pagoMinimo: 0, abonoExtra: 0, saldoFinal: 50000, pagadaEsteMes: false },
    ]
    expect(aplicarAbonoExtra(deudas, { a: 0.2 }, 0).poolAplicado).toBe(0)
  })
})
