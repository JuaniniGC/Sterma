import 'package:flutter/material.dart';
import 'package:front/core/services/dio_service.dart';
import 'package:front/data/models/elevator_model.dart';
import 'package:front/data/models/elevator_next_maintenance_model.dart';
import 'package:front/pages/elevator_detail_page.dart';

class NextMaintenancesPage extends StatefulWidget {
  const NextMaintenancesPage({super.key});

  @override
  State<NextMaintenancesPage> createState() => _NextMaintenancesPageState();
}

class _NextMaintenancesPageState extends State<NextMaintenancesPage> {
  final DioService _dioService = DioService();

  List<ElevatorNextMaintenance> _maintenances = [];
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadNextMaintenances();
  }

  Future<void> _loadNextMaintenances() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final maintenances = await _dioService.getAllNextMaintenances();
      setState(() {
        _maintenances = maintenances;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = e.toString().replaceFirst('Exception: ', '');
        _isLoading = false;
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

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Próximos Mantenimientos'),
        backgroundColor: colorScheme.primary,
        foregroundColor: colorScheme.onPrimary,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadNextMaintenances,
          ),
        ],
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return _buildLoadingIndicator();
    }

    if (_errorMessage != null) {
      return _buildErrorWidget();
    }

    if (_maintenances.isEmpty) {
      return _buildEmptyState();
    }

    return _buildMaintenanceList();
  }

  Widget _buildLoadingIndicator() {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircularProgressIndicator(),
          SizedBox(height: 16),
          Text('Cargando próximos mantenimientos...'),
        ],
      ),
    );
  }

  Widget _buildErrorWidget() {
    final colorScheme = Theme.of(context).colorScheme;

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.error_outline, size: 64, color: colorScheme.error),
            const SizedBox(height: 16),
            Text(
              'Error al cargar los mantenimientos',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: colorScheme.error,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              _errorMessage ?? 'Error desconocido',
              textAlign: TextAlign.center,
              style: TextStyle(color: colorScheme.onSurface.withOpacity(0.7)),
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: _loadNextMaintenances,
              icon: const Icon(Icons.refresh),
              label: const Text('Reintentar'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.check_circle_outline, size: 64, color: Colors.green),
          const SizedBox(height: 16),
          const Text(
            'No hay mantenimientos programados',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          const Text(
            'Todos los mantenimientos están al día',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 16, color: Colors.grey),
          ),
        ],
      ),
    );
  }

  Widget _buildMaintenanceList() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _maintenances.length,
      itemBuilder: (context, index) {
        final maintenance = _maintenances[index];
        return _buildMaintenanceCard(maintenance);
      },
    );
  }

  Widget _buildMaintenanceCard(ElevatorNextMaintenance maintenance) {
    final nextMaintenance = maintenance.nextMaintenanceResponse;
    final elevator = maintenance.elevator;

    return Card(
      elevation: 2,
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: () => _navigateToElevatorDetails(elevator),
        borderRadius: BorderRadius.circular(8),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(
                    Icons.elevator,
                    color: nextMaintenance.statusColor,
                    size: 24,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'RAE: ${elevator.rae}',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: nextMaintenance.statusColor.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(4),
                      border: Border.all(color: nextMaintenance.statusColor),
                    ),
                    child: Text(
                      nextMaintenance.statusDisplayName.toUpperCase(),
                      style: TextStyle(
                        color: nextMaintenance.statusColor,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 12),

              Text(
                elevator.community.name,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                elevator.community.localization.fullAddress,
                style: const TextStyle(color: Colors.grey),
              ),

              const SizedBox(height: 12),

              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: nextMaintenance.statusColor.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Row(
                  children: [
                    Icon(
                      nextMaintenance.statusIcon,
                      color: nextMaintenance.statusColor,
                      size: 20,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            nextMaintenance.statusDescription,
                            style: TextStyle(
                              color: nextMaintenance.statusColor,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 4),
                          if (nextMaintenance.nextDate != null)
                            Text(
                              'Próxima fecha: ${_formatDate(nextMaintenance.nextDate!)}',
                              style: const TextStyle(fontSize: 14),
                            )
                          else
                            const Text(
                              'Sin fecha programada',
                              style: TextStyle(fontSize: 14),
                            ),
                          Text(
                            'Tipo: ${nextMaintenance.maintenanceTypeDisplayName}',
                            style: const TextStyle(fontSize: 14),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}
