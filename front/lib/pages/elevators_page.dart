import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:front/core/services/dio_service.dart';

class ElevatorsPage extends StatefulWidget {
  const ElevatorsPage({super.key});

  @override
  State<ElevatorsPage> createState() => _ElevatorsPageState();
}

class _ElevatorsPageState extends State<ElevatorsPage> {
  List<dynamic> elevatorList = [];
  bool isLoading = true;
  String? errorMessage;
  final DioService _dioService = DioService();

  final TextEditingController _searchController = TextEditingController();

  // ✅ Nuevo: Tipo de búsqueda seleccionado
  String _selectedSearchType = 'rae'; // 'rae' o 'communityName'

  @override
  void initState() {
    super.initState();
    fetchElevators();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> fetchElevators({String? searchQuery}) async {
    try {
      setState(() {
        isLoading = true;
        errorMessage = null;
      });

      final Map<String, dynamic> queryParameters = {};
      if (searchQuery != null && searchQuery.isNotEmpty) {
        // ✅ Usar el tipo de búsqueda seleccionado
        queryParameters[_selectedSearchType] = searchQuery;
      }

      final response = await _dioService.get(
        '/elevator',
        queryParameters: queryParameters.isNotEmpty ? queryParameters : null,
      );

      final List<dynamic> data = response.data['content'] ?? [];

      setState(() {
        elevatorList = data;
        isLoading = false;
      });
    } on DioException catch (e) {
      if (e.response?.statusCode != 401) {
        setState(() {
          errorMessage = 'Error: ${_getErrorMessage(e)}';
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        errorMessage = 'Error inesperado: $e';
        isLoading = false;
      });
    }
  }

  void _onSearchChanged(String query) {
    fetchElevators(searchQuery: query.isEmpty ? null : query);
  }

  void _onSearchSubmitted(String query) {
    fetchElevators(searchQuery: query.isEmpty ? null : query);
  }

  void _clearSearch() {
    _searchController.clear();
    fetchElevators();
  }

  // ✅ Cambiar tipo de búsqueda con botones
  void _changeSearchType(String newType) {
    setState(() {
      _selectedSearchType = newType;
    });
    // 🔄 Si hay texto en la búsqueda, hacer nueva búsqueda con el tipo seleccionado
    if (_searchController.text.isNotEmpty) {
      fetchElevators(searchQuery: _searchController.text);
    }
  }

  String _getErrorMessage(DioException e) {
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

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Scaffold(
      backgroundColor: Colors.white, // ✅ Fondo blanco para toda la página
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                // ✅ Barra de búsqueda
                TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    hintText: _getSearchHintText(),
                    prefixIcon: Icon(Icons.search, color: colorScheme.primary),
                    suffixIcon: _searchController.text.isNotEmpty
                        ? IconButton(
                            icon: Icon(Icons.clear, color: colorScheme.primary),
                            onPressed: _clearSearch,
                          )
                        : null,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                    filled: true,
                    fillColor: colorScheme.secondaryContainer,
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12.0),
                      borderSide: BorderSide(
                        color: colorScheme.primary,
                        width: 2.0,
                      ),
                    ),
                  ),
                  onChanged: _onSearchChanged,
                  onSubmitted: _onSearchSubmitted,
                ),
                const SizedBox(height: 12),

