import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

function Btn({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Text style={styles.btnText}>{title}</Text>
    </TouchableOpacity>
  );
}

Btn.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default function Controls({ running, onStart, onPause, onReset }) {
  return (
    <View style={styles.row}>
      {running ? <Btn title="Пауза" onPress={onPause} /> : <Btn title="Старт" onPress={onStart} />}
      <Btn title="Скинути" onPress={onReset} />
    </View>
  );
}

Controls.propTypes = {
  running: PropTypes.bool.isRequired,
  onStart: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  btn: {
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginHorizontal: 8,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
