import 'package:english_words/english_words.dart';
import 'package:flutter/material.dart';
import 'package:front/pages/elevators_page.dart';
import 'package:front/pages/next_maintenances_page.dart';
import 'package:front/pages/report_type_selection_page.dart';
import 'package:provider/provider.dart';
import 'package:front/core/services/dio_service.dart';

import 'pages/communities_page.dart';
import 'pages/login_page.dart';

void main() {
  DioService.onTokenExpired = _redirectToLogin;
  runApp(const MyApp());
}

final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

void _redirectToLogin() {
  WidgetsBinding.instance.addPostFrameCallback((_) {
    navigatorKey.currentState?.pushAndRemoveUntil(
      MaterialPageRoute(builder: (context) => const LoginPage()),
      (route) => false,
    );
  });
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => MyAppState(),
      child: MaterialApp(
        title: 'Sterma App',
        navigatorKey: navigatorKey,
        theme: ThemeData(
          primarySwatch: Colors.blue,
          primaryColor: Colors.blue.shade800,
          hintColor: Colors.orange,
          useMaterial3: true,
          colorScheme: ColorScheme.light(
            primary: Color(0xFF2051E5),
            onPrimary: Color(0xFFFFFFFF),
            secondaryContainer: Color(0xFFEEF2FF),
            secondary: Color(0xFFEEF2FF),
            onSecondary: Color(0xFF240D57),
            tertiary: Color.fromARGB(255, 51, 51, 51),
            onTertiary: Color(0xFFFFFFFF),
          ),
        ),
        home: FutureBuilder<bool>(
          future: DioService().isLoggedIn(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Scaffold(
                body: Center(child: CircularProgressIndicator()),
              );
            }

            final isLoggedIn = snapshot.data ?? false;
            if (!isLoggedIn) {
              return const LoginPage();
            } else {
              return MyHomePage();
            }
          },
        ),
      ),
    );
  }
}

class MyAppState extends ChangeNotifier {
  var current = WordPair.random();

  void getNext() {
    current = WordPair.random();
    notifyListeners();
  }

  var favorites = <WordPair>{};

  void toggleFavorite() {
    if (favorites.contains(current)) {
      favorites.remove(current);
    } else {
      favorites.add(current);
    }
    notifyListeners();
  }
}

class MyHomePage extends StatefulWidget {
  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int selectedIndex = 0;
  final DioService _dioService = DioService();

  final List<String> _pageTitles = [
    'Comunidades',
    'Crear Informe',
    'Ascensores',
  ];

  Future<void> _logout() async {
    await _dioService.logout();
    if (context.mounted) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const LoginPage()),
      );
    }
  }

  void _navigateToNextMaintenances() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const NextMaintenancesPage()),
    );
  }

  @override
  Widget build(BuildContext context) {
    Widget page;
    switch (selectedIndex) {
      case 0:
        page = CommunitiesPage();
      case 1:
        page = ReportTypeSelectionPage();
      case 2:
        page = ElevatorsPage();
      default:
        throw UnimplementedError('No widget for $selectedIndex');
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(
          _pageTitles[selectedIndex],
          style: const TextStyle(color: Colors.white),
        ),
        backgroundColor: Color(0xFF2051E5),
        iconTheme: const IconThemeData(color: Colors.white),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications, color: Colors.white),
            onPressed: _navigateToNextMaintenances,
            tooltip: 'Próximos mantenimientos',
          ),
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white),
            onPressed: _logout,
          ),
        ],
      ),
      body: SafeArea(
        child: Container(
          color: Theme.of(context).colorScheme.primaryContainer,
          child: page,
        ),
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          border: Border(
            top: BorderSide(
              color: Theme.of(context).colorScheme.tertiary.withOpacity(0.2),
              width: 1.0,
            ),
          ),
        ),
        child: NavigationBar(
          selectedIndex: selectedIndex,
          onDestinationSelected: (value) {
            setState(() {
              selectedIndex = value;
            });
          },
          backgroundColor: Theme.of(context).colorScheme.surface,
          indicatorColor: Theme.of(
            context,
          ).colorScheme.secondary.withOpacity(0.2),
          labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
          destinations: const [
            NavigationDestination(icon: Icon(Icons.home), label: 'Comunidades'),
            NavigationDestination(
              icon: Icon(Icons.create),
              label: "Crear informe",
            ),
            NavigationDestination(
              icon: Icon(Icons.elevator),
              label: 'Ascensores',
            ),
          ],
        ),
      ),
    );
  }
}
