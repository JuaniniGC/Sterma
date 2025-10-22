import 'package:flutter_secure_storage/flutter_secure_storage.dart';

Future<String?> getToken() async {
  const storage = FlutterSecureStorage();
  return await storage.read(key: 'token');
}
