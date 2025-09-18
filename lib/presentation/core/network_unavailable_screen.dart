import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:responsive_sizer/responsive_sizer.dart';

import '../../../domain/core/configs/injection.dart';
import '../../../domain/core/constants/string_constants.dart';
import '../../../domain/core/services/navigation_service/navigation_service.dart';

class NetworkUnavailableScreen extends StatefulWidget {
  final String routeName;
  final Map<String, String> queryParams;
  final bool isClearStack;
  final bool isReplace;
  final dynamic arguments;
  final bool isStartRoute;
  const NetworkUnavailableScreen({
    super.key,
    required this.routeName,
    required this.queryParams,
    this.isClearStack = false,
    this.isReplace = false,
    this.isStartRoute = false,
    this.arguments,
  });

  @override
  State<NetworkUnavailableScreen> createState() =>
      _NetworkUnavailableScreenState();
}

class _NetworkUnavailableScreenState extends State<NetworkUnavailableScreen> {
  bool isLoading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Icon(
              Icons.cloud_off,
              color: Colors.grey,
              size: 10.w, // 10% of screen width
            ),
            SizedBox(height: 3.h), // 3% of screen height
            Text(
              NetworkUnavailableScreenConstants.networkUnavailable,
              style: TextStyle(
                fontSize: 18.sp, // 2.5% of screen width for font size
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
            SizedBox(height: 1.h),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 5.w),
              child: Text(
                NetworkUnavailableScreenConstants.pleaseCheckYourInternet,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 15.sp, // 2% of screen width for font size
                  color: Colors.black54,
                ),
              ),
            ),
            SizedBox(height: 2.h),
            ElevatedButton(
              onPressed: () async {
                setState(() {
                  isLoading = true;
                });

                ConnectivityResult connectivityResult =
                    (await Connectivity().checkConnectivity()) as ConnectivityResult;

                await Future.delayed(const Duration(milliseconds: 300));

                bool isNetworkAvailable =
                    connectivityResult != ConnectivityResult.none;

                if (isNetworkAvailable) {
                  // TODO:
                  // if (widget.isStartRoute) {
                  //   AppConfig appConfig = AppConfig.of(context)!;

                  //   AuthRepository authRepository = IAuthRepository(
                  //     appUrl: appConfig.appUrl,
                  //   );

                  //   User? firebaseUser =
                  //       await authRepository.authenticateUser();
                  //   bool isAuthorized = firebaseUser != null;
                  //   ProfileDto? userProfile;

                  //   if (isAuthorized) {
                  //     final res = await authRepository.getLoggedInUser();
                  //     if (res != null) {
                  //       userProfile = res;
                  //     } else {
                  //       isAuthorized = false;
                  //     }
                  //   }
                  //   AppStateNotifier appStateNotifier =
                  //       Provider.of(context, listen: false);

                  //   await appStateNotifier.updateAfterNetworkBack(
                  //       isAuthorized: isAuthorized);
                  //   Future.delayed(const Duration(seconds: 1)).then((value) {
                  //     setState(() {
                  //       isLoading = false;
                  //     });
                  //     if (isAuthorized) {
                  //       if (userProfile != null) {
                  //         navigator<NavigationService>().navigateTo(
                  //             CoreRoutes.homeRoute,
                  //             isClearStack: true);
                  //       } else {
                  //         navigator<NavigationService>().navigateTo(
                  //             AuthRoutes.signInRoute,
                  //             isClearStack: true);
                  //       }
                  //     } else {
                  //       navigator<NavigationService>().navigateTo(
                  //           AuthRoutes.signInRoute,
                  //           isClearStack: true);
                  //     }
                  //   });
                  //   return;
                  // }

                  setState(() {
                    isLoading = false;
                  });
                  navigator<NavigationService>().navigateTo(
                    widget.arguments['routeName'],
                    arguments: widget.arguments['arguments'],
                    queryParams: widget.arguments['queryParams'],
                    isClearStack: widget.arguments['isClearStack'],
                    isReplace: widget.arguments['isReplace'],
                  );
                } else {
                  setState(() {
                    isLoading = false;
                  });

                  Fluttertoast.showToast(
                    msg: NetworkUnavailableScreenConstants.noNetwork,
                  );
                }
              },
              style: ElevatedButton.styleFrom(
                foregroundColor: Colors.white,
                backgroundColor: Colors.blue,
                padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 1.h),
              ),
              child:
                  isLoading
                      ? SizedBox(
                        height: 4.w,
                        width: 4.w,
                        child: const CircularProgressIndicator(strokeWidth: 1),
                      )
                      : Text(
                        NetworkUnavailableScreenConstants.retry,
                        style: TextStyle(fontSize: 14.sp),
                      ),
            ),
          ],
        ),
      ),
    );
  }
}
