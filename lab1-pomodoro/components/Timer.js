import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';

const pad = (n) => (n < 10 ? '0' + n : '' + n);

export default function Timer({ seconds }) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return <Text style={styles.time}>{pad(min)}:{pad(sec)}</Text>;
}

Timer.propTypes = {
  seconds: PropTypes.number.isRequired,
};

const styles = StyleSheet.create({
  time: {
    fontSize: 80,
    color: '#fff',
    fontWeight: '200',
    marginVertical: 20,
    fontVariant: ['tabular-nums'],
  },
});
