// lib/widgets/google_maps_button.dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:android_intent_plus/android_intent.dart';

class GoogleMapsButton extends StatelessWidget {
  final String address;
  final String? label;
  final bool showIcon;
  final ButtonStyle? style;

  const GoogleMapsButton({
    super.key,
    required this.address,
    this.label,
    this.showIcon = true,
    this.style,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton.icon(
      onPressed: () => _openGoogleMaps(context),
      icon: showIcon
          ? const Icon(Icons.map, size: 18)
          : const SizedBox.shrink(),
      label: Text(label ?? 'Ver en Google Maps'),
      style:
          style ??
          ElevatedButton.styleFrom(
            backgroundColor: Colors.green[700],
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
    );
  }

  Future<void> _openGoogleMaps(BuildContext context) async {
    final encodedAddress = Uri.encodeComponent(address);

    try {
      // Intentar abrir con Android Intent (Google Maps app)
      final intent = AndroidIntent(
        action: 'android.intent.action.VIEW',
        data: 'geo:0,0?q=$encodedAddress',
        package: 'com.google.android.apps.maps',
      );

      await intent.launch();
      // Si llegamos aquí, asumimos que se abrió correctamente
    } catch (e) {
      // Si hay error, intentar con URL en navegador
      await _openInBrowser(context, address);
    }
  }

  Future<void> _openInBrowser(BuildContext context, String address) async {
    final encodedAddress = Uri.encodeComponent(address);
    final url = Uri.parse('https://www.google.com/maps/search/$encodedAddress');

    try {
      if (await canLaunchUrl(url)) {
        await launchUrl(url, mode: LaunchMode.externalApplication);
      } else {
        _showMapsOptions(context, address);
      }
    } catch (e) {
      _showMapsOptions(context, address);
    }
  }

  void _showMapsOptions(BuildContext context, String address) {
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
                  // Si falla, intentar con navegador
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
}
