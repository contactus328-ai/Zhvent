import 'package:flutter/material.dart';

class AppStateNotifier extends ChangeNotifier {
  bool isAuthorized;
  bool isOffline;
  Locale? locale;

  AppStateNotifier({
    required this.isAuthorized,
    this.isOffline = false,
    this.locale,
  });

  Future<void> updateAfterAuthChange({required bool isAuthorized}) async {
    this.isAuthorized = isAuthorized;
    notifyListeners();
  }

  Future notifyAll() async {
    notifyListeners();
  }

  Future<void> updateAfterNetworkBack({required bool isAuthorized}) async {
    this.isAuthorized = isAuthorized;
    isOffline = false;
    notifyListeners();
  }

  Future<void> updateNetworkState({required bool isOffline}) async {
    this.isOffline = isOffline;
    notifyListeners();
  }

  Future<void> updateLocale({required Locale locale}) async {
    this.locale = locale;
    notifyListeners();
  }
}

class AppConfig extends InheritedWidget {
  final String appTitle;
  final String buildFlavor;
  final String appUrl;
  @override
  // ignore: overridden_fields
  final Widget child;

  const AppConfig({
    super.key,
    required this.appTitle,
    required this.buildFlavor,
    required this.appUrl,
    required this.child,
  }) : super(child: child);

  static AppConfig? of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<AppConfig>();
  }

  @override
  bool updateShouldNotify(InheritedWidget oldWidget) => false;
}
