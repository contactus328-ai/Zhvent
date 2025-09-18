import 'package:flutter/services.dart';

import '../services/navigation_service/routers/routing_dto.dart';

extension StringExtension on String {
  RoutingDto get getRoutingData {
    final uriData = Uri.parse(this);
    return RoutingDto(
      queryParameters: uriData.queryParameters,
      route: uriData.path,
    );
  }

  String get getContentTypeImage {
    switch (toLowerCase()) {
      case 'jpe':
        return 'jpeg';
      case 'jpg':
        return 'jpeg';
      case 'jpeg':
        return 'jpeg';
      case 'heic':
        return 'heic';
      default:
        return toLowerCase();
    }
  }

  String toCapitalized() =>
      length > 0 ? '${this[0].toUpperCase()}${substring(1).toLowerCase()}' : '';

  String toTitleCase() => replaceAll(RegExp(' +'), ' ').split(' ').map((str) {
        if (str == str.toUpperCase()) {
          return str;
        }
        return str.toCapitalized();
      }).join(' ');

  String makeTitleCase() {
    if (isEmpty) {
      return '';
    }
    return split(' ')
        .map((word) => word.isNotEmpty
            ? '${word[0].toUpperCase()}${word.substring(1).toLowerCase()}'
            : '')
        .join(' ');
  }

  String toCamelCase() {
    return split(' ').map((String word) {
      if (word.isNotEmpty) {
        return word.substring(0, 1).toLowerCase() + word.substring(1);
      }
      return '';
    }).join();
  }
}

class CapitalizeText extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
      TextEditingValue oldValue, TextEditingValue newValue) {
    return newValue.copyWith(text: newValue.text.toTitleCase());
  }
}
