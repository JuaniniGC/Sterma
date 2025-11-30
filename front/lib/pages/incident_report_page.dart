import 'package:flutter/material.dart';
import 'package:front/core/services/dio_service.dart';

class IncidentReportPage extends StatefulWidget {
  final String rae;

  const IncidentReportPage({super.key, required this.rae});

  @override
  State<IncidentReportPage> createState() => _IncidentReportPageState();
}

class _IncidentReportPageState extends State<IncidentReportPage> {
  final TextEditingController _commentaryController = TextEditingController();
  final DioService _dioService = DioService();

  DateTime _startDate = DateTime.now();
  DateTime? _endDate;

  bool _isSubmitting = false;

  Future<void> _selectStartDate(BuildContext context) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _startDate,
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
    );
    if (picked != null) {
      setState(() {
        _startDate = DateTime(
          picked.year,
          picked.month,
          picked.day,
          _startDate.hour,
          _startDate.minute,
        );
      });
    }
  }

  Future<void> _selectStartTime(BuildContext context) async {
    final picked = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.fromDateTime(_startDate),
    );
    if (picked != null) {
      setState(() {
        _startDate = DateTime(
          _startDate.year,
          _startDate.month,
          _startDate.day,
          picked.hour,
          picked.minute,
        );
      });
    }
  }

  Future<void> _selectEndDate(BuildContext context) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _endDate ?? DateTime.now(),
      firstDate: _startDate,
      lastDate: DateTime(2100),
    );
    if (picked != null) {
      setState(() {
        _endDate = DateTime(
          picked.year,
          picked.month,
          picked.day,
          _endDate?.hour ?? DateTime.now().hour,
          _endDate?.minute ?? DateTime.now().minute,
        );
      });
    }
  }

  Future<void> _selectEndTime(BuildContext context) async {
    final picked = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.fromDateTime(_endDate ?? DateTime.now()),
    );
    if (picked != null) {
      setState(() {
        _endDate = DateTime(
          _endDate!.year,
          _endDate!.month,
          _endDate!.day,
          picked.hour,
          picked.minute,
        );
      });
    }
  }

  Future<void> _submitReport() async {
    setState(() => _isSubmitting = true);

    try {
      // Usar fecha y hora actual como endDate si no se especifica
      final endDate = _endDate ?? DateTime.now();

      await _dioService.createIncidentReport(
        startDate: _startDate,
        endDate: endDate,
        commentary: _commentaryController.text.isEmpty
            ? null
            : _commentaryController.text,
        elevatorRAE: widget.rae,
      );

      _showSuccess();
    } catch (e) {
      _showError('Error al crear el informe: $e');
    } finally {
      setState(() => _isSubmitting = false);
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Theme.of(context).colorScheme.error,
      ),
    );
  }

  void _showSuccess() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Informe de avería creado correctamente'),
        backgroundColor: Theme.of(context).colorScheme.primary,
      ),
    );
    Navigator.pop(context);
  }

  void _clearEndDate() {
    setState(() => _endDate = null);
  }

  String _formatTime(DateTime date) {
    return '${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: Text('Avería - ${widget.rae}'),
        backgroundColor: colorScheme.primary,
        foregroundColor: colorScheme.onPrimary,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Card(
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
            ),

            const SizedBox(height: 20),

            // Fecha y hora de inicio
            _buildDateTimePicker(
              title: 'Fecha y Hora de Inicio *',
              date: _startDate,
              onDateTap: () => _selectStartDate(context),
              onTimeTap: () => _selectStartTime(context),
            ),

            const SizedBox(height: 16),

            // Fecha y hora de fin (opcional)
            _buildDateTimePicker(
              title: 'Fecha y Hora de Fin (opcional)',
              date: _endDate,
              onDateTap: () => _selectEndDate(context),
              onTimeTap: () => _selectEndTime(context),
              isOptional: true,
              onClear: _clearEndDate,
            ),

            const SizedBox(height: 20),

            // Comentario
            TextField(
              controller: _commentaryController,
              maxLines: 5,
              decoration: InputDecoration(
                labelText: 'Descripción de la avería (opcional)',
                border: OutlineInputBorder(),
                alignLabelWithHint: true,
                focusedBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: colorScheme.primary, width: 2),
                ),
              ),
            ),

            const SizedBox(height: 8),
            Text(
              'Describe el problema, síntomas y cualquier observación relevante',
              style: TextStyle(
                color: colorScheme.onSurface.withOpacity(0.6),
                fontSize: 12,
              ),
            ),

            const Spacer(),

            // Botón de envío
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isSubmitting ? null : _submitReport,
                style: ElevatedButton.styleFrom(
                  backgroundColor: colorScheme.primary,
                  foregroundColor: colorScheme.onPrimary,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: _isSubmitting
                    ? SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(
                            colorScheme.onPrimary,
                          ),
                        ),
                      )
                    : Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.report_problem, size: 20),
                          const SizedBox(width: 8),
                          Text(
                            'Crear Informe de Avería',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDateTimePicker({
    required String title,
    required DateTime? date,
    required VoidCallback onDateTap,
    required VoidCallback onTimeTap,
    bool isOptional = false,
    VoidCallback? onClear,
  }) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              title,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: colorScheme.onSurface,
              ),
            ),
            if (isOptional)
              Text(
                ' (opcional)',
                style: TextStyle(color: colorScheme.onSurface.withOpacity(0.6)),
              ),
          ],
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            // Selector de fecha
            Expanded(
              child: InkWell(
                onTap: onDateTap,
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    border: Border.all(
                      color: date == null
                          ? colorScheme.outline.withOpacity(0.3)
                          : colorScheme.primary.withOpacity(0.5),
                    ),
                    borderRadius: BorderRadius.circular(8),
                    color: colorScheme.surface,
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.calendar_today,
                        color: date == null
                            ? colorScheme.onSurface.withOpacity(0.5)
                            : colorScheme.primary,
                        size: 20,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          date == null
                              ? 'No especificada'
                              : '${date!.day}/${date!.month}/${date!.year}',
                          style: TextStyle(
                            color: date == null
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
            // Selector de hora
            Expanded(
              child: InkWell(
                onTap: date == null ? null : onTimeTap,
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    border: Border.all(
                      color: date == null
                          ? colorScheme.outline.withOpacity(0.3)
                          : colorScheme.primary.withOpacity(0.5),
                    ),
                    borderRadius: BorderRadius.circular(8),
                    color: colorScheme.surface,
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.access_time,
                        color: date == null
                            ? colorScheme.onSurface.withOpacity(0.5)
                            : colorScheme.primary,
                        size: 20,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          date == null ? '--:--' : _formatTime(date!),
                          style: TextStyle(
                            color: date == null
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
            if (isOptional && date != null) ...[
              const SizedBox(width: 12),
              IconButton(
                icon: Icon(Icons.clear, color: colorScheme.error, size: 20),
                onPressed: onClear,
              ),
            ],
          ],
        ),
        if (isOptional && date == null) ...[
          const SizedBox(height: 4),
          Text(
            'Si no se especifica, se usará la fecha y hora actual',
            style: TextStyle(
              color: colorScheme.onSurface.withOpacity(0.6),
              fontSize: 12,
            ),
          ),
        ],
      ],
    );
  }
}
