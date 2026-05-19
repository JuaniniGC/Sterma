import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:front/core/services/dio_service.dart';
import 'package:front/pages/common_mistakes_page.dart';
import 'dart:io';

class IncidentReportPage extends StatefulWidget {
  final String rae;

  const IncidentReportPage({super.key, required this.rae});

  @override
  State<IncidentReportPage> createState() => _IncidentReportPageState();
}

class _IncidentReportPageState extends State<IncidentReportPage> {
  final TextEditingController _commentaryController = TextEditingController();
  final DioService _dioService = DioService();
  final ImagePicker _imagePicker = ImagePicker();

  DateTime _startDate = DateTime.now();
  DateTime? _endDate;

  bool _isSubmitting = false;
  List<XFile> _selectedImages = [];

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

  void _navigateToCommonMistakes() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => CommonMistakesPage(
          onMistakeSelected: (description) {
            setState(() {
              if (_commentaryController.text.isNotEmpty) {
                _commentaryController.text += '\n\n$description';
              } else {
                _commentaryController.text = description;
              }
            });
          },
        ),
      ),
    );
  }

  Future<void> _pickImages() async {
    final List<XFile>? images = await _imagePicker.pickMultiImage(
      imageQuality: 85,
      maxWidth: 1024,
      maxHeight: 1024,
    );

    if (images != null && images.isNotEmpty) {
      setState(() {
        _selectedImages.addAll(images);
      });
    }
  }

  Future<void> _removeImage(int index) async {
    setState(() {
      _selectedImages.removeAt(index);
    });
  }

  Future<void> _submitReport() async {
    setState(() => _isSubmitting = true);

    try {
      final endDate = _endDate;

      final response = await _dioService.createIncidentReport(
        startDate: _startDate,
        endDate: endDate,
        commentary: _commentaryController.text.isEmpty
            ? null
            : _commentaryController.text,
        elevatorRAE: widget.rae,
      );

      final int reportId = response['id'];

      if (_selectedImages.isNotEmpty) {
        int uploadedImages = 0;
        int failedImages = 0;

        for (var image in _selectedImages) {
          try {
            final bytes = await image.readAsBytes();
            await _dioService.uploadIncidentImageFromBytes(
              reportId,
              bytes,
              image.name,
            );
            uploadedImages++;
          } catch (e) {
            failedImages++;
            print('Error al subir imagen ${image.name}: $e');
          }
        }

        if (failedImages > 0) {
          _showInfo(
            'Informe creado con ${uploadedImages} imágenes subidas correctamente. '
            '$failedImages imágenes no se pudieron subir.',
          );
        }
      }

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

  void _showInfo(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Theme.of(context).colorScheme.primary,
      ),
    );
  }

  void _showSuccess() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Informe de avería creado correctamente'),
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
        actions: [
          IconButton(
            icon: const Icon(Icons.add_photo_alternate),
            onPressed: _pickImages,
            tooltip: 'Añadir imágenes',
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
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

            const SizedBox(height: 16),

            if (_selectedImages.isNotEmpty) ...[
              _buildSelectedImagesSection(),
              const SizedBox(height: 16),
            ],

            _buildDateTimePicker(
              title: 'Fecha y Hora de Inicio *',
              date: _startDate,
              onDateTap: () => _selectStartDate(context),
              onTimeTap: () => _selectStartTime(context),
            ),

            const SizedBox(height: 16),

            _buildDateTimePicker(
              title: 'Fecha y Hora de Fin',
              date: _endDate,
              onDateTap: () => _selectEndDate(context),
              onTimeTap: () => _selectEndTime(context),
              isOptional: true,
              onClear: _clearEndDate,
            ),

            const SizedBox(height: 16),

            OutlinedButton.icon(
              onPressed: _pickImages,
              icon: const Icon(Icons.add_photo_alternate),
              label: Text(
                _selectedImages.isEmpty
                    ? 'Añadir imágenes (opcional)'
                    : 'Añadir más imágenes',
              ),
              style: OutlinedButton.styleFrom(
                foregroundColor: colorScheme.primary,
                side: BorderSide(color: colorScheme.primary),
                padding: const EdgeInsets.symmetric(vertical: 12),
                minimumSize: const Size(double.infinity, 0),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),

            const SizedBox(height: 8),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4),
              child: Text(
                'Puedes añadir varias fotos del incidente',
                style: TextStyle(
                  color: colorScheme.onSurface.withOpacity(0.6),
                  fontSize: 12,
                ),
                textAlign: TextAlign.center,
              ),
            ),

            const SizedBox(height: 16),

            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: _navigateToCommonMistakes,
                icon: const Icon(Icons.list_alt, size: 20),
                label: const Text('Ver fallos comunes'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: colorScheme.primary,
                  side: BorderSide(color: colorScheme.primary),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
              ),
            ),

            const SizedBox(height: 4),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4),
              child: Text(
                'Selecciona un fallo común para agregarlo a la descripción',
                style: TextStyle(
                  color: colorScheme.onSurface.withOpacity(0.6),
                  fontSize: 12,
                ),
                textAlign: TextAlign.center,
              ),
            ),

            const SizedBox(height: 16),

            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Descripción de la avería',
                  style: TextStyle(
                    fontWeight: FontWeight.w500,
                    color: colorScheme.onSurface,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '(opcional)',
                  style: TextStyle(
                    color: colorScheme.onSurface.withOpacity(0.6),
                    fontSize: 12,
                  ),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: _commentaryController,
                  maxLines: 4,
                  decoration: InputDecoration(
                    hintText:
                        'Describe el problema, síntomas y observaciones...',
                    border: const OutlineInputBorder(),
                    alignLabelWithHint: true,
                    focusedBorder: OutlineInputBorder(
                      borderSide: BorderSide(
                        color: colorScheme.primary,
                        width: 2,
                      ),
                    ),
                    contentPadding: const EdgeInsets.all(12),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),

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
                            _selectedImages.isNotEmpty
                                ? 'Crear Informe con ${_selectedImages.length} foto${_selectedImages.length > 1 ? 's' : ''}'
                                : 'Crear Informe de Avería',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildSelectedImagesSection() {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Container(
      decoration: BoxDecoration(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: colorScheme.outline.withOpacity(0.3)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.photo_library, size: 20, color: colorScheme.primary),
                const SizedBox(width: 8),
                Text(
                  'Imágenes seleccionadas (${_selectedImages.length})',
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    color: colorScheme.onSurface,
                  ),
                ),
                const Spacer(),
                TextButton(
                  onPressed: () {
                    setState(() {
                      _selectedImages.clear();
                    });
                  },
                  child: const Text('Limpiar todas'),
                ),
              ],
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 100,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: _selectedImages.length,
                itemBuilder: (context, index) {
                  final image = _selectedImages[index];
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: Stack(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Image.file(
                            File(image.path),
                            width: 100,
                            height: 100,
                            fit: BoxFit.cover,
                          ),
                        ),
                        Positioned(
                          top: 4,
                          right: 4,
                          child: InkWell(
                            onTap: () => _removeImage(index),
                            child: Container(
                              decoration: BoxDecoration(
                                color: Colors.black.withOpacity(0.6),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(
                                Icons.close,
                                size: 20,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                },
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
                fontWeight: FontWeight.w500,
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
            Expanded(
              child: InkWell(
                onTap: onDateTap,
                child: Container(
                  padding: const EdgeInsets.all(14),
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
                      const SizedBox(width: 10),
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
            const SizedBox(width: 10),
            Expanded(
              child: InkWell(
                onTap: date == null ? null : onTimeTap,
                child: Container(
                  padding: const EdgeInsets.all(14),
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
                      const SizedBox(width: 10),
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
              const SizedBox(width: 10),
              IconButton(
                icon: Icon(Icons.clear, color: colorScheme.error, size: 18),
                padding: const EdgeInsets.all(8),
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
