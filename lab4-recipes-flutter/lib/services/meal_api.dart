import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/meal.dart';

class MealApi {
  static const _base = 'https://www.themealdb.com/api/json/v1/1';

  static Future<dynamic> _get(String path) async {
    final res = await http.get(Uri.parse('$_base/$path'));
    if (res.statusCode != 200) {
      throw Exception('Помилка сервера: ${res.statusCode}');
    }
    return jsonDecode(res.body);
  }

  static Future<List<MealCategory>> categories() async {
    final json = await _get('categories.php');
    return (json['categories'] as List).map((e) => MealCategory.fromJson(e)).toList();
  }

  static Future<List<Meal>> byCategory(String category) async {
    final json = await _get('filter.php?c=${Uri.encodeComponent(category)}');
    final list = json['meals'] as List?;
    return list == null ? [] : list.map((e) => Meal.fromJson(e)).toList();
  }

  static Future<List<Meal>> search(String query) async {
    final json = await _get('search.php?s=${Uri.encodeComponent(query)}');
    final list = json['meals'] as List?;
    return list == null ? [] : list.map((e) => Meal.fromJson(e)).toList();
  }

  static Future<Meal> details(String id) async {
    final json = await _get('lookup.php?i=$id');
    return Meal.fromJson(json['meals'][0]);
  }

  static Future<Meal> random() async {
    final json = await _get('random.php');
    return Meal.fromJson(json['meals'][0]);
  }
}
