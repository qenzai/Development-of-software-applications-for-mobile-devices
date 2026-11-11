class MealCategory {
  final String name;
  final String thumb;
  final String description;

  MealCategory({required this.name, required this.thumb, required this.description});

  factory MealCategory.fromJson(Map<String, dynamic> json) => MealCategory(
        name: json['strCategory'] ?? '',
        thumb: json['strCategoryThumb'] ?? '',
        description: json['strCategoryDescription'] ?? '',
      );
}

class Ingredient {
  final String name;
  final String measure;
  Ingredient(this.name, this.measure);
}

class Meal {
  final String id;
  final String name;
  final String thumb;
  final String? category;
  final String? area;
  final String? instructions;
  final String? youtube;
  final List<Ingredient> ingredients;

  Meal({
    required this.id,
    required this.name,
    required this.thumb,
    this.category,
    this.area,
    this.instructions,
    this.youtube,
    this.ingredients = const [],
  });

  // API зберігає інгредієнти як strIngredient1..20 / strMeasure1..20
  factory Meal.fromJson(Map<String, dynamic> json) {
    final ingredients = <Ingredient>[];
    for (var i = 1; i <= 20; i++) {
      final name = (json['strIngredient$i'] ?? '').toString().trim();
      final measure = (json['strMeasure$i'] ?? '').toString().trim();
      if (name.isNotEmpty) ingredients.add(Ingredient(name, measure));
    }
    return Meal(
      id: json['idMeal'].toString(),
      name: json['strMeal'] ?? '',
      thumb: json['strMealThumb'] ?? '',
      category: json['strCategory'],
      area: json['strArea'],
      instructions: json['strInstructions'],
      youtube: json['strYoutube'],
      ingredients: ingredients,
    );
  }

  // для збереження в обраному достатньо короткої інформації
  Map<String, dynamic> toShortJson() => {
        'idMeal': id,
        'strMeal': name,
        'strMealThumb': thumb,
        'strCategory': category,
        'strArea': area,
      };
}
