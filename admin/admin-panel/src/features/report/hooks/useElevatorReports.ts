import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { getIncidentReportsByElevator, getMaintenanceReportsByElevator } from '@/api/report.api'
import type { ElevatorReportEntry, IncidentReport, MaintenanceReport, ReportKind } from '../types'

export const reportKeys = {
  all: ['reports'] as const,
  incidentsByElevator: (elevatorId: number) => [...reportKeys.all, 'incident', 'elevator', elevatorId] as const,
  maintenanceByElevator: (elevatorId: number) =>
    [...reportKeys.all, 'maintenance', 'elevator', elevatorId] as const,
  incidentImages: (incidentId: number) => [...reportKeys.all, 'incident', incidentId, 'images'] as const,
}

const incidentsQuery = (elevatorId: number) =>
  queryOptions({
    queryKey: reportKeys.incidentsByElevator(elevatorId),
    queryFn: () => getIncidentReportsByElevator(elevatorId),
  })

const maintenanceQuery = (elevatorId: number) =>
  queryOptions({
    queryKey: reportKeys.maintenanceByElevator(elevatorId),
    queryFn: () => getMaintenanceReportsByElevator(elevatorId),
  })

const toIncidentEntry = (report: IncidentReport): ElevatorReportEntry => ({
  kind: 'incident',
  key: `incident-${report.id}`,
  report,
})

// Si el backend no envía el `id` del mantenimiento, la clave usa la posición
const toMaintenanceEntry = (report: MaintenanceReport, index: number): ElevatorReportEntry => ({
  kind: 'maintenance',
  key: `maintenance-${report.id ?? `${index}-${report.startDate}`}`,
  report,
})

/**
 * Un informe concreto de un ascensor. El backend no tiene `GET` de un informe por id, así que se busca en la
 * lista del ascensor (la misma query que el historial: si se viene de él, ya está en caché).
 * `entry` es null mientras carga, si falla o si no existe ese informe en el ascensor.
 */
export function useElevatorReport(kind: ReportKind, elevatorId: number, reportId: number) {
  const incidents = useQuery({ ...incidentsQuery(elevatorId), enabled: kind === 'incident' })
  const maintenance = useQuery({ ...maintenanceQuery(elevatorId), enabled: kind === 'maintenance' })
  const query = kind === 'incident' ? incidents : maintenance

  const entry = useMemo<ElevatorReportEntry | null>(() => {
    if (kind === 'incident') {
      const report = incidents.data?.find((r) => r.id === reportId)
      return report ? toIncidentEntry(report) : null
    }
    const index = maintenance.data?.findIndex((r) => r.id === reportId) ?? -1
    return maintenance.data && index >= 0 ? toMaintenanceEntry(maintenance.data[index], index) : null
  }, [kind, reportId, incidents.data, maintenance.data])

  return {
    entry,
    isPending: query.isPending,
    error: query.error,
    retry: () => void query.refetch(),
  }
}

/**
 * Empieza a pedir el historial en cuanto se conoce el id (en paralelo con el detalle del ascensor),
 * para que `useElevatorReports` lo encuentre ya en caché o en curso.
 */
export function usePrefetchElevatorReports(elevatorId: number | null): void {
  const queryClient = useQueryClient()
  useEffect(() => {
    if (elevatorId === null) return
    void queryClient.prefetchQuery(incidentsQuery(elevatorId))
    void queryClient.prefetchQuery(maintenanceQuery(elevatorId))
  }, [queryClient, elevatorId])
}

/**
 * Historial de informes de un ascensor: incidencias y mantenimientos pedidos en paralelo
 * y unidos en una sola lista ordenada por fecha de inicio (más reciente primero).
 */
export function useElevatorReports(elevatorId: number) {
  const incidents = useQuery(incidentsQuery(elevatorId))
  const maintenance = useQuery(maintenanceQuery(elevatorId))

  const entries = useMemo<ElevatorReportEntry[]>(() => {
    if (!incidents.data || !maintenance.data) return []
    const all: ElevatorReportEntry[] = [
      ...incidents.data.map(toIncidentEntry),
      ...maintenance.data.map(toMaintenanceEntry),
    ]
    // LocalDateTime ISO sin zona: el orden de texto coincide con el cronológico
    return all.sort((a, b) => b.report.startDate.localeCompare(a.report.startDate))
  }, [incidents.data, maintenance.data])

  const failed = [incidents, maintenance].filter((query) => query.isError)

  return {
    entries,
    incidentCount: incidents.data?.length ?? 0,
    maintenanceCount: maintenance.data?.length ?? 0,
    isLoading: incidents.isPending || maintenance.isPending,
    isFetching: incidents.isFetching || maintenance.isFetching,
    error: failed[0]?.error ?? null,
    /** Reintenta solo las peticiones que han fallado */
    retry: () => failed.forEach((query) => void query.refetch()),
  }
}
