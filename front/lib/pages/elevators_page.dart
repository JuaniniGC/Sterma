import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:front/core/services/dio_service.dart';
import 'package:front/data/models/elevator_model.dart';
import 'elevator_detail_page.dart';

class ElevatorsPage extends StatefulWidget {
  final String? initialCommunityName;

  const ElevatorsPage({super.key, this.initialCommunityName});

  @override
  State<ElevatorsPage> createState() => _ElevatorsPageState();
}

class _ElevatorsPageState extends State<ElevatorsPage> {
  List<Elevator> elevatorList = [];
  bool isLoading = true;
  String? errorMessage;
  final DioService _dioService = DioService();

  final TextEditingController _searchController = TextEditingController();
  String _selectedSearchType = 'rae';

  @override
  void initState() {
    super.initState();

    if (widget.initialCommunityName != null) {
      _selectedSearchType = 'communityName';
      _searchController.text = widget.initialCommunityName!;
    }

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

      final data = await _dioService.getElevators(
        searchQuery: searchQuery,
        searchType: _selectedSearchType,
      );

      final elevators = data.map((json) => Elevator.fromJson(json)).toList();

      setState(() {
        elevatorList = elevators.cast<Elevator>();
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

  void _navigateToElevatorDetails(Elevator elevator) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ElevatorDetailPage(elevator: elevator),
      ),
    );
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

  void _changeSearchType(String newType) {
    setState(() {
      _selectedSearchType = newType;
      if (newType != 'communityName' && widget.initialCommunityName != null) {
        _searchController.clear();
      } else if (newType == 'communityName' &&
          widget.initialCommunityName != null) {
        _searchController.text = widget.initialCommunityName!;
      }
    });

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
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(
          widget.initialCommunityName != null
              ? 'Ascensores - ${widget.initialCommunityName}'
              : 'Todos los Ascensores',
        ),
        backgroundColor: colorScheme.primary,
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
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
                    ElevatedButton(
                      onPressed: () => _changeSearchType('communityName'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _selectedSearchType == 'communityName'
                            ? colorScheme.primary
                            : colorScheme.surface,
                        foregroundColor: _selectedSearchType == 'communityName'
                            ? colorScheme.onPrimary
                            : colorScheme.onSurface,
                        elevation: _selectedSearchType == 'communityName'
                            ? 2
                            : 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                          side: BorderSide(
                            color: _selectedSearchType == 'communityName'
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
                            Icons.home,
                            size: 16,
                            color: _selectedSearchType == 'communityName'
                                ? colorScheme.onPrimary
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
          Expanded(
            child: Container(color: Colors.white, child: _buildElevatorList()),
          ),
        ],
      ),
    );
  }

  String _getSearchHintText() {
    return _selectedSearchType == 'rae'
        ? 'Buscar por código RAE...'
        : 'Buscar por nombre de comunidad...';
  }

  String _getSearchDescription() {
    return _selectedSearchType == 'rae' ? 'para RAE' : 'para comunidad';
  }

  Widget _buildElevatorList() {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    if (isLoading) {
      return Container(
        color: Colors.white,
        child: Center(
          child: CircularProgressIndicator(color: colorScheme.primary),
        ),
      );
    }

    if (errorMessage != null) {
      return Container(
        color: Colors.white,
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
        color: Colors.white,
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
                style: TextStyle(fontSize: 16, color: Colors.grey[600]),
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
      backgroundColor: Colors.white,
      onRefresh: () => fetchElevators(
        searchQuery: _searchController.text.isEmpty
            ? null
            : _searchController.text,
      ),
      child: ListView.builder(
        itemCount: elevatorList.length,
        itemBuilder: (context, index) {
          final elevator = elevatorList[index];

          return ElevatorGeneralInfoCard(
            elevator: elevator,
            onTap: () => _navigateToElevatorDetails(elevator),
          );
        },
      ),
    );
  }
}

class ElevatorGeneralInfoCard extends StatelessWidget {
  final Elevator elevator;
  final VoidCallback onTap;

  const ElevatorGeneralInfoCard({
    super.key,
    required this.elevator,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Card(
        elevation: 4,
        margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
        color: Colors.white,
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(Icons.elevator, color: colorScheme.primary, size: 24),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'RAE: ${elevator.rae}',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
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
                      'Año: ${elevator.installationYear}',
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
              Text(
                elevator.community.name,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: colorScheme.primary,
                ),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Icon(Icons.location_on, size: 18, color: Colors.grey[600]),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      elevator.community.localization.fullAddress,
                      style: const TextStyle(
                        fontSize: 14,
                        color: Colors.black54,
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
