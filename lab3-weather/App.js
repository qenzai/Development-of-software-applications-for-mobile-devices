import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import store from './store';
import SearchScreen from './screens/SearchScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import WeatherScreen from './screens/WeatherScreen';
import SettingsScreen from './screens/SettingsScreen';

const SearchStack = createNativeStackNavigator();
const FavStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const headerOptions = {
  headerStyle: { backgroundColor: '#1e88e5' },
  headerTintColor: '#fff',
};

function SearchStackScreen() {
  return (
    <SearchStack.Navigator screenOptions={headerOptions}>
      <SearchStack.Screen name="SearchList" component={SearchScreen} options={{ title: 'Пошук міста' }} />
      <SearchStack.Screen
        name="Weather"
        component={WeatherScreen}
        options={({ route }) => ({ title: route.params.city.name })}
      />
    </SearchStack.Navigator>
  );
}

function FavStackScreen() {
  return (
    <FavStack.Navigator screenOptions={headerOptions}>
      <FavStack.Screen name="FavList" component={FavoritesScreen} options={{ title: 'Обрані міста' }} />
      <FavStack.Screen
        name="Weather"
        component={WeatherScreen}
        options={({ route }) => ({ title: route.params.city.name })}
      />
    </FavStack.Navigator>
  );
}

const TAB_ICONS = {
  Search: 'search',
  Favorites: 'star',
  Settings: 'settings',
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: route.name === 'Settings',
            ...headerOptions,
            tabBarActiveTintColor: '#1e88e5',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={TAB_ICONS[route.name]} size={size} color={color} />
            ),
          })}
        >
          <Tab.Screen name="Search" component={SearchStackScreen} options={{ title: 'Пошук' }} />
          <Tab.Screen name="Favorites" component={FavStackScreen} options={{ title: 'Обране' }} />
          <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Налаштування' }} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
