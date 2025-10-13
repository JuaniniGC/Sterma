import 'dart:ffi';

import 'package:flutter/material.dart';

class CommunitiesPage extends StatelessWidget {
  const CommunitiesPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Comunidades')),
      body: Center(
        child: ListView.builder(
          itemCount: communityList.length,
          itemBuilder: (context, index) {
            final community = communityList[index];
            return CommunityGeneralInfoCard(
              name: community['name'],
              description: community['description'],
              location: community['location'],
              elevatorNumber: community['elevatorNumber'],
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
  final int elevatorNumber;

  const CommunityGeneralInfoCard({
    super.key,
    required this.name,
    required this.description,
    required this.location,
    required this.elevatorNumber,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        print('Card presionada: $name');
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
              const SizedBox(height: 4),
              Text(
                description,
                style: TextStyle(fontSize: 16, color: Colors.grey[600]),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Icon(Icons.location_on, size: 20, color: Colors.grey[600]),
                  const SizedBox(width: 4),
                  Text(
                    location,
                    style: TextStyle(fontSize: 16, color: Colors.grey[600]),
                  ),
                  const Spacer(),
                  Text(
                    elevatorNumber.toString(),
                    style: TextStyle(
                      fontSize: 20,
                      color: Colors.grey[600],
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(width: 6),
                  const Icon(Icons.elevator, size: 26),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

final List<Map<String, dynamic>> communityList = [
  {
    'name': 'Torre A',
    'description': 'Ascensor principal del edificio A',
    'location': 'Calle 123, Ciudad X',
    'elevatorNumber': 1,
  },
  {
    'name': 'Torre B',
    'description': 'Ascensor de servicio del edificio B',
    'location': 'Calle 456, Ciudad Y',
    'elevatorNumber': 2,
  },
  {
    'name': 'Residencial Los Pinos',
    'description': 'Ascensor panorámico con vista al jardín central',
    'location': 'Av. Las Flores 890, Ciudad Z',
    'elevatorNumber': 3,
  },
  {
    'name': 'Condominio Altos del Valle',
    'description': 'Ascensor principal de acceso a los pisos superiores',
    'location': 'Calle del Sol 112, Ciudad Verde',
    'elevatorNumber': 4,
  },
  {
    'name': 'Edificio Central Park',
    'description': 'Ascensor de alta velocidad para oficinas',
    'location': 'Av. Central 500, Ciudad Metrópolis',
    'elevatorNumber': 5,
  },
  {
    'name': 'Torre del Lago',
    'description': 'Ascensor con vista al lago y acceso al mirador',
    'location': 'Camino del Lago 200, Ciudad Azul',
    'elevatorNumber': 6,
  },
  {
    'name': 'Residencias Mirador',
    'description': 'Ascensor de lujo con sistema inteligente',
    'location': 'Calle Panorama 45, Ciudad Blanca',
    'elevatorNumber': 7,
  },
  {
    'name': 'Complejo Industrial Norte',
    'description': 'Ascensor de carga y mantenimiento interno',
    'location': 'Zona Industrial 32, Ciudad Gris',
    'elevatorNumber': 8,
  },
  {
    'name': 'Torre Horizonte',
    'description': 'Ascensor principal para acceso a apartamentos tipo loft',
    'location': 'Av. del Horizonte 720, Ciudad Dorada',
    'elevatorNumber': 9,
  },
  {
    'name': 'Conjunto Jardines del Sol',
    'description': 'Ascensor residencial con acceso restringido por tarjeta',
    'location': 'Calle Amanecer 15, Ciudad Verde',
    'elevatorNumber': 10,
  },
];
