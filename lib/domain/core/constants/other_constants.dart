import 'package:flutter/material.dart';

class OtherConstants {
  static String termsOfUseLink =
      'https://www.talentobee.com/en/terms-of-service';
  static String privacyStatementLink =
      'https://www.talentobee.com/en/privacy-policy';

static List<BoxShadow> customDarkShadow = [
    BoxShadow(
      color: const Color(0xff000000).withOpacity(0.09),
      spreadRadius: 3,
      blurRadius: 28,
    ),
  ];
  static List<BoxShadow> customShadow = [
    BoxShadow(
      color: const Color(0xff000000).withOpacity(0.05),
      spreadRadius: 3,
      blurRadius: 28,
    ),
  ];
  static List<BoxShadow> lightCustomShadow = [
    BoxShadow(
      color: const Color(0xff000000).withOpacity(0.02),
      spreadRadius: 3,
      blurRadius: 6,
    ),
  ];

  static List<BoxShadow> customBottomShadow = [
    BoxShadow(
      color: const Color(0xff000000).withOpacity(0.05),
      spreadRadius: 3,
      blurRadius: 28,
      offset: Offset(0, 4),
    ),
  ];

    static List<String> statusType = ['AVAILABLE', 'AWAY','OFFLINE'];

}
