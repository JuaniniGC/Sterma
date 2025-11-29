class MaintenanceRule {
  final int id;
  final String name;
  final String description;
  final int orderNum;
  final String maintenanceType;

  MaintenanceRule({
    required this.id,
    required this.name,
    required this.description,
    required this.orderNum,
    required this.maintenanceType,
  });

  factory MaintenanceRule.fromJson(Map<String, dynamic> json) {
    return MaintenanceRule(
      id: json['id'],
      name: json['name'],
      description: json['description'],
      orderNum: json['orderNum'],
      maintenanceType: json['maintenanceType'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'orderNum': orderNum,
      'maintenanceType': maintenanceType,
    };
  }
}
