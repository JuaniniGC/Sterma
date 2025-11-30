import 'package:flutter/material.dart';
import 'package:front/data/models/elevator_model.dart';
import 'package:front/pages/maintenance_report_page.dart';
import 'package:front/pages/incident_report_page.dart';

class ElevatorDetailPage extends StatelessWidget {
  final Elevator elevator;

  const ElevatorDetailPage({super.key, required this.elevator});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Ascensor ${elevator.rae}',
          style: const TextStyle(color: Colors.white),
        ),
        backgroundColor: colorScheme.primary,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildElevatorInfoSection(context),
            const SizedBox(height: 24),

            _buildCommunitySection(),
            const SizedBox(height: 24),

            _buildContactSection(),
          ],
        ),
      ),
    );
  }

  Widget _buildElevatorInfoSection(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.elevator, size: 32, color: Colors.blue[700]),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Ascensor ${elevator.rae}',
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _buildInfoRow('Código RAE', elevator.rae),
            _buildInfoRow(
              'Año de instalación',
              elevator.installationYear.toString(),
            ),

            const SizedBox(height: 16),

            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Crear informe para este ascensor:',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: colorScheme.onSurface,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    ElevatedButton.icon(
                      onPressed: () => _navigateToMaintenanceReport(context),
                      icon: const Icon(Icons.build, size: 16),
                      label: const Text('Mantenimiento'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: colorScheme.primary,
                        foregroundColor: colorScheme.onPrimary,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 8,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton.icon(
                      onPressed: () => _navigateToIncidentReport(context),
                      icon: const Icon(Icons.report_problem, size: 16),
                      label: const Text('Avería'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: colorScheme.secondary,
                        foregroundColor: colorScheme.onSecondary,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 8,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _navigateToMaintenanceReport(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => MaintenanceReportPage(rae: elevator.rae),
      ),
    );
  }

  void _navigateToIncidentReport(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => IncidentReportPage(rae: elevator.rae),
      ),
    );
  }

  Widget _buildCommunitySection() {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Comunidad',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            _buildInfoRow('Nombre', elevator.community.name),
            _buildInfoRow('Descripción', elevator.community.description),
            _buildInfoRow('CIF', elevator.community.cif),
            const SizedBox(height: 12),
            // Ubicación
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(Icons.location_on, size: 20, color: Colors.grey[600]),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Ubicación',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(elevator.community.localization.fullAddress),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildContactSection() {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Responsable',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            _buildContactRow(
              Icons.person,
              'Nombre',
              elevator.community.communityLeaderInfo.communityLeaderName,
            ),
            _buildContactRow(
              Icons.phone,
              'Teléfono',
              elevator.community.communityLeaderInfo.communityLeaderTelephone,
            ),
            if (elevator
                .community
                .communityLeaderInfo
                .communityLeaderNote
                .isNotEmpty)
              _buildContactRow(
                Icons.note,
                'Nota',
                elevator.community.communityLeaderInfo.communityLeaderNote,
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              '$label:',
              style: TextStyle(
                fontWeight: FontWeight.w500,
                color: Colors.grey[700],
              ),
            ),
          ),
          Expanded(child: Text(value, style: const TextStyle(fontSize: 16))),
        ],
      ),
    );
  }

  Widget _buildContactRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 20, color: Colors.grey[600]),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 2),
                Text(value, style: const TextStyle(fontSize: 16)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
