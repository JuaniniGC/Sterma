import 'community_model.dart';

class Elevator {
  final String id;
  final String rae;
  final int installationYear;
  final Community community;

  Elevator({
    required this.id,
    required this.rae,
    required this.installationYear,
    required this.community,
  });

  factory Elevator.fromJson(Map<String, dynamic> json) {
    return Elevator(
      id: json['id']?.toString() ?? '',
      rae: json['rae'] ?? '',
      installationYear: json['instalationYear'] ?? 0,
      community: Community.fromJson(json['community'] ?? {}),
    );
  }
}
