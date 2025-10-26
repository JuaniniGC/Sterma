class Community {
  final String id;
  final String name;
  final String description;
  final String cif;
  final Localization localization;
  final CommunityLeaderInfo communityLeaderInfo;

  Community({
    required this.id,
    required this.name,
    required this.description,
    required this.cif,
    required this.localization,
    required this.communityLeaderInfo,
  });

  factory Community.fromJson(Map<String, dynamic> json) {
    return Community(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      cif: json['cif'] ?? '',
      localization: Localization.fromJson(json['localization'] ?? {}),
      communityLeaderInfo: CommunityLeaderInfo.fromJson(
        json['communityLeaderInfo'] ?? {},
      ),
    );
  }
}

class Localization {
  final String street;
  final String city;
  final String postalCode;

  Localization({
    required this.street,
    required this.city,
    required this.postalCode,
  });

  factory Localization.fromJson(Map<String, dynamic> json) {
    return Localization(
      street: json['street'] ?? '',
      city: json['city'] ?? '',
      postalCode: json['postalCode'] ?? '',
    );
  }

  String get fullAddress {
    final parts = [street, city, postalCode];
    return parts.where((part) => part.isNotEmpty).join(', ');
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
      communityLeaderTelephone: json['communityLeaderTelephone'] ?? '',
      communityLeaderNote: json['communityLeaderNote'] ?? '',
    );
  }
}
