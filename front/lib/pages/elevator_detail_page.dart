import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:front/data/models/elevator_model.dart';
import 'package:front/data/models/next_maintenance_model.dart';
import 'package:front/core/services/dio_service.dart';
import 'package:front/pages/maintenance_report_page.dart';
import 'package:front/pages/incident_report_page.dart';
import 'package:front/pages/elevator_reports_page.dart';
import 'package:front/utils/google_maps_button.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:android_intent_plus/android_intent.dart';

class ElevatorDetailPage extends StatefulWidget {
  final Elevator elevator;

  const ElevatorDetailPage({super.key, required this.elevator});

  @override
  State<ElevatorDetailPage> createState() => _ElevatorDetailPageState();
}

class _ElevatorDetailPageState extends State<ElevatorDetailPage> {
  NextMaintenanceModel? _nextMaintenance;
  bool _isLoadingNextMaintenance = false;
  String? _nextMaintenanceError;

  final DioService _dioService = DioService();

  @override
  void initState() {
    super.initState();
    _loadNextMaintenance();
  }

  Future<void> _loadNextMaintenance() async {
    setState(() {
      _isLoadingNextMaintenance = true;
      _nextMaintenanceError = null;
    });

    try {
      final nextMaintenance = await _dioService.getNextMaintenance(
        widget.elevator.id,
      );
      setState(() {
        _nextMaintenance = nextMaintenance;
        _isLoadingNextMaintenance = false;
      });
    } catch (e) {
      setState(() {
        _nextMaintenanceError = e.toString().replaceFirst('Exception: ', '');
        _isLoadingNextMaintenance = false;
      });
    }
  }

  Future<void> _openGoogleMaps() async {
    final address = widget.elevator.community.localization.fullAddress;
    final encodedAddress = Uri.encodeComponent(address);

    try {
      final intent = AndroidIntent(
        action: 'android.intent.action.VIEW',
        data: 'geo:0,0?q=$encodedAddress',
        package: 'com.google.android.apps.maps',
      );

      await intent.launch();
    } catch (e) {
      await _openInBrowser(address);
    }
  }

  Future<void> _openInBrowser(String address) async {
    final encodedAddress = Uri.encodeComponent(address);
    final url = Uri.parse('https://www.google.com/maps/search/$encodedAddress');

    try {
      if (await canLaunchUrl(url)) {
        await launchUrl(url, mode: LaunchMode.externalApplication);
      } else {
        _showMapsOptions(address);
      }
    } catch (e) {
      _showMapsOptions(address);
    }
  }

