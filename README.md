# Лабораторні роботи — Розробка програмних додатків для мобільних пристроїв

| Лаба | Папка | Технології | Що робить |
|------|-------|-----------|-----------|
| 1 | `lab1-pomodoro` | Expo, React Native, prop-types | Таймер Помодоро: 25/5 хв, старт/пауза/скидання, вібрація на 00:00, власний час роботи/перерви |
| 2 | `lab2-movies` | Expo, React Native, React Navigation (Stack), @expo/vector-icons | Пошук фільмів в OMDb, підвантаження сторінок (>10 результатів), екран з деталями фільму |
| 3 | `lab3-weather` | Expo, React Native, Redux Toolkit, React Navigation (Stack + Tabs) | Погода: пошук міст, прогноз (поточний, погодинний, 7 днів), обрані міста, налаштування °C/°F |
| 4 | `lab4-recipes-flutter` | Flutter, http, provider, shared_preferences | Книга рецептів (TheMealDB): категорії, пошук, деталі, обране, випадковий рецепт |
| 5 | `lab5-notes-kotlin` | Kotlin, Android SDK, SQLite, RecyclerView | Нотатки: створення/редагування, кольори, закріплення, пошук, сортування, свайп-видалення з відміною, поділитися |

## Лаби 1–3 (Expo)

Потрібні Node.js і застосунок **Expo Go** на телефоні.

```bash
cd lab1-pomodoro
npm install
npx expo start
```

Відскануйте QR-код з терміналу в Expo Go (телефон і ПК мають бути в одній Wi-Fi мережі).
Для `lab2-movies` і `lab3-weather` — те саме, лише інша папка.

Ключ OMDb для лаби 2 лежить у `lab2-movies/api.js`.

## Лаба 4 (Flutter)

Flutter SDK встановлено в `C:\Users\Serhii\dev\flutter` (додайте `C:\Users\Serhii\dev\flutter\bin` у PATH
або вкажіть цей шлях у плагіні Flutter в Android Studio / VS Code).

```bash
cd lab4-recipes-flutter
flutter pub get
flutter run
```

Готовий APK для встановлення на телефон: `lab4-recipes-flutter/build/app/outputs/flutter-apk/app-debug.apk`.

## Лаба 5 (Kotlin)

Відкрийте папку `lab5-notes-kotlin` в **Android Studio** (File → Open), дочекайтесь Gradle Sync
і натисніть Run ▶ (емулятор або телефон з увімкненою USB-налагодженням).

Збірка з терміналу: `gradlew assembleDebug`, готовий APK: `lab5-notes-kotlin/app/build/outputs/apk/debug/app-debug.apk`.

Android SDK встановлено в `C:\Users\Serhii\AppData\Local\Android\Sdk`.
