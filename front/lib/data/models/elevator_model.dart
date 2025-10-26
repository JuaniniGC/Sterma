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

class Community {
  final String id;
  final String name;
  final String description;
  final Localization localization;
  final CommunityLeaderInfo communityLeaderInfo;
  final String cif;

  Community({
    required this.id,
    required this.name,
    required this.description,
    required this.localization,
    required this.communityLeaderInfo,
    required this.cif,
  });

  factory Community.fromJson(Map<String, dynamic> json) {
    return Community(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      localization: Localization.fromJson(json['localization'] ?? {}),
      communityLeaderInfo: CommunityLeaderInfo.fromJson(
        json['communityLeaderInfo'] ?? {},
      ),
      cif: json['cif'] ?? '',
    );
  }
}

class Localization {
  final String city;
  final String street;
  final String postalCode;

  Localization({
    required this.city,
    required this.street,
    required this.postalCode,
  });

  factory Localization.fromJson(Map<String, dynamic> json) {
    return Localization(
      city: json['city'] ?? '',
      street: json['street'] ?? '',
      postalCode: json['postalCode'] ?? '',
    );
  }

  String get fullAddress {
    return "$street, $city ($postalCode)";
  }
}

class CommunityLeaderInfo {
  final String communityLeaderName;
  final String communityLeaderTelephone;
  final String communityLeaderNote;

  CommunityLeaderInfo({
    required this.communityLeaderName,
    required this.communityLeaderTelephone,
    required this.communityLeaderNote,
  });

  factory CommunityLeaderInfo.fromJson(Map<String, dynamic> json) {
    return CommunityLeaderInfo(
      communityLeaderName: json['communityLeaderName'] ?? '',
      communityLeaderTelephone:
          json['communityLeaderTelephone']?.toString() ?? '',
      communityLeaderNote: json['communityLeaderNote'] ?? '',
    );
  }
}
