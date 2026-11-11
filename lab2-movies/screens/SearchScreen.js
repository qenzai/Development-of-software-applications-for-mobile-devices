import React from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, FlatList, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchMovies } from '../api';
import MovieRow from '../components/MovieRow';

export default class SearchScreen extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  state = {
    query: '',
    movies: [],
    page: 0,
    total: 0,
    loading: false,
    error: null,
  };

  componentWillUnmount() {
    clearTimeout(this.debounce);
  }

  onChangeQuery = (query) => {
    this.setState({ query });
    // невелика затримка, щоб не слати запит на кожну літеру
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => this.newSearch(query), 500);
  };

  newSearch = async (query) => {
    if (query.trim().length < 3) {
      this.setState({ movies: [], total: 0, page: 0, error: null });
      return;
    }
    this.setState({ loading: true, error: null });
    try {
      const { movies, total, error } = await searchMovies(query.trim(), 1);
      if (query !== this.state.query) return; // користувач вже ввів інше
      this.setState({ movies, total, page: 1, error, loading: false });
    } catch (e) {
      this.setState({ loading: false, error: 'Немає з\'єднання з мережею' });
    }
  };

  // підвантаження наступної сторінки (більше 10 результатів)
  loadMore = async () => {
    const { movies, total, page, loading, query } = this.state;
    if (loading || movies.length >= total || page === 0) return;
    this.setState({ loading: true });
    try {
      const res = await searchMovies(query.trim(), page + 1);
      this.setState((prev) => {
        const ids = new Set(prev.movies.map((m) => m.imdbID));
        const fresh = res.movies.filter((m) => !ids.has(m.imdbID));
        return { movies: [...prev.movies, ...fresh], page: prev.page + 1, loading: false };
      });
    } catch (e) {
      this.setState({ loading: false });
    }
  };

  openMovie = (movie) => {
    this.props.navigation.navigate('Details', { id: movie.imdbID, title: movie.Title });
  };

  renderFooter = () =>
    this.state.loading ? <ActivityIndicator style={{ margin: 16 }} color="#f5c518" /> : null;

  render() {
    const { query, movies, total, error } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.input}
            placeholder="Введіть назву фільму (англ.)"
            placeholderTextColor="#777"
            value={query}
            onChangeText={this.onChangeQuery}
            autoCorrect={false}
          />
        </View>
        {total > 0 && <Text style={styles.count}>Знайдено: {total}</Text>}
        {error && <Text style={styles.error}>{error}</Text>}
        <FlatList
          data={movies}
          keyExtractor={(item) => item.imdbID}
          renderItem={({ item }) => <MovieRow movie={item} onPress={this.openMovie} />}
          onEndReached={this.loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={this.renderFooter}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    margin: 10,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    paddingVertical: 10,
    marginLeft: 8,
    fontSize: 16,
  },
  count: {
    color: '#aaa',
    marginHorizontal: 12,
    marginBottom: 4,
  },
  error: {
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 20,
  },
});
