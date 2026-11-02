// Se puede sobrescribir al compilar: --dart-define=API_BASE_URL=http://192.168.1.10:8080
// Por defecto apunta al host desde el emulador de Android.
const String apiBaseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://10.0.2.2:8080',
);
