import 'package:flutter/material.dart';
import 'package:front/core/services/dio_service.dart';
import 'package:front/data/models/maintenance_rule_model.dart';
import 'package:front/pages/maintenance_report_util/maintenance_checklist_widget.dart';

enum MaintenanceFrequency {
  ANNUAL('ANNUAL'),
  BIANNUAL('BIANNUAL'),
  MONTHLY('MONTHLY');

  const MaintenanceFrequency(this.apiValue);
  final String apiValue;

  String get displayName {
    switch (this) {
      case MaintenanceFrequency.ANNUAL:
        return 'Anual';
      case MaintenanceFrequency.BIANNUAL:
        return 'Semestral';
      case MaintenanceFrequency.MONTHLY:
        return 'Mensual';
    }
  }
}

class MaintenanceReportPage extends StatefulWidget {
  final String rae;

  const MaintenanceReportPage({super.key, required this.rae});

  @override
  State<MaintenanceReportPage> createState() => _MaintenanceReportPageState();
}

class _MaintenanceReportPageState extends State<MaintenanceReportPage> {
  final TextEditingController _commentaryController = TextEditingController();

  MaintenanceFrequency _selectedFrequency = MaintenanceFrequency.ANNUAL;
  DateTime _startDateTime = DateTime.now();
  DateTime? _endDateTime;

  bool _isSubmitting = false;
  bool _showChecklist = false;
  bool _isLoadingRules = false;
  String? _rulesError;

  final DioService _dioService = DioService();

  List<MaintenanceStep> _maintenanceSteps = [];

  final List<MaintenanceFrequency> _frequencyOptions = [
    MaintenanceFrequency.ANNUAL,
    MaintenanceFrequency.BIANNUAL,
    MaintenanceFrequency.MONTHLY,
  ];

