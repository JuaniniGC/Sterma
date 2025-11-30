import 'package:flutter/material.dart';

class NextMaintenanceModel {
  final String maintenanceType;
  final DateTime nextDate;
  final String status;
  final int priority;

  NextMaintenanceModel({
    required this.maintenanceType,
    required this.nextDate,
    required this.status,
    required this.priority,
  });

  factory NextMaintenanceModel.fromJson(Map<String, dynamic> json) {
    return NextMaintenanceModel(
      maintenanceType: json['maintenanceType'],
      nextDate: DateTime.parse(json['nextDate']),
      status: json['status'],
      priority: json['priority'] ?? 4, // Default to GOOD if not provided
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'maintenanceType': maintenanceType,
      'nextDate': nextDate.toIso8601String().split('T')[0], // Solo la fecha
      'status': status,
      'priority': priority,
    };
  }

  String get maintenanceTypeDisplayName {
    switch (maintenanceType) {
      case 'ANNUAL':
        return 'Anual';
      case 'BIANNUAL':
        return 'Semestral';
      case 'MONTHLY':
        return 'Mensual';
      default:
        return maintenanceType;
    }
  }

  String get statusDisplayName {
    switch (status) {
      case 'NEVER_PASS':
        return 'Nunca pasado';
      case 'DANGER':
        return 'Peligro';
      case 'WARNING':
        return 'Advertencia';
      case 'GOOD':
        return 'En buen estado';
      default:
        return status;
    }
  }

  String get statusDescription {
    switch (status) {
      case 'NEVER_PASS':
        return 'Este ascensor nunca ha pasado un mantenimiento';
      case 'DANGER':
        return 'Mantenimiento críticamente atrasado';
      case 'WARNING':
        return 'Mantenimiento próximo a vencer';
      case 'GOOD':
        return 'Mantenimiento al día';
      default:
        return 'Estado desconocido';
    }
  }

  Color get statusColor {
    switch (status) {
      case 'NEVER_PASS':
        return Colors.red;
      case 'DANGER':
        return Colors.red;
      case 'WARNING':
        return Colors.orange;
      case 'GOOD':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }

  IconData get statusIcon {
    switch (status) {
      case 'NEVER_PASS':
        return Icons.error;
      case 'DANGER':
        return Icons.warning;
      case 'WARNING':
        return Icons.info;
      case 'GOOD':
        return Icons.check_circle;
      default:
        return Icons.help;
    }
  }

  String get urgencyLevel {
    switch (priority) {
      case 1:
        return 'Crítico';
      case 2:
        return 'Alto';
      case 3:
        return 'Medio';
      case 4:
        return 'Bajo';
      default:
        return 'Desconocido';
    }
  }

  bool get requiresImmediateAttention {
    return priority <= 2;
  }

  bool get requiresSoonAttention {
    return priority == 3;
  }

  bool get isInGoodState {
    return priority == 4;
  }
}
