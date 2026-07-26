import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

import type {
  Debt,
  EmergencyFund,
  Imprevisto,
  IncomeSource,
  PlannedEvent,
  SalaryIncrease,
  Scenario,
  Settings,
} from '@/types/scenario'
import { crearEscenarioVacio, simularEscenario } from '@/engine'
import { crearEscenarioEjemplo } from '@/data/exampleScenario'
import { readLocalStorage, writeLocalStorage } from '@/composables/useLocalStorage'
import { exportRowsToCsv } from '@/composables/useCsvExport'
import { formatCOP } from '@/composables/useCurrency'

const AUTOSAVE_KEY = 'cfs:scenario'
const LIBRARY_KEY = 'cfs:library'
const AUTOSAVE_DEBOUNCE_MS = 400

function debounce<T extends (...args: never[]) => void>(fn: T, ms: number): T {
  let handle: ReturnType<typeof setTimeout> | undefined
  return ((...args: Parameters<T>) => {
    if (handle) clearTimeout(handle)
    handle = setTimeout(() => fn(...args), ms)
  }) as T
}

function nuevoId(): string {
  return crypto.randomUUID()
}

function tocar(scenario: Scenario) {
  scenario.updatedAt = new Date().toISOString()
}

/** Minimal runtime shape check before trusting an imported/parsed scenario. */
function esScenarioValido(value: unknown): value is Scenario {
  if (typeof value !== 'object' || value === null) return false
  const s = value as Record<string, unknown>
  return (
    typeof s.id === 'string' &&
    typeof s.nombre === 'string' &&
    Array.isArray(s.incomeSources) &&
    Array.isArray(s.debts) &&
    Array.isArray(s.plannedEvents) &&
    typeof s.emergencyFund === 'object' &&
    s.emergencyFund !== null &&
    typeof s.settings === 'object' &&
    s.settings !== null
  )
}

