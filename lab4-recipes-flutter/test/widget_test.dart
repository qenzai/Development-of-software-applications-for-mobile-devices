import 'package:flutter_test/flutter_test.dart';
import 'package:recipes_app/models/meal.dart';

void main() {
  test('Meal.fromJson збирає інгредієнти', () {
    final meal = Meal.fromJson({
      'idMeal': '1',
      'strMeal': 'Test',
      'strMealThumb': 'x',
      'strIngredient1': 'Salt',
      'strMeasure1': '1 tsp',
      'strIngredient2': '',
      'strMeasure2': '',
    });
    expect(meal.ingredients.length, 1);
    expect(meal.ingredients.first.name, 'Salt');
  });
}
