import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default class Settings extends React.Component {
  static propTypes = {
    workMinutes: PropTypes.number.isRequired,
    breakMinutes: PropTypes.number.isRequired,
    onSave: PropTypes.func.isRequired,
  };

  state = {
    work: String(this.props.workMinutes),
    brk: String(this.props.breakMinutes),
  };

  // залишаємо лише цифри
  onlyDigits = (text) => text.replace(/[^0-9]/g, '');

  save = () => {
    const work = parseInt(this.state.work, 10);
    const brk = parseInt(this.state.brk, 10);
    if (!work || !brk || work > 180 || brk > 180) {
      Alert.alert('Помилка', 'Введіть число хвилин від 1 до 180');
      return;
    }
    this.props.onSave(work, brk);
  };

  render() {
    return (
      <View style={styles.box}>
        <View style={styles.row}>
          <Text style={styles.label}>Робота (хв):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={this.state.work}
            onChangeText={(t) => this.setState({ work: this.onlyDigits(t) })}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Перерва (хв):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={this.state.brk}
            onChangeText={(t) => this.setState({ brk: this.onlyDigits(t) })}
          />
        </View>
        <TouchableOpacity style={styles.saveBtn} onPress={this.save}>
          <Text style={styles.saveText}>Застосувати</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 16,
    width: '90%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    color: '#fff',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 6,
    width: 80,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  saveBtn: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
  },
  saveText: {
    fontWeight: 'bold',
    color: '#333',
  },
});
