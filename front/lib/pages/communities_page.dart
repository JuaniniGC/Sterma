import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:front/core/services/dio_service.dart';

class CommunitiesPage extends StatefulWidget {
  const CommunitiesPage({super.key});

  @override
  State<CommunitiesPage> createState() => _CommunitiesPageState();
}

class _CommunitiesPageState extends State<CommunitiesPage> {
  List<dynamic> communityList = [];
  bool isLoading = true;
  String? errorMessage;
  final DioService _dioService = DioService();

  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    fetchCommunities();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> fetchCommunities({String? searchQuery}) async {
    try {
      setState(() {
        isLoading = true;
        errorMessage = null;
      });

      final Map<String, dynamic> queryParameters = {};
      if (searchQuery != null && searchQuery.isNotEmpty) {
        queryParameters['name'] = searchQuery;
      }

      final response = await _dioService.get(
        '/community',
        queryParameters: queryParameters.isNotEmpty ? queryParameters : null,
      );

      final List<dynamic> data = response.data['content'] ?? [];

      setState(() {
        communityList = data;
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
    fetchCommunities(searchQuery: query.isEmpty ? null : query);
  }

  void _onSearchSubmitted(String query) {
    fetchCommunities(searchQuery: query.isEmpty ? null : query);
  }

  void _clearSearch() {
    _searchController.clear();
    fetchCommunities();
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
    return Scaffold(
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Buscar comunidades por nombre...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: _clearSearch,
                      )
                    : null,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12.0),
                ),
                filled: true,
                fillColor: Colors.grey[50],
              ),
              onChanged: _onSearchChanged,
              onSubmitted: _onSearchSubmitted,
            ),
          ),

          if (!isLoading && communityList.isNotEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Row(
                children: [
                  Text(
                    '${communityList.length} comunidad(es) encontrada(s)',
                    style: TextStyle(color: Colors.grey[600], fontSize: 14),
                  ),
                  if (_searchController.text.isNotEmpty)
                    Text(
                      ' para "${_searchController.text}"',
                      style: TextStyle(color: Colors.grey[600], fontSize: 14),
                    ),
                ],
              ),
            ),

          Expanded(child: _buildCommunityList()),
        ],
      ),
    );
  }

  Widget _buildCommunityList() {
    if (isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (errorMessage != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              errorMessage!,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 16, color: Colors.red),
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: () {
                fetchCommunities(
                  searchQuery: _searchController.text.isEmpty
                      ? null
                      : _searchController.text,
                );
              },
              icon: const Icon(Icons.refresh),
              label: const Text('Reintentar'),
            ),
          ],
        ),
      );
    }

    if (communityList.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              _searchController.text.isEmpty
                  ? Icons.group_off
                  : Icons.search_off,
              size: 64,
              color: Colors.grey,
            ),
            const SizedBox(height: 16),
            Text(
              _searchController.text.isEmpty
                  ? 'No hay comunidades disponibles'
                  : 'No se encontraron comunidades para "${_searchController.text}"',
              style: const TextStyle(fontSize: 16, color: Colors.grey),
              textAlign: TextAlign.center,
            ),
            if (_searchController.text.isNotEmpty)
              TextButton(
                onPressed: _clearSearch,
                child: const Text('Ver todas las comunidades'),
              ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () => fetchCommunities(
        searchQuery: _searchController.text.isEmpty
            ? null
            : _searchController.text,
      ),
      child: ListView.builder(
        itemCount: communityList.length,
        itemBuilder: (context, index) {
          final community = communityList[index];
          final localization = community['localization'] ?? {};
          final leaderInfo = community['communityLeaderInfo'] ?? {};

          final location =
              "${localization['street'] ?? ''}, ${localization['city'] ?? ''} (${localization['postalCode'] ?? ''})";

          return CommunityGeneralInfoCard(
            name: community['name'] ?? 'Sin nombre',
            description: community['description'] ?? '',
            location: location,
            leaderName: leaderInfo['communityLeaderName'] ?? 'Sin líder',
            leaderPhone:
                leaderInfo['communityLeaderTelephone']?.toString() ?? '',
            leaderNote: leaderInfo['communityLeaderNote'] ?? '',
            cif: community['cif'] ?? '',
          );
        },
      ),
    );
  }
}

class CommunityGeneralInfoCard extends StatelessWidget {
  final String name;
  final String description;
  final String location;
  final String leaderName;
  final String leaderPhone;
  final String leaderNote;
  final String cif;

  const CommunityGeneralInfoCard({
    super.key,
    required this.name,
    required this.description,
    required this.location,
    required this.leaderName,
    required this.leaderPhone,
    required this.leaderNote,
    required this.cif,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        print('Comunidad seleccionada: $name');
      },
      borderRadius: BorderRadius.circular(12),
      child: Card(
        elevation: 4,
        margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                name,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                description,
                style: TextStyle(fontSize: 16, color: Colors.grey[700]),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(
                    Icons.location_on,
                    size: 20,
                    color: Colors.blueGrey,
                  ),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      location,
                      style: const TextStyle(
                        fontSize: 14,
                        color: Colors.black54,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.person, size: 20, color: Colors.teal),
                  const SizedBox(width: 4),
                  Text(leaderName, style: const TextStyle(fontSize: 14)),
                  const SizedBox(width: 8),
                  Text(
                    '(${leaderNote})',
                    style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  const Icon(Icons.phone, size: 18, color: Colors.green),
                  const SizedBox(width: 4),
                  Text(leaderPhone),
                  const Spacer(),
                  Text(
                    'CIF: $cif',
                    style: const TextStyle(fontSize: 13, color: Colors.grey),
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
