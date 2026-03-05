class CommonMistake {
  final int id;
  final String identificator;
  final String description;

  CommonMistake({
    required this.id,
    required this.identificator,
    required this.description,
  });

  factory CommonMistake.fromJson(Map<String, dynamic> json) {
    return CommonMistake(
      id: json['id'],
      identificator: json['identificator'],
      description: json['description'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'identificator': identificator,
      'description': description,
    };
  }
}
