import { describe, expect, it } from 'vitest'
import { procesarFondoImprevistos } from '../emergencyFund'

describe('procesarFondoImprevistos', () => {
  it('contributes up to the monthly amount when far from the cap', () => {
    const resultado = procesarFondoImprevistos(0, { aporteMensual: 100000, tope: 1000000 }, [])
    expect(resultado.aporte).toBe(100000)
    expect(resultado.acumuladoFinal).toBe(100000)
    expect(resultado.faltante).toBe(0)
  })

  it('caps the contribution at tope and stops contributing once reached', () => {
    const resultado = procesarFondoImprevistos(950000, { aporteMensual: 100000, tope: 1000000 }, [])
    expect(resultado.aporte).toBe(50000)
    expect(resultado.acumuladoFinal).toBe(1000000)

    const yaEnTope = procesarFondoImprevistos(1000000, { aporteMensual: 100000, tope: 1000000 }, [])
    expect(yaEnTope.aporte).toBe(0)
  })

  it('pays multiple imprevistos in the same month from the fund before drawing a shortfall', () => {
    const resultado = procesarFondoImprevistos(
      200000,
      { aporteMensual: 0, tope: 1000000 },
      [
        { id: '1', nombre: 'Llanta', monto: 150000, mes: 5 },
        { id: '2', nombre: 'Dentista', monto: 100000, mes: 5 },
      ],
    )
    expect(resultado.pagadoDelFondo).toBe(200000)
    expect(resultado.faltante).toBe(50000)
    expect(resultado.acumuladoFinal).toBe(0)
  })

  it('resumes contributing (up to tope) the month after a withdrawal drops the balance below tope', () => {
    const conRetiro = procesarFondoImprevistos(
      1000000,
      { aporteMensual: 50000, tope: 1000000 },
      [{ id: '1', nombre: 'Imprevisto', monto: 400000, mes: 5 }],
    )
    expect(conRetiro.aporte).toBe(0) // still at tope when contribution is credited, before the withdrawal
    expect(conRetiro.acumuladoFinal).toBe(600000)

    const mesSiguiente = procesarFondoImprevistos(600000, { aporteMensual: 50000, tope: 1000000 }, [])
    expect(mesSiguiente.aporte).toBe(50000)
    expect(mesSiguiente.acumuladoFinal).toBe(650000)
  })
})
