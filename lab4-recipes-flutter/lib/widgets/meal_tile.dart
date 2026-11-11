import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/meal.dart';
import '../services/favorites_provider.dart';
import '../screens/meal_detail_screen.dart';

class MealTile extends StatelessWidget {
  final Meal meal;
  const MealTile({super.key, required this.meal});

  @override
  Widget build(BuildContext context) {
    final fav = context.watch<FavoritesProvider>();
    final subtitle = [meal.category, meal.area].where((s) => s != null && s.isNotEmpty).join(' · ');
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      clipBehavior: Clip.antiAlias,
      child: ListTile(
        contentPadding: const EdgeInsets.all(8),
        leading: ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: Image.network(
            '${meal.thumb}/preview',
            width: 64,
            height: 64,
            fit: BoxFit.cover,
            errorBuilder: (_, __, ___) => const Icon(Icons.fastfood, size: 48),
          ),
        ),
        title: Text(meal.name, style: const TextStyle(fontWeight: FontWeight.w600)),
        subtitle: subtitle.isEmpty ? null : Text(subtitle),
        trailing: IconButton(
          icon: Icon(
            fav.isFavorite(meal.id) ? Icons.favorite : Icons.favorite_border,
            color: Colors.red,
          ),
          onPressed: () => fav.toggle(meal),
        ),
        onTap: () => Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => MealDetailScreen(mealId: meal.id, title: meal.name)),
        ),
      ),
    );
  }
}
