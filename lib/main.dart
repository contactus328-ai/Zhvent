import 'app.dart';
import 'domain/core/configs/app_config.dart';
import 'package:flutter/material.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final appConfig = AppConfig(
    appTitle: 'BoilerPlateExample',
    buildFlavor: 'dev',
    appUrl: '',
    child: Container(),
  );
  appInitializer(appConfig);
}
