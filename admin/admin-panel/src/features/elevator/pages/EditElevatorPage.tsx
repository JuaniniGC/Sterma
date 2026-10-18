import { ElevatorActionPage } from '../components/ElevatorActionPage'
import { ElevatorForm } from '../components/ElevatorForm'
import { useUpdateElevator } from '../hooks/useUpdateElevator'
import { elevatorToFormValues } from '../types'

export function EditElevatorPage() {
  const updateElevator = useUpdateElevator()

  return (
    <ElevatorActionPage title="Editar ascensor">
      {(elevator, leave) => (
        <ElevatorForm
          defaultValues={elevatorToFormValues(elevator)}
          defaultCommunity={elevator.community}
          onSubmit={(body) => updateElevator.mutate({ id: elevator.id, body }, { onSuccess: leave })}
          onCancel={leave}
          submitLabel="Guardar cambios"
          isPending={updateElevator.isPending}
          error={updateElevator.error}
        />
      )}
    </ElevatorActionPage>
  )
}
