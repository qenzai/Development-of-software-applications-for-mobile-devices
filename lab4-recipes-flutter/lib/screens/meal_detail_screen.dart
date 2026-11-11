import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/meal.dart';
import '../services/meal_api.dart';
import '../services/favorites_provider.dart';

class MealDetailScreen extends StatefulWidget {
  final String mealId;
  final String title;
  const MealDetailScreen({super.key, required this.mealId, required this.title});

  @override
  State<MealDetailScreen> createState() => _MealDetailScreenState();
}

class _MealDetailScreenState extends State<MealDetailScreen> {
  late Future<Meal> _future;
  int _servings = 1; // просто для інтерфейсу: множник порцій

  @override
  void initState() {
    super.initState();
    _future = MealApi.details(widget.mealId);
  }

  Future<void> _openVideo(String url) async {
    final ok = await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
    if (!ok && mounted) {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('Не вдалося відкрити відео')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final fav = context.watch<FavoritesProvider>();
    return Scaffold(
      body: FutureBuilder<Meal>(
        future: _future,
        builder: (context, snap) {
          if (snap.connectionState != ConnectionState.done) {
            return Scaffold(
              appBar: AppBar(title: Text(widget.title)),
              body: const Center(child: CircularProgressIndicator()),
            );
          }
          if (snap.hasError) {
            return Scaffold(
              appBar: AppBar(title: Text(widget.title)),
              body: Center(child: Text('Помилка: ${snap.error}')),
            );
          }
          final meal = snap.data!;
          return CustomScrollView(
            slivers: [
              SliverAppBar(
                expandedHeight: 280,
                pinned: true,
                actions: [
                  IconButton(
                    icon: Icon(fav.isFavorite(meal.id) ? Icons.favorite : Icons.favorite_border),
                    onPressed: () => fav.toggle(meal),
                  ),
                ],
                flexibleSpace: FlexibleSpaceBar(
                  title: Text(
                    meal.name,
                    style: const TextStyle(
                      color: Colors.white,
                      shadows: [Shadow(blurRadius: 6, color: Colors.black)],
                    ),
                  ),
                  background: Image.network(meal.thumb, fit: BoxFit.cover),
                ),
              ),
              SliverPadding(
                padding: const EdgeInsets.all(16),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    Wrap(
                      spacing: 8,
                      children: [
                        if (meal.category != null) Chip(label: Text(meal.category!)),
                        if (meal.area != null) Chip(label: Text(meal.area!)),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Text('Інгредієнти', style: Theme.of(context).textTheme.titleLarge),
                        const Spacer(),
                        IconButton(
                          onPressed: _servings > 1 ? () => setState(() => _servings--) : null,
                          icon: const Icon(Icons.remove_circle_outline),
                        ),
                        Text('x$_servings'),
                        IconButton(
                          onPressed: _servings < 10 ? () => setState(() => _servings++) : null,
                          icon: const Icon(Icons.add_circle_outline),
                        ),
                      ],
                    ),
                    ...meal.ingredients.map((ing) => ListTile(
                          dense: true,
                          leading: Image.network(
                            'https://www.themealdb.com/images/ingredients/${Uri.encodeComponent(ing.name)}-Small.png',
                            width: 36,
                            errorBuilder: (_, __, ___) => const Icon(Icons.kitchen),
                          ),
                          title: Text(ing.name),
                          trailing: Text(_servings == 1 ? ing.measure : '${ing.measure} ×$_servings'),
                        )),
                    const SizedBox(height: 16),
                    Text('Приготування', style: Theme.of(context).textTheme.titleLarge),
                    const SizedBox(height: 8),
                    Text(meal.instructions ?? '', style: const TextStyle(fontSize: 15, height: 1.5)),
                    const SizedBox(height: 16),
                    if (meal.youtube != null && meal.youtube!.isNotEmpty)
                      FilledButton.icon(
                        onPressed: () => _openVideo(meal.youtube!),
                        icon: const Icon(Icons.play_circle),
                        label: const Text('Дивитись відео на YouTube'),
                      ),
                    const SizedBox(height: 24),
                  ]),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
