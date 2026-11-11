import React from 'react';
import { StyleSheet, Text, View, StatusBar, Vibration } from 'react-native';
import Timer from './components/Timer';
import Controls from './components/Controls';
import Settings from './components/Settings';

const WORK = 'work';
const BREAK = 'break';

export default class App extends React.Component {
  state = {
    workMinutes: 25,
    breakMinutes: 5,
    mode: WORK,
    secondsLeft: 25 * 60,
    running: false,
    completed: 0,
  };

  componentWillUnmount() {
    this.stopInterval();
  }

  startInterval() {
    this.stopInterval();
    this.interval = setInterval(this.tick, 1000);
  }

  stopInterval() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  tick = () => {
    this.setState((prev) => {
      if (prev.secondsLeft > 1) {
        return { secondsLeft: prev.secondsLeft - 1 };
      }
      // таймер дійшов до 00:00 — вібруємо і перемикаємо режим
      Vibration.vibrate([0, 500, 300, 500]);
      const nextMode = prev.mode === WORK ? BREAK : WORK;
      const nextMinutes = nextMode === WORK ? prev.workMinutes : prev.breakMinutes;
      return {
        mode: nextMode,
        secondsLeft: nextMinutes * 60,
        completed: prev.mode === WORK ? prev.completed + 1 : prev.completed,
      };
    });
  };

  start = () => {
    if (this.state.running) return;
    this.setState({ running: true });
    this.startInterval();
  };

  pause = () => {
    this.stopInterval();
    this.setState({ running: false });
  };

  reset = () => {
    this.stopInterval();
    this.setState((prev) => ({
      running: false,
      mode: WORK,
      secondsLeft: prev.workMinutes * 60,
    }));
  };

  updateSettings = (workMinutes, breakMinutes) => {
    this.stopInterval();
    this.setState((prev) => ({
      workMinutes,
      breakMinutes,
      running: false,
      secondsLeft: (prev.mode === WORK ? workMinutes : breakMinutes) * 60,
    }));
  };

  render() {
    const { mode, secondsLeft, running, completed, workMinutes, breakMinutes } = this.state;
    const isWork = mode === WORK;
    return (
      <View style={[styles.container, { backgroundColor: isWork ? '#c0392b' : '#27ae60' }]}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>Pomodoro</Text>
        <Text style={styles.mode}>{isWork ? 'Час працювати' : 'Перерва'}</Text>
        <Timer seconds={secondsLeft} />
        <Controls running={running} onStart={this.start} onPause={this.pause} onReset={this.reset} />
        <Text style={styles.counter}>Завершено помідорів: {completed}</Text>
        <Settings
          workMinutes={workMinutes}
          breakMinutes={breakMinutes}
          onSave={this.updateSettings}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  mode: {
    fontSize: 22,
    color: '#fff',
    marginTop: 8,
  },
  counter: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 12,
  },
});
