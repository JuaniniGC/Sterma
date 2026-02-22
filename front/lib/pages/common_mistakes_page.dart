import 'package:flutter/material.dart';
import 'package:front/core/services/dio_service.dart';
import 'package:front/data/models/common_mistake_model.dart';

class CommonMistakesPage extends StatefulWidget {
  final Function(String)? onMistakeSelected;

  const CommonMistakesPage({super.key, this.onMistakeSelected});

  @override
  State<CommonMistakesPage> createState() => _CommonMistakesPageState();
}

class _CommonMistakesPageState extends State<CommonMistakesPage> {
  final DioService _dioService = DioService();
  List<CommonMistake> _mistakes = [];
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadCommonMistakes();
  }

  Future<void> _loadCommonMistakes() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final mistakes = await _dioService.getCommonMistakes();
      setState(() {
        _mistakes = mistakes;
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
      appBar: AppBar(
        title: const Text('Fallos Comunes'),
        backgroundColor: colorScheme.primary,
        foregroundColor: colorScheme.onPrimary,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadCommonMistakes,
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

    if (_mistakes.isEmpty) {
      return _buildEmptyState();
    }

    return _buildMistakesList();
  }

  Widget _buildLoadingIndicator() {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircularProgressIndicator(),
          SizedBox(height: 16),
          Text('Cargando fallos comunes...'),
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
              'Error al cargar los fallos comunes',
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
              onPressed: _loadCommonMistakes,
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
          Icon(Icons.warning_outlined, size: 64, color: Colors.grey),
          const SizedBox(height: 16),
          const Text(
            'No hay fallos comunes registrados',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          const Text(
            'Contacta con el administrador para agregar fallos comunes',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 16, color: Colors.grey),
          ),
        ],
      ),
    );
  }

  Widget _buildMistakesList() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _mistakes.length,
      itemBuilder: (context, index) {
        final mistake = _mistakes[index];
        return _buildMistakeCard(mistake);
      },
    );
  }

  Widget _buildMistakeCard(CommonMistake mistake) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Card(
      elevation: 2,
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        onTap: () {
          if (widget.onMistakeSelected != null) {
            widget.onMistakeSelected!(mistake.description);
            Navigator.pop(context);
          }
        },
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: colorScheme.primary.withOpacity(0.08),
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Icon(
                    Icons.warning_outlined,
                    color: colorScheme.primary,
                    size: 20,
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      mistake.description,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Código: ${mistake.identificator}',
                      style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                    ),
                  ],
                ),
              ),
              if (widget.onMistakeSelected != null)
                Icon(
                  Icons.arrow_forward_ios,
                  size: 16,
                  color: Colors.grey[400],
                ),
            ],
          ),
        ),
      ),
    );
  }
}
