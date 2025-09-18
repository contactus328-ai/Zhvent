import 'package:flutter/widgets.dart';
import 'package:hive/hive.dart';

import '../storage_service.dart';

class LanguageStorageService {
  static Future updateLocale({required Locale locale}) async {
    final coreBox = await Hive.openBox(StorageService.coreBox);
    return coreBox.put('selectedLocale', locale);
  }

  static Future<Locale> getLocale() async {
    final coreBox = await Hive.openBox(StorageService.coreBox);
    return coreBox.get('selectedLocale') ?? Locale('en', 'US');
  }
}