  void _showMapsOptions(String address) {
    final encodedAddress = Uri.encodeComponent(address);

    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Padding(
              padding: EdgeInsets.all(16),
              child: Text(
                'Abrir en Google Maps',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.map, color: Colors.green),
              title: const Text('Abrir con Google Maps'),
              subtitle: Text(
                address,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              onTap: () async {
                Navigator.pop(context);
                final encodedAddr = Uri.encodeComponent(address);
                final intent = AndroidIntent(
                  action: 'android.intent.action.VIEW',
                  data: 'geo:0,0?q=$encodedAddr',
                  package: 'com.google.android.apps.maps',
                );
                try {
                  await intent.launch();
                } catch (e) {
                  final webUrl = Uri.parse(
                    'https://www.google.com/maps/search/$encodedAddress',
                  );
                  if (await canLaunchUrl(webUrl)) {
                    await launchUrl(webUrl, mode: LaunchMode.platformDefault);
                  }
                }
              },
            ),
            ListTile(
              leading: const Icon(Icons.web, color: Colors.blue),
              title: const Text('Abrir en el navegador'),
              subtitle: Text(
                address,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              onTap: () async {
                Navigator.pop(context);
                final webUrl = Uri.parse(
                  'https://www.google.com/maps/search/$encodedAddress',
                );
                if (await canLaunchUrl(webUrl)) {
                  await launchUrl(webUrl, mode: LaunchMode.platformDefault);
                }
              },
            ),
            ListTile(
              leading: const Icon(Icons.copy, color: Colors.grey),
              title: const Text('Copiar dirección'),
              onTap: () {
                Navigator.pop(context);
                Clipboard.setData(ClipboardData(text: address));
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Dirección copiada al portapapeles'),
                    duration: Duration(seconds: 2),
                  ),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.link, color: Colors.grey),
              title: const Text('Copiar enlace de Google Maps'),
              onTap: () {
                Navigator.pop(context);
                final link =
                    'https://www.google.com/maps/search/$encodedAddress';
                Clipboard.setData(ClipboardData(text: link));
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Enlace copiado al portapapeles'),
                    duration: Duration(seconds: 2),
                  ),
                );
              },
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Ascensor ${widget.elevator.rae}',
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

            _buildNextMaintenanceSection(),
            const SizedBox(height: 24),

            _buildCommunitySection(),
            const SizedBox(height: 24),

            _buildContactSection(),
          ],
        ),
      ),
    );
  }

  Widget _buildCommunitySection() {
    final address = widget.elevator.community.localization.fullAddress;

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
            _buildInfoRow('Nombre', widget.elevator.community.name),
            _buildInfoRow('Descripción', widget.elevator.community.description),
            _buildInfoRow('CIF', widget.elevator.community.cif),
            const SizedBox(height: 12),
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
                      Text(address),
                      const SizedBox(height: 8),
                      GoogleMapsButton(address: address),
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

  Widget _buildNextMaintenanceSection() {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Próximo Mantenimiento',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            if (_isLoadingNextMaintenance) ...[
              _buildSkeletonLoader(),
            ] else if (_nextMaintenanceError != null) ...[
              _buildErrorWidget(),
            ] else if (_nextMaintenance != null) ...[
              _buildNextMaintenanceInfo(),
            ] else ...[
              _buildNoMaintenanceInfo(),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildSkeletonLoader() {
    return Column(
      children: [
        _buildSkeletonRow(),
        const SizedBox(height: 12),
        _buildSkeletonRow(),
        const SizedBox(height: 12),
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              width: 120,
              child: Container(
                height: 16,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Row(
                children: [
                  Container(
                    width: 12,
                    height: 12,
                    decoration: BoxDecoration(
                      color: Colors.grey[300],
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Container(
                      height: 16,
                      decoration: BoxDecoration(
                        color: Colors.grey[300],
                        borderRadius: BorderRadius.circular(4),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildSkeletonRow() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 120,
          child: Container(
            height: 16,
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(4),
            ),
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Container(
            height: 16,
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(4),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildNextMaintenanceInfo() {
    final nextMaintenance = _nextMaintenance!;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildMaintenanceInfoRow(
          'Tipo',
          nextMaintenance.maintenanceTypeDisplayName,
        ),
        _buildMaintenanceInfoRow(
          'Próxima fecha',
          '${nextMaintenance.nextDate.day}/${nextMaintenance.nextDate.month}/${nextMaintenance.nextDate.year}',
        ),
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              width: 120,
              child: Text(
                'Estado:',
                style: TextStyle(
                  fontWeight: FontWeight.w500,
                  color: Colors.grey[700],
                ),
              ),
            ),
            Expanded(
              child: Row(
                children: [
                  Container(
                    width: 12,
                    height: 12,
                    decoration: BoxDecoration(
                      color: nextMaintenance.statusColor,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    nextMaintenance.statusDisplayName,
                    style: TextStyle(
                      color: nextMaintenance.statusColor,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildMaintenanceInfoRow(String label, String value) {
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

  Widget _buildErrorWidget() {
    final colorScheme = Theme.of(context).colorScheme;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: colorScheme.errorContainer.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Icon(Icons.error_outline, color: colorScheme.error, size: 20),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  'No se pudo cargar la información del próximo mantenimiento',
                  style: TextStyle(color: colorScheme.error, fontSize: 14),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ElevatedButton.icon(
            onPressed: _loadNextMaintenance,
            icon: Icon(Icons.refresh, size: 16, color: colorScheme.onPrimary),
            label: Text(
              'Reintentar',
              style: TextStyle(color: colorScheme.onPrimary),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: colorScheme.error,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNoMaintenanceInfo() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(8),
      ),
      child: const Row(
        children: [
          Icon(Icons.info_outline, color: Colors.grey, size: 20),
          SizedBox(width: 8),
          Expanded(
            child: Text(
              'No hay información disponible sobre el próximo mantenimiento',
              style: TextStyle(color: Colors.grey),
            ),
          ),
        ],
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
                    'Ascensor ${widget.elevator.rae}',
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _buildInfoRow('Código RAE', widget.elevator.rae),
            _buildInfoRow(
              'Año de instalación',
              widget.elevator.installationYear.toString(),
            ),

            const SizedBox(height: 16),

            ElevatedButton.icon(
              onPressed: () => _navigateToReports(context),
              icon: const Icon(Icons.history, size: 20),
              label: const Text('Ver informes históricos'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.grey[800],
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),

            const SizedBox(height: 16),

            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Crear nuevo informe:',
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
        builder: (context) => MaintenanceReportPage(rae: widget.elevator.rae),
      ),
    );
  }

  void _navigateToIncidentReport(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => IncidentReportPage(rae: widget.elevator.rae),
      ),
    );
  }

  void _navigateToReports(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ElevatorReportsPage(
          elevatorId: widget.elevator.id,
          elevatorRAE: widget.elevator.rae,
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
              widget.elevator.community.communityLeaderInfo.communityLeaderName,
            ),
            _buildContactRow(
              Icons.phone,
              'Teléfono',
              widget
                  .elevator
                  .community
                  .communityLeaderInfo
                  .communityLeaderTelephone,
            ),
            if (widget
                .elevator
                .community
                .communityLeaderInfo
                .communityLeaderNote
                .isNotEmpty)
              _buildContactRow(
                Icons.note,
                'Nota',
                widget
                    .elevator
                    .community
                    .communityLeaderInfo
                    .communityLeaderNote,
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
