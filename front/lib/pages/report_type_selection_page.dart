import 'package:flutter/material.dart';
import 'package:front/core/services/dio_service.dart';
import 'package:front/pages/incident_report_page.dart';
import 'package:front/pages/maintenance_report_page.dart';

class ReportTypeSelectionPage extends StatefulWidget {
  const ReportTypeSelectionPage({super.key});

  @override
  State<ReportTypeSelectionPage> createState() =>
      _ReportTypeSelectionPageState();
}

class _ReportTypeSelectionPageState extends State<ReportTypeSelectionPage> {
  String? _selectedRae;
  List<String> _raes = [];
  bool _isLoading = true;
  String? _errorMessage;

  final DioService _dioService = DioService();

  @override
  void initState() {
    super.initState();
    _fetchRaes();
  }

  Future<void> _fetchRaes() async {
    try {
      setState(() {
        _isLoading = true;
        _errorMessage = null;
      });

      final raes = await _dioService.getAllRaes();

      setState(() {
        _raes = raes;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = e.toString().replaceFirst('Exception: ', '');
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        color: colorScheme.background,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _buildRaeSelector(context),

              const SizedBox(height: 40),

              Text(
                'Selecciona el tipo de informe',
                style: theme.textTheme.headlineSmall?.copyWith(
                  color: colorScheme.onBackground,
                  fontWeight: FontWeight.w600,
                ),
              ),

              const SizedBox(height: 40),

              _buildReportTypeCard(
                context,
                title: 'Informe de Mantenimiento',
                subtitle: 'Mantenimiento preventivo o correctivo',
                icon: Icons.build_circle_outlined,
                primaryColor: colorScheme.primary,
                secondaryColor: colorScheme.primaryContainer,
                isEnabled: _selectedRae != null,
                onTap: () {
                  _navigateToMaintenanceReport(context);
                },
              ),

              const SizedBox(height: 24),

              _buildReportTypeCard(
                context,
                title: 'Informe de Avería',
                subtitle: 'Reporte de fallos o problemas',
                icon: Icons.warning_amber_rounded,
                primaryColor: colorScheme.primary,
                secondaryColor: colorScheme.primaryContainer,
                isEnabled: _selectedRae != null,
                onTap: () {
                  _navigateToBreakdownReport(context);
                },
              ),

              const SizedBox(height: 40),

              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Text(
                  _selectedRae == null
                      ? 'Selecciona un RAE para habilitar los informes'
                      : 'Selecciona el tipo de informe que deseas crear para el RAE $_selectedRae',
                  textAlign: TextAlign.center,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: colorScheme.onBackground.withOpacity(0.7),
                    height: 1.4,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRaeSelector(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: colorScheme.outline.withOpacity(0.2)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Seleccionar Ascensor',
              style: theme.textTheme.titleLarge?.copyWith(
                color: colorScheme.onSurface,
                fontWeight: FontWeight.w600,
              ),
            ),

            const SizedBox(height: 8),

            Text(
              'Elige el RAE para el cual crearás el informe',
              style: theme.textTheme.bodyMedium?.copyWith(
                color: colorScheme.onSurface.withOpacity(0.7),
              ),
            ),

            const SizedBox(height: 20),

            if (_isLoading) ...[
              _buildLoadingIndicator(),
            ] else if (_errorMessage != null) ...[
              _buildErrorWidget(),
            ] else ...[
              _buildRaeDropdown(context),
            ],

            if (_selectedRae != null) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: colorScheme.primary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: colorScheme.primary.withOpacity(0.3),
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.check_circle,
                      color: colorScheme.primary,
                      size: 20,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'RAE seleccionado: $_selectedRae',
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: colorScheme.primary,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildLoadingIndicator() {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Container(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          CircularProgressIndicator(color: colorScheme.primary),
          const SizedBox(height: 12),
          Text(
            'Cargando RAE...',
            style: theme.textTheme.bodyMedium?.copyWith(
              color: colorScheme.onSurface.withOpacity(0.7),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorWidget() {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: colorScheme.errorContainer,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        children: [
          Icon(Icons.error_outline, color: colorScheme.error, size: 40),
          const SizedBox(height: 8),
          Text(
            _errorMessage ?? 'Error al cargar los RAE',
            textAlign: TextAlign.center,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: colorScheme.onErrorContainer,
            ),
          ),
          const SizedBox(height: 12),
          ElevatedButton.icon(
            onPressed: _fetchRaes,
            icon: Icon(Icons.refresh, color: colorScheme.onPrimary),
            label: Text(
              'Reintentar',
              style: TextStyle(color: colorScheme.onPrimary),
            ),
            style: ElevatedButton.styleFrom(backgroundColor: colorScheme.error),
          ),
        ],
      ),
    );
  }

  Widget _buildRaeDropdown(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'RAE',
          style: theme.textTheme.bodyMedium?.copyWith(
            color: colorScheme.onSurface,
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 8),
        Container(
          decoration: BoxDecoration(
            color: colorScheme.surface,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: colorScheme.outline.withOpacity(0.3)),
          ),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Row(
              children: [
                Icon(
                  Icons.elevator_outlined,
                  color: colorScheme.primary,
                  size: 20,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: DropdownButton<String>(
                    value: _selectedRae,
                    hint: Text(
                      _raes.isEmpty
                          ? 'No hay RAE disponibles'
                          : 'Selecciona un RAE',
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: colorScheme.onSurface.withOpacity(0.5),
                      ),
                    ),
                    icon: Icon(
                      Icons.arrow_drop_down,
                      color: colorScheme.primary,
                    ),
                    isExpanded: true,
                    underline: const SizedBox(),
                    borderRadius: BorderRadius.circular(8),
                    items: _raes.map<DropdownMenuItem<String>>((String value) {
                      return DropdownMenuItem<String>(
                        value: value,
                        child: Text(
                          value,
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: colorScheme.onSurface,
                          ),
                        ),
                      );
                    }).toList(),
                    onChanged: _raes.isEmpty
                        ? null
                        : (String? newValue) {
                            setState(() {
                              _selectedRae = newValue;
                            });
                          },
                  ),
                ),
              ],
            ),
          ),
        ),
        if (_raes.isEmpty && !_isLoading && _errorMessage == null) ...[
          const SizedBox(height: 8),
          Text(
            'No se encontraron RAE disponibles',
            style: theme.textTheme.bodySmall?.copyWith(
              color: colorScheme.error,
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildReportTypeCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required Color primaryColor,
    required Color secondaryColor,
    required bool isEnabled,
    required VoidCallback onTap,
  }) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Opacity(
      opacity: isEnabled ? 1.0 : 0.5,
      child: Material(
        elevation: isEnabled ? 4 : 1,
        borderRadius: BorderRadius.circular(16),
        shadowColor: colorScheme.shadow,
        child: Container(
          decoration: BoxDecoration(
            color: colorScheme.surface,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isEnabled
                  ? colorScheme.outline.withOpacity(0.2)
                  : colorScheme.outline.withOpacity(0.1),
              width: 1,
            ),
          ),
          child: InkWell(
            onTap: isEnabled ? onTap : null,
            borderRadius: BorderRadius.circular(16),
            splashColor: isEnabled ? primaryColor.withOpacity(0.1) : null,
            highlightColor: isEnabled ? primaryColor.withOpacity(0.05) : null,
            child: Container(
              padding: const EdgeInsets.all(24),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: primaryColor.withOpacity(isEnabled ? 0.1 : 0.05),
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: primaryColor.withOpacity(isEnabled ? 0.3 : 0.1),
                        width: 2,
                      ),
                    ),
                    child: Icon(
                      icon,
                      size: 32,
                      color: primaryColor.withOpacity(isEnabled ? 1.0 : 0.4),
                    ),
                  ),

                  const SizedBox(width: 16),

                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: theme.textTheme.titleLarge?.copyWith(
                            color: colorScheme.onSurface.withOpacity(
                              isEnabled ? 1.0 : 0.5,
                            ),
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          subtitle,
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: colorScheme.onSurface.withOpacity(
                              isEnabled ? 0.7 : 0.3,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  Icon(
                    isEnabled
                        ? Icons.arrow_forward_ios_rounded
                        : Icons.lock_outline,
                    size: 20,
                    color: colorScheme.onSurface.withOpacity(
                      isEnabled ? 0.5 : 0.3,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  void _navigateToMaintenanceReport(BuildContext context) {
    if (_selectedRae == null) return;
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => MaintenanceReportPage(rae: _selectedRae!),
      ),
    );
  }

  void _navigateToBreakdownReport(BuildContext context) {
    if (_selectedRae == null) return;
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => IncidentReportPage(rae: _selectedRae!),
      ),
    );
  }
}
