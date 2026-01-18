import 'package:flutter/material.dart';
import 'package:front/data/models/maintenance_rule_model.dart';
import 'package:front/pages/maintenance_report_page.dart';

class MaintenanceStep {
  final MaintenanceRule rule;
  bool isCompleted;

  MaintenanceStep({required this.rule, this.isCompleted = false});
}

class MaintenanceChecklistWidget extends StatelessWidget {
  final List<MaintenanceStep> maintenanceSteps;
  final MaintenanceFrequency selectedFrequency;
  final Function(MaintenanceStep) onStepCompleted;

  const MaintenanceChecklistWidget({
    super.key,
    required this.maintenanceSteps,
    required this.selectedFrequency,
    required this.onStepCompleted,
  });

  int get completedStepsCount {
    return maintenanceSteps.where((step) => step.isCompleted).length;
  }

  int get totalStepsCount {
    return maintenanceSteps.length;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Card(
      elevation: 2,
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.checklist, color: colorScheme.primary, size: 24),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Checklist de Mantenimiento - ${_getFrequencyDisplayName(selectedFrequency)}',
                    style: theme.textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w600,
                      color: colorScheme.onSurface,
                    ),
                    overflow: TextOverflow.ellipsis,
                    maxLines: 2,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              'Confirma que se han completado todos los pasos del mantenimiento:',
              style: theme.textTheme.bodyMedium?.copyWith(
                color: colorScheme.onSurface.withOpacity(0.7),
              ),
            ),
            const SizedBox(height: 16),

            // Progreso
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: colorScheme.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                children: [
                  Icon(Icons.task_alt, color: colorScheme.primary, size: 20),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Progreso: $completedStepsCount/$totalStepsCount completados',
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: colorScheme.primary,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Lista de pasos
            ...maintenanceSteps.map(
              (step) => _buildChecklistItem(
                step: step,
                theme: theme,
                colorScheme: colorScheme,
                onStepCompleted: onStepCompleted,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildChecklistItem({
    required MaintenanceStep step,
    required ThemeData theme,
    required ColorScheme colorScheme,
    required Function(MaintenanceStep) onStepCompleted,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: step.isCompleted
            ? colorScheme.primary.withOpacity(0.05)
            : colorScheme.surface,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: step.isCompleted
              ? colorScheme.primary.withOpacity(0.3)
              : colorScheme.outline.withOpacity(0.2),
        ),
      ),
      child: Row(
        children: [
          // Checkbox
          Checkbox(
            value: step.isCompleted,
            onChanged: (bool? value) {
              onStepCompleted(step);
            },
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(4),
            ),
          ),
          const SizedBox(width: 12),
          // Descripción
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  step.rule.name,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: step.isCompleted
                        ? colorScheme.onSurface.withOpacity(0.7)
                        : colorScheme.onSurface,
                    fontWeight: FontWeight.w600,
                    decoration: step.isCompleted
                        ? TextDecoration.lineThrough
                        : null,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  step.rule.description,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: step.isCompleted
                        ? colorScheme.onSurface.withOpacity(0.5)
                        : colorScheme.onSurface.withOpacity(0.7),
                    decoration: step.isCompleted
                        ? TextDecoration.lineThrough
                        : null,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _getFrequencyDisplayName(MaintenanceFrequency frequency) {
    switch (frequency) {
      case MaintenanceFrequency.ANNUAL:
        return 'Anual';
      case MaintenanceFrequency.BIANNUAL:
        return 'Semestral';
      case MaintenanceFrequency.MONTHLY:
        return 'Mensual';
    }
  }
}
