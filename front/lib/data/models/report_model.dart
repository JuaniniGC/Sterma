import 'dart:convert';

class Report {
  final String? id;
  final String type;
  final DateTime startDate;
  final DateTime? endDate;
  final String? commentary;
  final String? elevatorRAE;
  final DateTime? createdAt;
  final String? maintenanceType;

  Report({
    this.id,
    required this.type,
    required this.startDate,
    this.endDate,
    this.commentary,
    this.elevatorRAE,
    this.createdAt,
    this.maintenanceType,
  });

  factory Report.maintenanceFromJson(Map<String, dynamic> json) {
    return Report(
      id: json['id']?.toString(),
      type: 'maintenance',
      startDate: DateTime.parse(json['startDate']),
      endDate: json['endDate'] != null ? DateTime.parse(json['endDate']) : null,
      commentary: json['commentary'],
      elevatorRAE: json['elevatorRAE']?.toString(),
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : null,
      maintenanceType: json['maintenanceType'],
    );
  }

  factory Report.incidentFromJson(Map<String, dynamic> json) {
    return Report(
      id: json['id']?.toString(),
      type: 'incident',
      startDate: DateTime.parse(json['startDate']),
      endDate: json['endDate'] != null ? DateTime.parse(json['endDate']) : null,
      commentary: json['commentary'],
      elevatorRAE: json['elevatorRAE']?.toString(),
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : null,
    );
  }

  String get displayType {
    if (type == 'maintenance') {
      return 'Mantenimiento${maintenanceType != null ? ' ($maintenanceTypeDisplay)' : ''}';
    }
    return 'Avería';
  }

  String get maintenanceTypeDisplay {
    switch (maintenanceType) {
      case 'ANNUAL':
        return 'Anual';
      case 'MONTHLY':
        return 'Mensual';
      case 'BIANNUAL':
        return 'Semestral';
      case 'QUARTERLY':
        return 'Trimestral';
      default:
        return maintenanceType ?? 'General';
    }
  }

  String get icon {
    return type == 'maintenance' ? '🔧' : '⚠️';
  }

  Duration? get duration {
    if (endDate != null) {
      return endDate!.difference(startDate);
    }
    return null;
  }

  String get durationDisplay {
    if (duration == null) return 'Sin finalizar';

    final dur = duration!;
    if (dur.inHours > 0) {
      return '${dur.inHours}h ${dur.inMinutes.remainder(60)}min';
    }
    return '${dur.inMinutes}min';
  }

  bool get isCompleted => endDate != null;
}
