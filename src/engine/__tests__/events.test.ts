import { describe, expect, it } from 'vitest'
import { eventosDelMes } from '../events'
import type { PlannedEvent } from '@/types/scenario'

describe('eventosDelMes', () => {
  it('returns nothing for a month with no events', () => {
    const resultado = eventosDelMes([], 1)
    expect(resultado.registros).toHaveLength(0)
    expect(resultado.ingresoEventos).toBe(0)
    expect(resultado.gastoEventos).toBe(0)
  })

  it('splits an installment event evenly across its months', () => {
    const eventos: PlannedEvent[] = [
      { id: '1', nombre: 'Moto', tipo: 'gasto', monto: 3000000, mes: 5, cuotas: 3 },
    ]
    expect(eventosDelMes(eventos, 4).registros).toHaveLength(0)
    expect(eventosDelMes(eventos, 5).registros[0].monto).toBeCloseTo(1000000, 6)
    expect(eventosDelMes(eventos, 7).registros[0].monto).toBeCloseTo(1000000, 6)
    expect(eventosDelMes(eventos, 8).registros).toHaveLength(0)
  })

  it('handles several simultaneous events in the same month, income and expense', () => {
    const eventos: PlannedEvent[] = [
      { id: '1', nombre: 'Moto', tipo: 'gasto', monto: 500000, mes: 3 },
      { id: '2', nombre: 'Venta carro', tipo: 'ingreso', monto: 2000000, mes: 3 },
      { id: '3', nombre: 'Viaje', tipo: 'gasto', monto: 300000, mes: 3 },
    ]
    const resultado = eventosDelMes(eventos, 3)
    expect(resultado.registros).toHaveLength(3)
    expect(resultado.gastoEventos).toBe(800000)
    expect(resultado.ingresoEventos).toBe(2000000)
  })
})
