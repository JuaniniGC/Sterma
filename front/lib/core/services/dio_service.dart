import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class DioService {
  final Dio _dio;
  final FlutterSecureStorage _storage;

  bool _isRedirecting = false;

  static VoidCallback? onTokenExpired;

  DioService() : _dio = Dio(), _storage = const FlutterSecureStorage() {
    _setupDio();
  }

  void _setupDio() {
    _dio.options = BaseOptions(
      baseUrl: 'http://10.0.2.2:8080',
      connectTimeout: const Duration(seconds: 60),
      receiveTimeout: const Duration(seconds: 60),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    );

    _dio.interceptors.add(
      InterceptorsWrapper(onRequest: _onRequest, onError: _onError),
    );
  }

  Future<void> _onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    try {
      final token = await _storage.read(key: 'token');
      if (token != null && token.isNotEmpty) {
        options.headers['Authorization'] = 'Bearer $token';
      }
      handler.next(options);
    } catch (e) {
      handler.next(options);
    }
  }

  Future<void> _onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    // Detectar cuando el token ha expirado (error 401)
    if (_isTokenExpiredError(err) && !_isRedirecting) {
      _isRedirecting = true;

      try {
        print('🔄 Token expirado detectado, redirigiendo al login...');

        // 1. Limpiar el token expirado
        await _storage.delete(key: 'token');

        // 2. Notificar a la app para redirigir al login
        if (onTokenExpired != null) {
          onTokenExpired!();
        } else {
          print('⚠️ onTokenExpired callback no configurado');
        }

        // 3. Rechazar la petición original con un error claro
        handler.reject(
          DioException(
            requestOptions: err.requestOptions,
            error: 'Token expirado - Redirigiendo al login',
            type: DioExceptionType.badResponse,
            response: Response(
              requestOptions: err.requestOptions,
              statusCode: 401,
              statusMessage: 'Token expirado',
            ),
          ),
        );
      } finally {
        _isRedirecting = false;
      }
    } else {
      // Para otros errores, simplemente continuar
      handler.next(err);
    }
  }

  bool _isTokenExpiredError(DioException error) {
    // Detectar error 401 (Unauthorized) que indica token expirado
    return error.response?.statusCode == 401;
  }

  // ========== MÉTODOS PÚBLICOS ==========

  // Método para login
  Future<bool> login(String username, String password) async {
    try {
      final response = await _dio.post(
        '/auth/login',
        data: {'username': username, 'password': password},
      );

      if (response.statusCode == 200) {
        final token = response.data['token'];
        if (token != null && token.isNotEmpty) {
          await _storage.write(key: 'token', value: token);
          return true;
        }
      }
      return false;
    } on DioException catch (e) {
      throw Exception(_getDioErrorMessage(e));
    } catch (e) {
      throw Exception('Error inesperado: $e');
    }
  }

  // Método para logout
  Future<void> logout() async {
    await _storage.delete(key: 'token');
  }

  // Verificar si el usuario está logueado
  Future<bool> isLoggedIn() async {
    final token = await _storage.read(key: 'token');
    return token != null && token.isNotEmpty;
  }

  // Obtener el token actual (útil para debugging)
  Future<String?> getCurrentToken() async {
    return await _storage.read(key: 'token');
  }

  // ========== MÉTODOS HTTP ==========

  Future<Response<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) {
    return _dio.get<T>(
      path,
      queryParameters: queryParameters,
      options: options,
    );
  }

  Future<Response<T>> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) {
    return _dio.post<T>(
      path,
      data: data,
      queryParameters: queryParameters,
      options: options,
    );
  }

  Future<Response<T>> put<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) {
    return _dio.put<T>(
      path,
      data: data,
      queryParameters: queryParameters,
      options: options,
    );
  }

  Future<Response<T>> delete<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) {
    return _dio.delete<T>(
      path,
      queryParameters: queryParameters,
      options: options,
    );
  }

  // ========== MÉTODOS ESPECÍFICOS PARA ASCENSORES ==========

  /// Obtiene todos los ascensores, opcionalmente filtrados por búsqueda
  Future<List<dynamic>> getElevators({
    String? searchQuery,
    String searchType = 'rae',
  }) async {
    try {
      final Map<String, dynamic> queryParameters = {};
      if (searchQuery != null && searchQuery.isNotEmpty) {
        queryParameters[searchType] = searchQuery;
      }

      final response = await _dio.get(
        '/elevator',
        queryParameters: queryParameters.isNotEmpty ? queryParameters : null,
      );

      return response.data['content'] ?? [];
    } on DioException catch (e) {
      throw Exception('Error al obtener ascensores: ${_getDioErrorMessage(e)}');
    } catch (e) {
      throw Exception('Error inesperado al obtener ascensores: $e');
    }
  }

  /// Obtiene un ascensor específico por su ID
  Future<Map<String, dynamic>> getElevatorById(String id) async {
    try {
      final response = await _dio.get('/elevator/$id');
      return response.data;
    } on DioException catch (e) {
      throw Exception(
        'Error al obtener el ascensor: ${_getDioErrorMessage(e)}',
      );
    } catch (e) {
      throw Exception('Error inesperado al obtener el ascensor: $e');
    }
  }

  /// Obtiene ascensores por comunidad
  Future<List<dynamic>> getElevatorsByCommunity(String communityName) async {
    try {
      final response = await _dio.get(
        '/elevator',
        queryParameters: {'communityName': communityName},
      );

      return response.data['content'] ?? [];
    } on DioException catch (e) {
      throw Exception(
        'Error al obtener ascensores por comunidad: ${_getDioErrorMessage(e)}',
      );
    } catch (e) {
      throw Exception(
        'Error inesperado al obtener ascensores por comunidad: $e',
      );
    }
  }

  /// Obtiene ascensores por RAE
  Future<List<dynamic>> getElevatorsByRae(String rae) async {
    try {
      final response = await _dio.get(
        '/elevator',
        queryParameters: {'rae': rae},
      );

      return response.data['content'] ?? [];
    } on DioException catch (e) {
      throw Exception(
        'Error al obtener ascensores por RAE: ${_getDioErrorMessage(e)}',
      );
    } catch (e) {
      throw Exception('Error inesperado al obtener ascensores por RAE: $e');
    }
  }

  // ========== MÉTODOS ESPECÍFICOS PARA COMUNIDADES ==========

  /// Obtiene todas las comunidades, opcionalmente filtradas por nombre
  Future<List<dynamic>> getCommunities({String? searchQuery}) async {
    try {
      final Map<String, dynamic> queryParameters = {};
      if (searchQuery != null && searchQuery.isNotEmpty) {
        queryParameters['name'] = searchQuery;
      }

      final response = await _dio.get(
        '/community',
        queryParameters: queryParameters.isNotEmpty ? queryParameters : null,
      );

      return response.data['content'] ?? [];
    } on DioException catch (e) {
      throw Exception(
        'Error al obtener comunidades: ${_getDioErrorMessage(e)}',
      );
    } catch (e) {
      throw Exception('Error inesperado al obtener comunidades: $e');
    }
  }

  /// Obtiene una comunidad específica por su ID
  Future<Map<String, dynamic>> getCommunityById(String id) async {
    try {
      final response = await _dio.get('/community/$id');
      return response.data;
    } on DioException catch (e) {
      throw Exception(
        'Error al obtener la comunidad: ${_getDioErrorMessage(e)}',
      );
    } catch (e) {
      throw Exception('Error inesperado al obtener la comunidad: $e');
    }
  }

  // ========== UTILIDADES ==========

  String _getDioErrorMessage(DioException e) {
    switch (e.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return 'Timeout de conexión. Verifica tu internet.';
      case DioExceptionType.badResponse:
        final statusCode = e.response?.statusCode;
        switch (statusCode) {
          case 400:
            return 'Solicitud incorrecta';
          case 401:
            return 'No autorizado - Token expirado';
          case 403:
            return 'Acceso denegado';
          case 404:
            return 'Recurso no encontrado';
          case 500:
            return 'Error interno del servidor';
          default:
            return 'Error del servidor (Código: $statusCode)';
        }
      case DioExceptionType.cancel:
        return 'Petición cancelada';
      case DioExceptionType.unknown:
        return 'Error de conexión. Verifica tu internet.';
      default:
        return 'Error inesperado: ${e.message}';
    }
  }

  // Getter para acceder a Dio directamente si necesitas
  Dio get dio => _dio;
}
