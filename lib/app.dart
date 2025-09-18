import 'dart:io';

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:responsive_sizer/responsive_sizer.dart';
import 'domain/core/configs/app_config.dart';
import 'domain/core/configs/injection.dart';
import 'domain/core/services/navigation_service/navigation_service.dart';
import 'domain/core/services/navigation_service/routers/route_names.dart';
import 'domain/core/services/navigation_service/routers/routing_config.dart';
import 'package:hive/hive.dart';
import 'package:path_provider/path_provider.dart';

class MainApp extends StatelessWidget {
  const MainApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: AppConfig.of(context)!.appTitle,
      debugShowCheckedModeBanner: false,
      locale: Provider.of<AppStateNotifier>(context).locale,
      theme: ThemeData(
        fontFamily: 'Geist',
        scaffoldBackgroundColor: Colors.white,
        primaryColor: Color(0xFF2563EB),
        colorScheme: ThemeData().colorScheme.copyWith(
          primary: const Color(0xFF2563EB),
          tertiary: const Color(0xFF1F2937),
          tertiaryFixed: const Color(0xFF4B5563),
          onTertiary: const Color(0xFF6B7280),
          tertiaryFixedDim: const Color(0xFFD1D5DB),
          onTertiaryFixed: const Color(0xFFF9FAFB),
          tertiaryContainer: Color(0xFFE5E7EB),
          onTertiaryContainer: Color(0xFFF3F4F6),
          onPrimary: const Color(0xFFFFFFFF),
          secondary: const Color(0xFFEF4444),
          secondaryFixed: const Color(0xFF9CA3AF),
          onSecondary: Color(0xFF374151),
          secondaryContainer: Color(0xFFD9D9D9),
          secondaryFixedDim: const Color(0xFFFECACA),
          onSecondaryContainer: Color(0xFF000603),
          errorContainer: const Color(0xFFEA580C),
          outline: const Color(0xFFD1D5DB),
        ),
        textTheme: TextTheme(
          titleLarge: TextStyle(
            fontSize: 26.sp,
            fontWeight: FontWeight.w500,
            fontFamily: 'Geist',
          ),
          titleMedium: TextStyle(
            fontSize: 20.sp,
            fontWeight: FontWeight.w500,
            fontFamily: 'Geist',
          ),
          titleSmall: TextStyle(
            fontSize: 19.sp,
            fontWeight: FontWeight.w800,
            fontFamily: 'Geist',
          ),
          bodyLarge: TextStyle(
            fontSize: 20.sp,
            fontWeight: FontWeight.w500,
            fontFamily: 'Geist',
          ),
          bodyMedium: TextStyle(
            fontSize: 18.sp,
            fontWeight: FontWeight.w500,
            fontFamily: 'Geist',
          ),
          bodySmall: TextStyle(
            fontSize: 14.sp,
            fontWeight: FontWeight.w600,
            fontFamily: 'Geist',
          ),
        ),
        appBarTheme: AppBarTheme(
          color: Color(0xFFFFFFFF),
          foregroundColor: Color(0XFF000000),
        ),
        snackBarTheme: SnackBarThemeData(
          contentTextStyle: TextStyle(
            fontSize: 16.sp,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
      builder: (context, child) {
        return Column(
          children: [
            Expanded(child: child!),
            if (Provider.of<AppStateNotifier>(context).isOffline)
              Material(
                color: Theme.of(context).colorScheme.error,
                child: SafeArea(
                  top: false,
                  left: false,
                  right: false,
                  bottom: Platform.isIOS ? true : false,
                  child: Container(
                    alignment: Alignment.center,
                    width: 100.w,
                    height: 3.h,
                    child: Text(
                      'No Connection',
                      style: TextStyle(
                        color: Theme.of(context).scaffoldBackgroundColor,
                        fontSize: 15.sp,
                      ),
                    ),
                  ),
                ),
              ),
          ],
        );
      },
      navigatorKey: navigator<NavigationService>().navigatorKey,
      onGenerateRoute:
          Provider.of<AppStateNotifier>(context).isAuthorized
              ? authorizedNavigation
              : commonNavigation,
      initialRoute:
          Provider.of<AppStateNotifier>(context).isOffline
              ? GeneralRoutes.noNetworkAtStart
              : Provider.of<AppStateNotifier>(context).isAuthorized
              ? CoreRoutes.mainNavRoute
              : AuthRoutes.authRoute,
      // initialRoute: CoreRoutes.verificationRoute,
    );
  }
}

Future appInitializer(AppConfig appConfig) async {
  Future.delayed(const Duration(seconds: 5)).then((value) => monitorNetwork());
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  final Directory appDocumentDir = await getApplicationDocumentsDirectory();
  Hive.init(appDocumentDir.path);

  final connection = await Connectivity().checkConnectivity();
  bool isOffline = connection == ConnectivityResult.none;


  AppStateNotifier appStateNotifier = AppStateNotifier(
    isOffline: isOffline,
    isAuthorized: false,
  );

  final navKey = GlobalKey<NavigatorState>();

  final AppConfig configuredApp = AppConfig(
    appTitle: appConfig.appTitle,
    buildFlavor: appConfig.buildFlavor,
    appUrl: appConfig.appUrl,
    child: ChangeNotifierProvider<AppStateNotifier>(
      create: (context) {
        return appStateNotifier;
      },
      child: ResponsiveSizer(
        builder: (context, orientation, deviceType) {
          return const MainApp();
        },
      ),
    ),
  );

  setupLocator(navKey, appStateNotifier);
  return runApp(configuredApp);
}

Future<void> monitorNetwork() async {
  Connectivity().onConnectivityChanged.listen((event) {
    try {
      final context = navigator<NavigationService>().getNavContext;
      AppStateNotifier appStateNotifier = Provider.of(context, listen: false);
      appStateNotifier.updateNetworkState(
        isOffline: event == ConnectivityResult.none,
      );
    } catch (error) {
      //
    }
  });
}
