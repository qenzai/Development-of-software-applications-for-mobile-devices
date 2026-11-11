import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/meal.dart';

/// Обрані рецепти, зберігаються на пристрої через shared_preferences
class FavoritesProvider extends ChangeNotifier {
  static const _key = 'favorites';
  final List<Meal> _items = [];

  List<Meal> get items => List.unmodifiable(_items);

  bool isFavorite(String id) => _items.any((m) => m.id == id);

  Future<void> load() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_key);
    if (raw != null) {
      final list = jsonDecode(raw) as List;
      _items
        ..clear()
        ..addAll(list.map((e) => Meal.fromJson(e)));
      notifyListeners();
    }
  }

  Future<void> toggle(Meal meal) async {
    if (isFavorite(meal.id)) {
      _items.removeWhere((m) => m.id == meal.id);
    } else {
      _items.add(meal);
    }
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_key, jsonEncode(_items.map((m) => m.toShortJson()).toList()));
  }
}
