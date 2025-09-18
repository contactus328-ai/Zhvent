import 'dart:io';


import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import '../../../../../presentation/auth/auth_screen.dart';
import '../../../../../presentation/core/network_unavailable_screen.dart';
import '../../../../../presentation/main_nav/main_nav_screen.dart';
import '../../../extensions/string_extensions.dart';
import 'route_names.dart';

Route<dynamic> commonNavigation(RouteSettings settings) {
  final routingData = settings.name!.getRoutingData;

  switch (routingData.route) {
    case GeneralRoutes.noNetworkAtStart:
      return _getPageRoute(
        NetworkUnavailableScreen(
          routeName: routingData.route,
          queryParams: routingData.queryParameters,
          arguments: settings.arguments,
          isStartRoute: true,
        ),
        settings,
      );

    case GeneralRoutes.noNetwork:
      return _getPageRoute(
        NetworkUnavailableScreen(
          routeName: routingData.route,
          queryParams: routingData.queryParameters,
          arguments: settings.arguments,
        ),
        settings,
      );

    case AuthRoutes.authRoute:
      return _getPageRoute(const AuthScreen(), settings);

    default:
      return _getPageRoute(
        Container(
          color: Colors.white,
          child: const Center(child: Text('Default Route')),
        ),
        settings,
      );
  }
}

Route<dynamic> authorizedNavigation(RouteSettings settings) {
  final routingData = settings.name!.getRoutingData;
  switch (routingData.route) {
    case CoreRoutes.mainNavRoute:
      return _getPageRoute(const MainNavScreen(), settings);

    default:
      return commonNavigation(settings);
  }
}

PageRoute _getPageRoute(
  Widget child,
  RouteSettings settings, {
  bool mainRoute = false,
}) {
  //return CupertinoRoute(enterPage: child);
  if (Platform.isIOS && !mainRoute) {
    return CupertinoPageRoute(builder: (BuildContext context) => child);
  } else if (Platform.isAndroid && !mainRoute) {
    return MaterialPageRoute(builder: (BuildContext context) => child);
  } else {
    return _FadeRoute(child: child, routeName: settings.name ?? '');
  }
}

class _FadeRoute extends PageRouteBuilder {
  final Widget child;
  final String routeName;
  _FadeRoute({required this.child, required this.routeName})
    : super(
        settings: RouteSettings(name: routeName),
        pageBuilder:
            (
              BuildContext context,
              Animation<double> animation,
              Animation<double> secondaryAnimation,
            ) => child,
        transitionsBuilder:
            (
              BuildContext context,
              Animation<double> animation,
              Animation<double> secondaryAnimation,
              Widget child,
            ) => FadeTransition(opacity: animation, child: child),
      );
}

class CupertinoRoute extends PageRouteBuilder {
  final Widget enterPage;
  CupertinoRoute({required this.enterPage})
    : super(
        pageBuilder: (
          BuildContext context,
          Animation<double> animation,
          Animation<double> secondaryAnimation,
        ) {
          return enterPage;
        },
        transitionsBuilder: (
          BuildContext context,
          Animation<double> animation,
          Animation<double> secondaryAnimation,
          Widget child,
        ) {
          return SlideTransition(
            position: Tween<Offset>(
              begin: const Offset(1.0, 0.0),
              end: Offset.zero,
            ).animate(
              CurvedAnimation(
                parent: animation,
                curve: Curves.linearToEaseOut,
                reverseCurve: Curves.easeInToLinear,
              ),
            ),
            child: enterPage,
          );
        },
      );
}
