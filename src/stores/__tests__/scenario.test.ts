// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useScenarioStore } from '../scenario'

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('useScenarioStore', () => {
  it('starts from an empty scenario and simulation recomputes after a mutation', () => {
    const store = useScenarioStore()
    expect(store.scenario.incomeSources).toHaveLength(0)
    expect(store.simulation.meses[0]?.ingresoTotal ?? 0).toBe(0)

    store.updateSettings({ mesesSimulacion: 3 })
    store.addIncomeSource('Yo')
    const sourceId = store.scenario.incomeSources[0].id
    store.addIncrease(sourceId, { mesInicio: 1, monto: 1000000 })

    expect(store.simulation.meses).toHaveLength(3)
    expect(store.simulation.meses[0].ingresoTotal).toBe(1000000)
  })

  it('saves and loads named scenarios from the library independently of the working scenario', () => {
    const store = useScenarioStore()
    store.updateSettings({ cajaInicial: 500000 })
    const id = store.saveScenarioAs('Plan A')

    store.resetToEmpty()
    expect(store.scenario.settings.cajaInicial).toBe(0)

    store.loadScenarioFromLibrary(id)
    expect(store.scenario.settings.cajaInicial).toBe(500000)
    expect(store.scenario.nombre).toBe('Plan A')
  })

  it('rejects malformed JSON on import without corrupting the current scenario', () => {
    const store = useScenarioStore()
    store.updateSettings({ cajaInicial: 42 })
    const ok = store.importScenarioJSON('{ not valid json')
    expect(ok).toBe(false)
    expect(store.importError).toBeTruthy()
    expect(store.scenario.settings.cajaInicial).toBe(42)
  })
})