export const useScenarioStore = defineStore('scenario', () => {
  const scenario = ref<Scenario>(readLocalStorage(AUTOSAVE_KEY, crearEscenarioVacio()))
  const library = ref<Record<string, Scenario>>(readLocalStorage(LIBRARY_KEY, {}))
  const activeLibraryId = ref<string | null>(null)
  const importError = ref<string | null>(null)

  const simulation = computed(() => simularEscenario(scenario.value))
  const resumen = computed(() => simulation.value.resumen)

  const persistAutosave = debounce((value: Scenario) => {
    writeLocalStorage(AUTOSAVE_KEY, value)
  }, AUTOSAVE_DEBOUNCE_MS)

  watch(scenario, (value) => persistAutosave(value), { deep: true })

  function persistLibrary() {
    writeLocalStorage(LIBRARY_KEY, library.value)
  }

  // --- Income sources -------------------------------------------------

  function addIncomeSource(nombre: string) {
    scenario.value.incomeSources.push({ id: nuevoId(), nombre, incrementos: [] })
    tocar(scenario.value)
  }

  function updateIncomeSource(id: string, patch: Partial<Pick<IncomeSource, 'nombre'>>) {
    const fuente = scenario.value.incomeSources.find((f) => f.id === id)
    if (fuente) Object.assign(fuente, patch)
    tocar(scenario.value)
  }

  function removeIncomeSource(id: string) {
    scenario.value.incomeSources = scenario.value.incomeSources.filter((f) => f.id !== id)
    tocar(scenario.value)
  }

  function addIncrease(sourceId: string, input: Omit<SalaryIncrease, 'id'>) {
    const fuente = scenario.value.incomeSources.find((f) => f.id === sourceId)
    if (fuente) fuente.incrementos.push({ id: nuevoId(), ...input })
    tocar(scenario.value)
  }

  function updateIncrease(sourceId: string, incId: string, patch: Partial<Omit<SalaryIncrease, 'id'>>) {
    const fuente = scenario.value.incomeSources.find((f) => f.id === sourceId)
    const incremento = fuente?.incrementos.find((i) => i.id === incId)
    if (incremento) Object.assign(incremento, patch)
    tocar(scenario.value)
  }

  function removeIncrease(sourceId: string, incId: string) {
    const fuente = scenario.value.incomeSources.find((f) => f.id === sourceId)
    if (fuente) fuente.incrementos = fuente.incrementos.filter((i) => i.id !== incId)
    tocar(scenario.value)
  }

  // --- Debts ------------------------------------------------------------

  function addDebt(input: Omit<Debt, 'id'>) {
    scenario.value.debts.push({ id: nuevoId(), ...input })
    tocar(scenario.value)
  }

  function updateDebt(id: string, patch: Partial<Omit<Debt, 'id'>>) {
    const deuda = scenario.value.debts.find((d) => d.id === id)
    if (deuda) Object.assign(deuda, patch)
    tocar(scenario.value)
  }

  function removeDebt(id: string) {
    scenario.value.debts = scenario.value.debts.filter((d) => d.id !== id)
    tocar(scenario.value)
  }

  // --- Planned events -----------------------------------------------------

  function addPlannedEvent(input: Omit<PlannedEvent, 'id'>) {
    scenario.value.plannedEvents.push({ id: nuevoId(), ...input })
    tocar(scenario.value)
  }

  function updatePlannedEvent(id: string, patch: Partial<Omit<PlannedEvent, 'id'>>) {
    const evento = scenario.value.plannedEvents.find((e) => e.id === id)
    if (evento) Object.assign(evento, patch)
    tocar(scenario.value)
  }

  function removePlannedEvent(id: string) {
    scenario.value.plannedEvents = scenario.value.plannedEvents.filter((e) => e.id !== id)
    tocar(scenario.value)
  }

  // --- Emergency fund / imprevistos --------------------------------------

  function updateEmergencyFundSettings(patch: Partial<Pick<EmergencyFund, 'aporteMensual' | 'tope'>>) {
    Object.assign(scenario.value.emergencyFund, patch)
    tocar(scenario.value)
  }

  function addImprevisto(input: Omit<Imprevisto, 'id'>) {
    scenario.value.emergencyFund.imprevistos.push({ id: nuevoId(), ...input })
    tocar(scenario.value)
  }

  function updateImprevisto(id: string, patch: Partial<Omit<Imprevisto, 'id'>>) {
    const imprevisto = scenario.value.emergencyFund.imprevistos.find((i) => i.id === id)
    if (imprevisto) Object.assign(imprevisto, patch)
    tocar(scenario.value)
  }

  function removeImprevisto(id: string) {
    scenario.value.emergencyFund.imprevistos = scenario.value.emergencyFund.imprevistos.filter(
      (i) => i.id !== id,
    )
    tocar(scenario.value)
  }

  // --- Settings -----------------------------------------------------------

  function updateSettings(patch: Partial<Settings>) {
    Object.assign(scenario.value.settings, patch)
    tocar(scenario.value)
  }

  function updateScenarioName(nombre: string) {
    scenario.value.nombre = nombre
    tocar(scenario.value)
  }

  // --- Whole-scenario actions ----------------------------------------------

  function resetToEmpty() {
    scenario.value = crearEscenarioVacio()
    activeLibraryId.value = null
  }

  function loadExample() {
    scenario.value = crearEscenarioEjemplo()
    activeLibraryId.value = null
  }

  function saveScenarioAs(nombre: string) {
    const copia: Scenario = JSON.parse(JSON.stringify(scenario.value))
    copia.id = copia.id && !library.value[copia.id] ? copia.id : nuevoId()
    copia.nombre = nombre
    copia.updatedAt = new Date().toISOString()
    library.value[copia.id] = copia
    activeLibraryId.value = copia.id
    persistLibrary()
    return copia.id
  }

  function loadScenarioFromLibrary(id: string) {
    const guardado = library.value[id]
    if (!guardado) return
    scenario.value = JSON.parse(JSON.stringify(guardado))
    activeLibraryId.value = id
  }

  function deleteFromLibrary(id: string) {
    delete library.value[id]
    if (activeLibraryId.value === id) activeLibraryId.value = null
    persistLibrary()
  }

  function duplicateInLibrary(id: string) {
    const original = library.value[id]
    if (!original) return
    const copia: Scenario = JSON.parse(JSON.stringify(original))
    copia.id = nuevoId()
    copia.nombre = `${original.nombre} (copia)`
    copia.updatedAt = new Date().toISOString()
    library.value[copia.id] = copia
    persistLibrary()
    return copia.id
  }

  function exportScenarioJSON(): string {
    return JSON.stringify(scenario.value, null, 2)
  }

  function importScenarioJSON(json: string): boolean {
    try {
      const parsed = JSON.parse(json)
      if (!esScenarioValido(parsed)) {
        importError.value = 'El archivo no tiene la estructura esperada de un escenario.'
        return false
      }
      scenario.value = parsed
      activeLibraryId.value = null
      importError.value = null
      return true
    } catch {
      importError.value = 'No se pudo leer el archivo. ¿Es un JSON válido?'
      return false
    }
  }

  function exportMonthlyCSV() {
    exportRowsToCsv(
      `flujo-de-caja-${scenario.value.nombre.replace(/\s+/g, '-').toLowerCase()}.csv`,
      simulation.value.meses,
      [
        { header: 'Mes', value: (m) => m.mes },
        { header: 'Ingreso', value: (m) => m.ingresoTotal },
        { header: 'Gasto fijo', value: (m) => m.gastoFijo },
        { header: 'Aporte fondo', value: (m) => m.aporteFondo },
        { header: 'Fondo acumulado', value: (m) => m.fondoAcumulado },
        { header: 'Pago deudas', value: (m) => m.pagoDeudas },
        { header: 'Abono extra', value: (m) => m.abonoExtraTotal },
        { header: 'Eventos', value: (m) => m.eventos.map((e) => e.nombre).join(' | ') },
        { header: 'Flujo neto', value: (m) => m.flujoNeto },
        { header: 'Caja final', value: (m) => formatCOP(m.cajaFinal) },
        { header: 'Deuda total', value: (m) => formatCOP(m.deudaTotalFinal) },
      ],
    )
  }

  return {
    scenario,
    library,
    activeLibraryId,
    importError,
    simulation,
    resumen,
    addIncomeSource,
    updateIncomeSource,
    removeIncomeSource,
    addIncrease,
    updateIncrease,
    removeIncrease,
    addDebt,
    updateDebt,
    removeDebt,
    addPlannedEvent,
    updatePlannedEvent,
    removePlannedEvent,
    updateEmergencyFundSettings,
    addImprevisto,
    updateImprevisto,
    removeImprevisto,
    updateSettings,
    updateScenarioName,
    resetToEmpty,
    loadExample,
    saveScenarioAs,
    loadScenarioFromLibrary,
    deleteFromLibrary,
    duplicateInLibrary,
    exportScenarioJSON,
    importScenarioJSON,
    exportMonthlyCSV,
  }
})
