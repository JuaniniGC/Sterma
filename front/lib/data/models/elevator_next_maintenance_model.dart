import 'package:front/data/models/elevator_model.dart';
import 'package:front/data/models/next_maintenance_model.dart';

class ElevatorNextMaintenance {
  final Elevator elevator;
  final NextMaintenanceModel nextMaintenanceResponse;

  ElevatorNextMaintenance({
    required this.elevator,
    required this.nextMaintenanceResponse,
  });

  factory ElevatorNextMaintenance.fromJson(Map<String, dynamic> json) {
    return ElevatorNextMaintenance(
      elevator: Elevator.fromJson(json['elevator']),
      nextMaintenanceResponse: NextMaintenanceModel.fromJson(
        json['nextMaintenanceResponse'],
      ),
    );
  }
}
