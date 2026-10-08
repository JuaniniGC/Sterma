import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { getIncidentReportsByElevator, getMaintenanceReportsByElevator } from '@/api/report.api'
import type { ElevatorReportEntry } from '../types'

export const reportKeys = {
  all: ['reports'] as const,
  incidentsByElevator: (elevatorId: number) => [...reportKeys.all, 'incident', 'elevator', elevatorId] as const,
  maintenanceByElevator: (elevatorId: number) =>
    [...reportKeys.all, 'maintenance', 'elevator', elevatorId] as const,
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
      ...incidents.data.map((report) => ({
        kind: 'incident' as const,
        key: `incident-${report.id}`,
        report,
      })),
      // El backend devuelve `id: null` en mantenimientos: la clave usa la posición
      ...maintenance.data.map((report, index) => ({
        kind: 'maintenance' as const,
        key: `maintenance-${report.id ?? `${index}-${report.startDate}`}`,
        report,
      })),
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
