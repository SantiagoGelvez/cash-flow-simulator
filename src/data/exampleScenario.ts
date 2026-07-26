import type { Scenario } from '@/types/scenario'

/**
 * Neutral, generic example scenario — not any particular person's real
 * numbers — used to let a first-time user see the app populated and
 * understand how the pieces fit together.
 */
export function crearEscenarioEjemplo(): Scenario {
  const now = new Date().toISOString()

  return {
    id: crypto.randomUUID(),
    nombre: 'Ejemplo',
    createdAt: now,
    updatedAt: now,
    incomeSources: [
      {
        id: crypto.randomUUID(),
        nombre: 'Ingreso 1',
        incrementos: [{ id: crypto.randomUUID(), mesInicio: 1, monto: 3200000 }],
      },
      {
        id: crypto.randomUUID(),
        nombre: 'Ingreso 2',
        incrementos: [
          { id: crypto.randomUUID(), mesInicio: 1, monto: 1800000 },
          { id: crypto.randomUUID(), mesInicio: 9, monto: 2200000 },
        ],
      },
    ],
    debts: [
      {
        id: crypto.randomUUID(),
        nombre: 'Crédito vehicular',
        saldoInicial: 25000000,
        tasaEA: 0.18,
        tipo: 'cuota_fija',
        cuotaMensual: 900000,
      },
      {
        id: crypto.randomUUID(),
        nombre: 'Tarjeta de crédito',
        saldoInicial: 4000000,
        tasaEA: 0.32,
        tipo: 'revolvente',
        pisoMinimo: 30000,
      },
    ],
    plannedEvents: [
      {
        id: crypto.randomUUID(),
        nombre: 'Electrodoméstico nuevo',
        tipo: 'gasto',
        monto: 1500000,
        mes: 5,
        cuotas: 3,
      },
      {
        id: crypto.randomUUID(),
        nombre: 'Prima de vacaciones',
        tipo: 'ingreso',
        monto: 1200000,
        mes: 12,
      },
    ],
    emergencyFund: {
      aporteMensual: 150000,
      tope: 3000000,
      imprevistos: [
        { id: crypto.randomUUID(), nombre: 'Reparación del carro', monto: 800000, mes: 7 },
      ],
    },
    settings: {
      cajaInicial: 2000000,
      gastoFijoMensual: 2800000,
      pctExcedenteAAbonoExtra: 40,
      colchonMinimo: 1500000,
      mesesSimulacion: 24,
    },
  }
}
