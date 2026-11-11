import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMovieDetails } from '../api';

function InfoLine({ label, value }) {
  if (!value || value === 'N/A') return null;
  return (
    <Text style={styles.line}>
      <Text style={styles.label}>{label}: </Text>
      {value}
    </Text>
  );
}

InfoLine.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default class DetailsScreen extends React.Component {
  static propTypes = {
    route: PropTypes.object.isRequired,
  };

  state = { movie: null, error: null };

  async componentDidMount() {
    try {
      const movie = await getMovieDetails(this.props.route.params.id);
      this.setState({ movie });
    } catch (e) {
      this.setState({ error: e.message });
    }
  }

  render() {
    const { movie, error } = this.state;
    if (error) {
      return (
        <View style={styles.center}>
          <Text style={styles.line}>Помилка: {error}</Text>
        </View>
      );
    }
    if (!movie) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#f5c518" />
        </View>
      );
    }
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
        {movie.Poster !== 'N/A' && <Image source={{ uri: movie.Poster }} style={styles.poster} />}
        <Text style={styles.title}>{movie.Title}</Text>
        <Text style={styles.sub}>
          {movie.Year} · {movie.Rated} · {movie.Runtime}
        </Text>
        {movie.imdbRating !== 'N/A' && (
          <View style={styles.rating}>
            <Ionicons name="star" size={20} color="#f5c518" />
            <Text style={styles.ratingText}>{movie.imdbRating} / 10</Text>
            <Text style={styles.sub}>  ({movie.imdbVotes} голосів)</Text>
          </View>
        )}
        <Text style={styles.plot}>{movie.Plot}</Text>
        <InfoLine label="Жанр" value={movie.Genre} />
        <InfoLine label="Режисер" value={movie.Director} />
        <InfoLine label="Сценарій" value={movie.Writer} />
        <InfoLine label="Актори" value={movie.Actors} />
        <InfoLine label="Країна" value={movie.Country} />
        <InfoLine label="Мова" value={movie.Language} />
        <InfoLine label="Нагороди" value={movie.Awards} />
        <InfoLine label="Касові збори" value={movie.BoxOffice} />
        {movie.Ratings && movie.Ratings.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <Text style={styles.label}>Рейтинги:</Text>
            {movie.Ratings.map((r) => (
              <Text key={r.Source} style={styles.line}>• {r.Source}: {r.Value}</Text>
            ))}
          </View>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141414' },
  center: { flex: 1, backgroundColor: '#141414', alignItems: 'center', justifyContent: 'center' },
  poster: { width: 200, height: 300, alignSelf: 'center', borderRadius: 8, marginBottom: 16 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  sub: { color: '#aaa', marginTop: 4 },
  rating: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  ratingText: { color: '#fff', fontSize: 18, marginLeft: 6, fontWeight: '600' },
  plot: { color: '#ddd', fontSize: 15, lineHeight: 22, marginVertical: 14 },
  line: { color: '#ddd', marginBottom: 6, lineHeight: 20 },
  label: { color: '#f5c518', fontWeight: '600' },
});
