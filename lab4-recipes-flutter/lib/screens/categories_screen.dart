import 'package:flutter/material.dart';
import '../models/meal.dart';
import '../services/meal_api.dart';
import 'meals_screen.dart';
import 'meal_detail_screen.dart';

class CategoriesScreen extends StatefulWidget {
  const CategoriesScreen({super.key});

  @override
  State<CategoriesScreen> createState() => _CategoriesScreenState();
}

class _CategoriesScreenState extends State<CategoriesScreen> {
  late Future<List<MealCategory>> _future;

  @override
  void initState() {
    super.initState();
    _future = MealApi.categories();
  }

  Future<void> _openRandom() async {
    try {
      final meal = await MealApi.random();
      if (!mounted) return;
      Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => MealDetailScreen(mealId: meal.id, title: meal.name)),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Помилка: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Категорії страв')),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _openRandom,
        icon: const Icon(Icons.casino),
        label: const Text('Випадковий рецепт'),
      ),
      body: FutureBuilder<List<MealCategory>>(
        future: _future,
        builder: (context, snap) {
          if (snap.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snap.hasError) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text('Не вдалося завантажити: ${snap.error}'),
                  const SizedBox(height: 12),
                  FilledButton(
                    onPressed: () => setState(() => _future = MealApi.categories()),
                    child: const Text('Спробувати ще'),
                  ),
                ],
              ),
            );
          }
          final cats = snap.data!;
          return GridView.builder(
            padding: const EdgeInsets.fromLTRB(12, 12, 12, 80),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 1.1,
            ),
            itemCount: cats.length,
            itemBuilder: (context, i) {
              final c = cats[i];
              return InkWell(
                borderRadius: BorderRadius.circular(16),
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => MealsScreen(category: c)),
                ),
                child: Card(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Expanded(child: Padding(
                        padding: const EdgeInsets.all(8),
                        child: Image.network(c.thumb, fit: BoxFit.contain),
                      )),
                      Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: Text(c.name,
                            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
