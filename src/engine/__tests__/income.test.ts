import { describe, expect, it } from 'vitest'
import { calcularIngresoMes, montoVigente } from '../income'
import type { IncomeSource } from '@/types/scenario'

describe('montoVigente', () => {
  it('returns 0 before any increase applies', () => {
    expect(montoVigente([{ id: '1', mesInicio: 3, monto: 1000000 }], 1)).toBe(0)
  })

  it('returns the most recent applicable increase', () => {
    const incrementos = [
      { id: '1', mesInicio: 1, monto: 1000000 },
      { id: '2', mesInicio: 6, monto: 1200000 },
    ]
    expect(montoVigente(incrementos, 3)).toBe(1000000)
    expect(montoVigente(incrementos, 6)).toBe(1200000)
    expect(montoVigente(incrementos, 12)).toBe(1200000)
  })

  it('resolves correctly when increases are entered out of chronological order', () => {
    const incrementos = [
      { id: '2', mesInicio: 6, monto: 1200000 },
      { id: '3', mesInicio: 1, monto: 1000000 },
      { id: '1', mesInicio: 10, monto: 1500000 },
    ]
    expect(montoVigente(incrementos, 1)).toBe(1000000)
    expect(montoVigente(incrementos, 6)).toBe(1200000)
    expect(montoVigente(incrementos, 10)).toBe(1500000)
    expect(montoVigente(incrementos, 100)).toBe(1500000)
  })
})

describe('calcularIngresoMes', () => {
  it('returns 0 for zero income sources', () => {
    expect(calcularIngresoMes([], 1)).toBe(0)
  })

  it('sums across multiple earners, some not yet active', () => {
    const fuentes: IncomeSource[] = [
      { id: 'a', nombre: 'Yo', incrementos: [{ id: '1', mesInicio: 1, monto: 1000000 }] },
      { id: 'b', nombre: 'Pareja', incrementos: [{ id: '2', mesInicio: 8, monto: 800000 }] },
    ]
    expect(calcularIngresoMes(fuentes, 1)).toBe(1000000)
    expect(calcularIngresoMes(fuentes, 8)).toBe(1800000)
  })
})