                // ✅ Botones de selección de tipo de búsqueda (usando tema)
                Row(
                  children: [
                    Text(
                      'Buscar por:',
                      style: TextStyle(
                        fontSize: 14,
                        color: colorScheme.onSecondary.withOpacity(0.8),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(width: 16),

                    // ✅ Botón RAE
                    ElevatedButton(
                      onPressed: () => _changeSearchType('rae'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _selectedSearchType == 'rae'
                            ? colorScheme.primary
                            : colorScheme.surface,
                        foregroundColor: _selectedSearchType == 'rae'
                            ? colorScheme.onPrimary
                            : colorScheme.onSurface,
                        elevation: _selectedSearchType == 'rae' ? 2 : 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                          side: BorderSide(
                            color: _selectedSearchType == 'rae'
                                ? colorScheme.primary
                                : colorScheme.outline.withOpacity(0.3),
                            width: 1,
                          ),
                        ),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 8,
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.elevator,
                            size: 16,
                            color: _selectedSearchType == 'rae'
                                ? colorScheme.onPrimary
                                : colorScheme.onSurface,
                          ),
                          const SizedBox(width: 6),
                          Text(
                            'RAE',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: _selectedSearchType == 'rae'
                                  ? FontWeight.w600
                                  : FontWeight.normal,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),

                    // ✅ Botón Comunidad (mismo color azul que RAE)
                    ElevatedButton(
                      onPressed: () => _changeSearchType('communityName'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _selectedSearchType == 'communityName'
                            ? colorScheme
                                  .primary // ✅ Mismo color azul
                            : colorScheme.surface,
                        foregroundColor: _selectedSearchType == 'communityName'
                            ? colorScheme
                                  .onPrimary // ✅ Mismo texto blanco
                            : colorScheme.onSurface,
                        elevation: _selectedSearchType == 'communityName'
                            ? 2
                            : 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                          side: BorderSide(
                            color: _selectedSearchType == 'communityName'
                                ? colorScheme
                                      .primary // ✅ Mismo borde azul
                                : colorScheme.outline.withOpacity(0.3),
                            width: 1,
                          ),
                        ),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 8,
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.home,
                            size: 16,
                            color: _selectedSearchType == 'communityName'
                                ? colorScheme
                                      .onPrimary // ✅ Mismo icono blanco
                                : colorScheme.onSurface,
                          ),
                          const SizedBox(width: 6),
                          Text(
                            'Comunidad',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: _selectedSearchType == 'communityName'
                                  ? FontWeight.w600
                                  : FontWeight.normal,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // ❌ ELIMINADO: Texto de "ascensores encontrados"
          Expanded(
            child: Container(
              color: Colors.white, // ✅ Fondo blanco para el área de la lista
              child: _buildElevatorList(),
            ),
          ),
        ],
      ),
    );
  }

  // ✅ Texto del hint dinámico según el tipo de búsqueda
  String _getSearchHintText() {
    return _selectedSearchType == 'rae'
        ? 'Buscar por código RAE...'
        : 'Buscar por nombre de comunidad...';
  }

  // ✅ Descripción de búsqueda dinámica
  String _getSearchDescription() {
    return _selectedSearchType == 'rae' ? 'para RAE' : 'para comunidad';
  }

  Widget _buildElevatorList() {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    if (isLoading) {
      return Container(
        color: Colors.white, // ✅ Fondo blanco durante carga
        child: Center(
          child: CircularProgressIndicator(color: colorScheme.primary),
        ),
      );
    }

    if (errorMessage != null) {
      return Container(
        color: Colors.white, // ✅ Fondo blanco en error
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.error_outline, size: 64, color: colorScheme.error),
              const SizedBox(height: 16),
              Text(
                errorMessage!,
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 16, color: colorScheme.error),
              ),
              const SizedBox(height: 20),
              ElevatedButton.icon(
                onPressed: () {
                  fetchElevators(
                    searchQuery: _searchController.text.isEmpty
                        ? null
                        : _searchController.text,
                  );
                },
                icon: Icon(Icons.refresh, color: colorScheme.onPrimary),
                label: Text(
                  'Reintentar',
                  style: TextStyle(color: colorScheme.onPrimary),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: colorScheme.primary,
                ),
              ),
            ],
          ),
        ),
      );
    }

    if (elevatorList.isEmpty) {
      return Container(
        color: Colors.white, // ✅ Fondo blanco cuando no hay datos
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                _searchController.text.isEmpty
                    ? Icons.elevator_outlined
                    : Icons.search_off,
                size: 64,
                color: Colors.grey[400],
              ),
              const SizedBox(height: 16),
              Text(
                _searchController.text.isEmpty
                    ? 'No hay ascensores disponibles'
                    : 'No se encontraron ascensores ${_getSearchDescription()} "${_searchController.text}"',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey[600], // ✅ Gris sobre fondo blanco
                ),
                textAlign: TextAlign.center,
              ),
              if (_searchController.text.isNotEmpty)
                TextButton(
                  onPressed: _clearSearch,
                  child: Text(
                    'Ver todos los ascensores',
                    style: TextStyle(color: colorScheme.primary),
                  ),
                ),
            ],
          ),
        ),
      );
    }

    return RefreshIndicator(
      color: colorScheme.primary,
      backgroundColor: Colors.white, // ✅ Fondo blanco para el refresh indicator
      onRefresh: () => fetchElevators(
        searchQuery: _searchController.text.isEmpty
            ? null
            : _searchController.text,
      ),
      child: ListView.builder(
        itemCount: elevatorList.length,
        itemBuilder: (context, index) {
          final elevator = elevatorList[index];
          final community = elevator['community'] ?? {};
          final localization = community['localization'] ?? {};

          final location =
              "${localization['street'] ?? ''}, ${localization['city'] ?? ''} (${localization['postalCode'] ?? ''})";

          return ElevatorGeneralInfoCard(
            rae: elevator['rae'] ?? 'Sin RAE',
            installationYear: elevator['instalationYear']?.toString() ?? 'N/A',
            communityName: community['name'] ?? 'Sin comunidad',
            location: location,
          );
        },
      ),
    );
  }
}

class ElevatorGeneralInfoCard extends StatelessWidget {
  final String rae;
  final String installationYear;
  final String communityName;
  final String location;

  const ElevatorGeneralInfoCard({
    super.key,
    required this.rae,
    required this.installationYear,
    required this.communityName,
    required this.location,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return InkWell(
      onTap: () {
        print('Ascensor seleccionado: $rae');
      },
      borderRadius: BorderRadius.circular(12),
      child: Card(
        elevation: 4,
        margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
        color: Colors.white, // ✅ Fondo blanco para las tarjetas
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ✅ Header con RAE y año de instalación
              Row(
                children: [
                  Icon(Icons.elevator, color: colorScheme.primary, size: 24),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'RAE: $rae',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color:
                            Colors.black87, // ✅ Texto oscuro sobre fondo blanco
                      ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: colorScheme.secondaryContainer,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      'Año: $installationYear',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: colorScheme.onSecondary,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // ✅ Información de la comunidad
              Text(
                communityName,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: colorScheme.primary,
                ),
              ),
              const SizedBox(height: 8),

              // ✅ Ubicación
              Row(
                children: [
                  Icon(Icons.location_on, size: 18, color: Colors.grey[600]),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      location,
                      style: const TextStyle(
                        fontSize: 14,
                        color:
                            Colors.black54, // ✅ Texto gris sobre fondo blanco
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
