

import '../../constants/string_constants.dart';

class GenericHelpers {

  bool isValidEmail(String email) {
    final emailRegex =
        RegExp(r'^[\w\.-]+(\+\w+)?@[a-zA-Z\d\.-]+(\.[a-zA-Z]{2,})+$');

    return emailRegex.hasMatch(email);
  }

  static String getErrorPasswordMessage(String password) {
    if (password.length < 8) {
      return ErrorConstants.enterValidPassword;
    }
    if (!RegExp(r'(?=.*[A-Z])').hasMatch(password)) {
      return ErrorConstants.enterUpperCase;
    }
    if (!RegExp(r'(?=.*[0-9])').hasMatch(password)) {
      return ErrorConstants.enterDigit;
    }
    if (!RegExp(r'(?=.*[!@#\$%\^&\*\(\)\-_\+=\[\]\{\}\|;:"<>,./?])')
        .hasMatch(password)) {
      return ErrorConstants.enterSpecialChar;
    }
    return '';
  }

}