  Future<void> _selectStartDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _startDateTime,
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
    );
    if (picked != null && picked != _startDateTime) {
      setState(() {
        _startDateTime = DateTime(
          picked.year,
          picked.month,
          picked.day,
          _startDateTime.hour,
          _startDateTime.minute,
        );
      });
    }
  }

  Future<void> _selectStartTime(BuildContext context) async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.fromDateTime(_startDateTime),
    );
    if (picked != null) {
      setState(() {
        _startDateTime = DateTime(
          _startDateTime.year,
          _startDateTime.month,
          _startDateTime.day,
          picked.hour,
          picked.minute,
        );
      });
    }
  }

  Future<void> _selectEndDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _endDateTime ?? _startDateTime,
      firstDate: _startDateTime,
      lastDate: DateTime(2100),
    );
    if (picked != null) {
      setState(() {
        if (_endDateTime == null) {
          _endDateTime = DateTime(
            picked.year,
            picked.month,
            picked.day,
            _startDateTime.hour,
            _startDateTime.minute,
          );
        } else {
          _endDateTime = DateTime(
            picked.year,
            picked.month,
            picked.day,
            _endDateTime!.hour,
            _endDateTime!.minute,
          );
        }
      });
    }
  }

  Future<void> _selectEndTime(BuildContext context) async {
    final DateTime tempDate = _endDateTime ?? _startDateTime;

    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.fromDateTime(tempDate),
    );

    if (picked != null) {
      setState(() {
        if (_endDateTime == null) {
          _endDateTime = DateTime(
            _startDateTime.year,
            _startDateTime.month,
            _startDateTime.day,
            picked.hour,
            picked.minute,
          );
        } else {
          _endDateTime = DateTime(
            _endDateTime!.year,
            _endDateTime!.month,
            _endDateTime!.day,
            picked.hour,
            picked.minute,
          );
        }
      });
    }
  }

  void _clearEndDateTime() {
    setState(() {
      _endDateTime = null;
    });
  }

  Future<void> _loadMaintenanceRules() async {
    setState(() {
      _isLoadingRules = true;
      _rulesError = null;
      _showChecklist = false;
    });

    try {
      final rules = await _dioService.getMaintenanceRules(
        _selectedFrequency.apiValue.toLowerCase(),
      );

      final steps = rules.map((rule) => MaintenanceStep(rule: rule)).toList();

      steps.sort((a, b) => a.rule.orderNum.compareTo(b.rule.orderNum));

      setState(() {
        _maintenanceSteps = steps;
        _showChecklist = true;
        _isLoadingRules = false;
      });
    } catch (e) {
      setState(() {
        _rulesError = e.toString().replaceFirst('Exception: ', '');
        _isLoadingRules = false;
      });
      _showErrorDialog('Error al cargar las reglas de mantenimiento: $e');
    }
  }

  void _onStepCompleted(MaintenanceStep step) {
    setState(() {
      step.isCompleted = !step.isCompleted;
    });
  }

  Future<void> _submitReport() async {
    final allStepsCompleted = _maintenanceSteps.every(
      (step) => step.isCompleted,
    );

    if (!allStepsCompleted) {
      _showErrorDialog(
        'Por favor, completa todos los pasos de mantenimiento antes de enviar el informe',
      );
      return;
    }

    setState(() {
      _isSubmitting = true;
    });

    try {
      await _dioService.createMaintenanceReport(
        maintenanceType: _selectedFrequency.apiValue,
        startDate: _startDateTime,
        endDate: _endDateTime,
        commentary: _commentaryController.text.isEmpty
            ? null
            : _commentaryController.text,
        elevatorRAE: widget.rae,
      );

      _showSuccessDialog();
    } catch (e) {
      _showErrorDialog('Error al crear el informe: $e');
    } finally {
      setState(() {
        _isSubmitting = false;
      });
    }
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Error'),
          content: Text(message),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('OK'),
            ),
          ],
        );
      },
    );
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Éxito'),
          content: const Text(
            'El informe de mantenimiento ha sido creado correctamente.',
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                Navigator.of(context).pop();
              },
              child: const Text('OK'),
            ),
          ],
        );
      },
    );
  }

  String _formatTime(DateTime date) {
    return '${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
  }

  int get _completedStepsCount {
    return _maintenanceSteps.where((step) => step.isCompleted).length;
  }

  int get _totalStepsCount {
    return _maintenanceSteps.length;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: Text('Informe Mantenimiento - ${widget.rae}'),
        backgroundColor: colorScheme.primary,
        foregroundColor: colorScheme.onPrimary,
        elevation: 2,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildRaeInfoCard(),

            const SizedBox(height: 24),

            _buildFrequencyDropdown(),

            const SizedBox(height: 20),

            _buildStartDateTimePicker(context),

            const SizedBox(height: 20),

            _buildEndDateTimePicker(context),

            const SizedBox(height: 24),

            if (!_showChecklist) _buildInitialSection(),

            if (_showChecklist) _buildChecklistSection(),

            if (_isLoadingRules) _buildLoadingIndicator(),

            if (_rulesError != null && !_showChecklist) _buildErrorWidget(),

            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildInitialSection() {
    return Column(
      children: [
        Card(
          elevation: 2,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Icon(Icons.info_outline, color: Colors.blue, size: 24),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Primero carga las reglas de mantenimiento para ${_selectedFrequency.displayName.toLowerCase()}',
                    style: const TextStyle(fontSize: 14, color: Colors.blue),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 20),
        _buildLoadChecklistButton(),
      ],
    );
  }

  Widget _buildChecklistSection() {
    return Column(
      children: [
        MaintenanceChecklistWidget(
          maintenanceSteps: _maintenanceSteps,
          selectedFrequency: _selectedFrequency,
          onStepCompleted: _onStepCompleted,
        ),

        const SizedBox(height: 20),

        _buildCommentaryField(),

        const SizedBox(height: 20),

        _buildSubmitButton(),
      ],
    );
  }

  Widget _buildRaeInfoCard() {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Icon(Icons.elevator, color: colorScheme.primary, size: 24),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                'RAE: ${widget.rae}',
                style: theme.textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFrequencyDropdown() {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Tipo de Mantenimiento *',
          style: theme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.w600,
            color: colorScheme.onSurface,
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
                  Icons.calendar_today,
                  color: colorScheme.primary,
                  size: 20,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: DropdownButton<MaintenanceFrequency>(
                    value: _selectedFrequency,
                    isExpanded: true,
                    underline: const SizedBox(),
                    borderRadius: BorderRadius.circular(8),
                    items: _frequencyOptions
                        .map<DropdownMenuItem<MaintenanceFrequency>>((
                          MaintenanceFrequency frequency,
                        ) {
                          return DropdownMenuItem<MaintenanceFrequency>(
                            value: frequency,
                            child: Text(
                              frequency.displayName,
                              style: theme.textTheme.bodyMedium?.copyWith(
                                color: colorScheme.onSurface,
                              ),
                            ),
                          );
                        })
                        .toList(),
                    onChanged: (MaintenanceFrequency? newValue) {
                      if (newValue != null) {
                        setState(() {
                          _selectedFrequency = newValue;
                          if (_showChecklist) {
                            _showChecklist = false;
                            _maintenanceSteps = [];
                          }
                        });
                      }
                    },
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          'Selecciona el tipo de mantenimiento realizado',
          style: theme.textTheme.bodySmall?.copyWith(
            color: colorScheme.onSurface.withOpacity(0.6),
          ),
        ),
      ],
    );
  }

  Widget _buildStartDateTimePicker(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Fecha y Hora de Inicio *',
          style: theme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.w600,
            color: colorScheme.onSurface,
          ),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: InkWell(
                onTap: () => _selectStartDate(context),
                borderRadius: BorderRadius.circular(8),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: colorScheme.surface,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: colorScheme.outline.withOpacity(0.3),
                    ),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.date_range,
                        color: colorScheme.primary,
                        size: 20,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          '${_startDateTime.day}/${_startDateTime.month}/${_startDateTime.year}',
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: colorScheme.onSurface,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: InkWell(
                onTap: () => _selectStartTime(context),
                borderRadius: BorderRadius.circular(8),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: colorScheme.surface,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: colorScheme.outline.withOpacity(0.3),
                    ),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.access_time,
                        color: colorScheme.primary,
                        size: 20,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          _formatTime(_startDateTime),
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: colorScheme.onSurface,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildEndDateTimePicker(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              'Fecha y Hora de Fin',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w600,
                color: colorScheme.onSurface,
              ),
            ),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: colorScheme.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(4),
                border: Border.all(color: colorScheme.primary.withOpacity(0.3)),
              ),
              child: Text(
                'opcional',
                style: TextStyle(
                  fontSize: 10,
                  color: colorScheme.primary,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: InkWell(
                onTap: () => _selectEndDate(context),
                borderRadius: BorderRadius.circular(8),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: colorScheme.surface,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: _endDateTime == null
                          ? colorScheme.outline.withOpacity(0.3)
                          : colorScheme.primary.withOpacity(0.5),
                    ),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.date_range,
                        color: _endDateTime == null
                            ? colorScheme.onSurface.withOpacity(0.5)
                            : colorScheme.primary,
                        size: 20,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          _endDateTime == null
                              ? 'No especificada'
                              : '${_endDateTime!.day}/${_endDateTime!.month}/${_endDateTime!.year}',
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: _endDateTime == null
                                ? colorScheme.onSurface.withOpacity(0.5)
                                : colorScheme.onSurface,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: InkWell(
                onTap: () => _selectEndTime(context),
                borderRadius: BorderRadius.circular(8),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: colorScheme.surface,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: _endDateTime == null
                          ? colorScheme.outline.withOpacity(0.3)
                          : colorScheme.primary.withOpacity(0.5),
                    ),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.access_time,
                        color: _endDateTime == null
                            ? colorScheme.onSurface.withOpacity(0.5)
                            : colorScheme.primary,
                        size: 20,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          _endDateTime == null
                              ? '--:--'
                              : _formatTime(_endDateTime!),
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: _endDateTime == null
                                ? colorScheme.onSurface.withOpacity(0.5)
                                : colorScheme.onSurface,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            if (_endDateTime != null) ...[
              const SizedBox(width: 8),
              IconButton(
                icon: Icon(Icons.clear, color: colorScheme.error, size: 20),
                onPressed: _clearEndDateTime,
                tooltip: 'Limpiar fecha de fin',
              ),
            ],
          ],
        ),
        const SizedBox(height: 4),
        Text(
          'Campo opcional. Si no se especifica, no se enviará fecha de finalización',
          style: theme.textTheme.bodySmall?.copyWith(
            color: colorScheme.onSurface.withOpacity(0.6),
          ),
        ),
      ],
    );
  }

  Widget _buildCommentaryField() {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Comentario del Mantenimiento',
          style: theme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.w600,
            color: colorScheme.onSurface,
          ),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _commentaryController,
          maxLines: 4,
          decoration: InputDecoration(
            hintText:
                'Comentarios adicionales sobre el mantenimiento (opcional)...',
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(
                color: colorScheme.outline.withOpacity(0.3),
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(color: colorScheme.primary, width: 2),
            ),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          'Este campo es opcional',
          style: theme.textTheme.bodySmall?.copyWith(
            color: colorScheme.onSurface.withOpacity(0.6),
          ),
        ),
      ],
    );
  }

  Widget _buildLoadChecklistButton() {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: _isLoadingRules ? null : _loadMaintenanceRules,
        style: ElevatedButton.styleFrom(
          backgroundColor: colorScheme.primary,
          foregroundColor: colorScheme.onPrimary,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 2,
        ),
        child: _isLoadingRules
            ? const SizedBox(
                height: 20,
                width: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                ),
              )
            : const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.checklist, size: 20),
                  SizedBox(width: 8),
                  Text(
                    'Cargar Checklist de Mantenimiento',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                  ),
                ],
              ),
      ),
    );
  }

  Widget _buildSubmitButton() {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    final allStepsCompleted = _maintenanceSteps.every(
      (step) => step.isCompleted,
    );
    final isReadyToSubmit = allStepsCompleted;

    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: _isSubmitting
            ? null
            : (isReadyToSubmit ? _submitReport : null),
        style: ElevatedButton.styleFrom(
          backgroundColor: isReadyToSubmit
              ? colorScheme.primary
              : colorScheme.onSurface.withOpacity(0.3),
          foregroundColor: isReadyToSubmit
              ? colorScheme.onPrimary
              : colorScheme.onSurface.withOpacity(0.5),
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 2,
        ),
        child: _isSubmitting
            ? const SizedBox(
                height: 20,
                width: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                ),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(isReadyToSubmit ? Icons.send : Icons.warning, size: 20),
                  const SizedBox(width: 8),
                  Text(
                    isReadyToSubmit
                        ? 'Enviar Informe'
                        : 'Completa todos los pasos del checklist',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
      ),
    );
  }

  Widget _buildLoadingIndicator() {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            SizedBox(
              height: 20,
              width: 20,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: colorScheme.primary,
              ),
            ),
            const SizedBox(width: 12),
            Text(
              'Cargando reglas de mantenimiento...',
              style: theme.textTheme.bodyMedium?.copyWith(
                color: colorScheme.onSurface,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildErrorWidget() {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Card(
      elevation: 2,
      color: colorScheme.errorContainer,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              children: [
                Icon(Icons.error_outline, color: colorScheme.error, size: 20),
                const SizedBox(width: 8),
                Text(
                  'Error al cargar las reglas',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: colorScheme.onErrorContainer,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              _rulesError ?? 'Error desconocido',
              style: theme.textTheme.bodySmall?.copyWith(
                color: colorScheme.onErrorContainer,
              ),
            ),
            const SizedBox(height: 12),
            ElevatedButton.icon(
              onPressed: _loadMaintenanceRules,
              icon: Icon(Icons.refresh, size: 16, color: colorScheme.onPrimary),
              label: Text(
                'Reintentar',
                style: TextStyle(color: colorScheme.onPrimary),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: colorScheme.error,
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 8,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
