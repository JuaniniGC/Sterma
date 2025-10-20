import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:front/utils/token_helper.dart';
import 'package:http/http.dart' as http;

class CommunitiesPage extends StatefulWidget {
  const CommunitiesPage({super.key});

  @override
  State<CommunitiesPage> createState() => _CommunitiesPageState();
}

class _CommunitiesPageState extends State<CommunitiesPage> {
  List<dynamic> communityList = [];
  bool isLoading = true;
  String? errorMessage;

  @override
  void initState() {
    super.initState();
    fetchCommunities();
  }

  Future<void> fetchCommunities() async {
    try {
      final token = await getToken();
      if (token == null) {
        setState(() {
          errorMessage = 'No se encontró token de autenticación.';
          isLoading = false;
        });
        return;
      }
      final response = await http.get(
        Uri.parse('http://10.0.2.2:8080/community'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);

        final List<dynamic> data = jsonResponse['content'] ?? [];

        setState(() {
          communityList = data;
          isLoading = false;
        });
      } else {
        print(
          'Error en la respuesta: ${response.statusCode} - ${response.body}',
        );
        setState(() {
          errorMessage =
              'Error al obtener comunidades (Código: ${response.statusCode})';
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        errorMessage = 'Error de conexión: $e';
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    if (errorMessage != null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Comunidades')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                errorMessage!,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 16, color: Colors.red),
              ),
              const SizedBox(height: 20),
              ElevatedButton.icon(
                onPressed: () {
                  setState(() {
                    isLoading = true;
                    errorMessage = null;
                  });
                  fetchCommunities(); // 🔄 vuelve a intentar la carga
                },
                icon: const Icon(Icons.refresh),
                label: const Text('Reintentar'),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Comunidades')),
      body: RefreshIndicator(
        onRefresh: fetchCommunities,
        child: ListView.builder(
          itemCount: communityList.length,
          itemBuilder: (context, index) {
            final community = communityList[index];
            final localization = community['localization'] ?? {};
            final leaderInfo = community['communityLeaderInfo'] ?? {};

            final location =
                "${localization['street'] ?? ''}, ${localization['city'] ?? ''} (${localization['postalCode'] ?? ''})";

            return CommunityGeneralInfoCard(
              name: community['name'] ?? 'Sin nombre',
              description: community['description'] ?? '',
              location: location,
              leaderName: leaderInfo['communityLeaderName'] ?? 'Sin líder',
              leaderPhone:
                  leaderInfo['communityLeaderTelephone']?.toString() ?? '',
              leaderNote: leaderInfo['communityLeaderNote'] ?? '',
              cif: community['cif'] ?? '',
            );
          },
        ),
      ),
    );
  }
}

class CommunityGeneralInfoCard extends StatelessWidget {
  final String name;
  final String description;
  final String location;
  final String leaderName;
  final String leaderPhone;
  final String leaderNote;
  final String cif;

  const CommunityGeneralInfoCard({
    super.key,
    required this.name,
    required this.description,
    required this.location,
    required this.leaderName,
    required this.leaderPhone,
    required this.leaderNote,
    required this.cif,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        print('Comunidad seleccionada: $name');
      },
      borderRadius: BorderRadius.circular(12),
      child: Card(
        elevation: 4,
        margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                name,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                description,
                style: TextStyle(fontSize: 16, color: Colors.grey[700]),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(
                    Icons.location_on,
                    size: 20,
                    color: Colors.blueGrey,
                  ),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      location,
                      style: const TextStyle(
                        fontSize: 14,
                        color: Colors.black54,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.person, size: 20, color: Colors.teal),
                  const SizedBox(width: 4),
                  Text(leaderName, style: const TextStyle(fontSize: 14)),
                  const SizedBox(width: 8),
                  Text(
                    '(${leaderNote})',
                    style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  const Icon(Icons.phone, size: 18, color: Colors.green),
                  const SizedBox(width: 4),
                  Text(leaderPhone),
                  const Spacer(),
                  Text(
                    'CIF: $cif',
                    style: const TextStyle(fontSize: 13, color: Colors.grey),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
