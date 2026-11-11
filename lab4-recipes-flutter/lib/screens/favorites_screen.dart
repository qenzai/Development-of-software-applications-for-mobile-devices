import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/favorites_provider.dart';
import '../widgets/meal_tile.dart';

class FavoritesScreen extends StatelessWidget {
  const FavoritesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final items = context.watch<FavoritesProvider>().items;
    return Scaffold(
      appBar: AppBar(title: Text('Обране (${items.length})')),
      body: items.isEmpty
          ? const Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.favorite_border, size: 64, color: Colors.grey),
                  SizedBox(height: 8),
                  Text('Тут з\'являться ваші улюблені рецепти'),
                ],
              ),
            )
          : ListView.builder(
              itemCount: items.length,
              itemBuilder: (_, i) => MealTile(meal: items[i]),
            ),
    );
  }
}
