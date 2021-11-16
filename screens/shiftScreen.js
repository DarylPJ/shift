import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  Switch,
  BackHandler,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";

const zeroDays = {
  blue: new Date(2021, 10, 1).getTime(),
  green: new Date(2021, 8, 6).getTime(),
  red: new Date(2021, 9, 18).getTime(),
  purple: new Date(2021, 9, 4).getTime(),
  yellow: new Date(2021, 8, 20).getTime(),
};

const daysOfTheWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const allShifts = ["blue", "green", "red", "purple", "yellow"];

export default class ShiftScreen extends Component {
  constructor() {
    super();

    const shifttoggles = allShifts.map((shift) => ({
      shift,
      enabled: true,
    }));

    this.state = {
      date: new Date(),
      shifttoggles,
      editSettings: false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.onBackPress.bind(this)
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.onBackPress.bind(this)
    );
  }

  shiftValue(date, zeroDate) {
    const diff = date.getTime() - zeroDate;

    const days = Math.round(diff / (1000 * 3600 * 24));

    const daysIntoPattern = days % 70;

    if (daysIntoPattern > 55) {
      return "";
    }

    const daysIntoEightPaten = daysIntoPattern % 8;

    if (daysIntoEightPaten < 2) {
      return "D";
    }

    if (daysIntoEightPaten < 4) {
      return "N";
    }

    return "";
  }

  onBackPress() {
    if (!this.state.editSettings) {
      return false;
    }

    this.setState({ ...this.state, editSettings: false });
    return true;
  }

  onPreviousClick() {
    const workingDate = new Date(this.state.date);
    const newDate = new Date(workingDate.setMonth(workingDate.getMonth() - 1));

    if (newDate.getTime() < new Date(2021, 10, 1).getTime()) {
      return;
    }

    this.setState({ ...this.state, date: newDate });
  }

  onNextClick() {
    const newDate = new Date(
      this.state.date.setMonth(this.state.date.getMonth() + 1)
    );

    this.setState({ ...this.state, date: newDate });
  }

  onSettingsClick() {
    this.setState({ ...this.state, editSettings: true });
  }

  toggleValue(shift) {
    const toggle = this.state.shifttoggles.find((i) => i.shift === shift);
    toggle.enabled = !toggle.enabled;

    this.setState({ ...this.state });
  }

  renderShifts(year, month, day) {
    const result = [];

    let shiftValues = [];

    for (const shiftToggle of this.state.shifttoggles) {
      const shift = shiftToggle.shift;

      const value = this.shiftValue(
        new Date(year, month, day),
        zeroDays[shift]
      );

      if (!value) {
        continue;
      }

      shiftValues.push({ value, shift });
    }

    shiftValues = [
      shiftValues.find((i) => i.value === "D"),
      shiftValues.find((i) => i.value === "N"),
    ];

    for (const shiftValue of shiftValues) {
      if (!shiftValue) {
        continue;
      }

      const key = `${day} ${shiftValue.shift}`;

      result.push(
        <Text
          key={key}
          style={[styles.text, styles.shift, { color: shiftValue.shift }]}
        >
          {shiftValue.value}
        </Text>
      );
    }

    return result;
  }

  renderMonth(year, month) {
    const days = new Date(year, month + 1, 0).getDate();

    let firstDay = new Date(year, month).getDay() - 1;
    if (firstDay < 0) {
      firstDay = 6;
    }

    const results = [];

    for (let row = 0; row < 6; row++) {
      const week = [];
      for (let dayOfTheWeek = 0; dayOfTheWeek < 7; dayOfTheWeek++) {
        const day = row * 7 + dayOfTheWeek + 1 - firstDay;

        if (day < 1 || day > days) {
          week.push(
            <View key={`${row} ${dayOfTheWeek} 1`} style={styles.box}></View>
          );
          continue;
        }

        const shiftResult = this.renderShifts(year, month, day);

        week.push(
          <View key={`${row} ${dayOfTheWeek} 1`} style={styles.box}>
            <Text style={styles.text} key={`${row} ${dayOfTheWeek} 2`}>
              {day}:
            </Text>
            <View
              key={`${row} ${dayOfTheWeek} 3`}
              style={[styles.row, { justifyContent: "center" }]}
            >
              {shiftResult}
            </View>
          </View>
        );
      }

      results.push(
        <View key={`${row} 4`} style={styles.row}>
          {week}
        </View>
      );
    }

    return results;
  }

  renderSettings() {
    const oneEnabled =
      this.state.shifttoggles.filter((shiftToggle) => shiftToggle.enabled)
        .length === 1;

    const settings = this.state.shifttoggles.map((shiftToggle, index) => (
      <View style={[styles.row, { alignItems: "center" }]}>
        <Text key={index} style={styles.text}>
          {shiftToggle.shift}
        </Text>
        <View>
          <Switch
            trackColor={{ false: "#767577", true: "#767577" }}
            key={`${index} switch`}
            value={shiftToggle.enabled}
            onChange={this.toggleValue.bind(this, shiftToggle.shift)}
            disabled={oneEnabled && shiftToggle.enabled}
          ></Switch>
        </View>
      </View>
    ));

    return (
      <View style={[styles.container, { paddingLeft: 20 }]}>
        <View style={{ flex: 0.5 }}>{settings}</View>
      </View>
    );
  }

  render() {
    if (this.state.editSettings) {
      return this.renderSettings();
    }

    const workingDate = new Date(this.state.date);
    const PrevDate = new Date(workingDate.setMonth(workingDate.getMonth() - 1));

    const disablePrev = PrevDate.getTime() < new Date(2021, 10, 1).getTime();

    const days = daysOfTheWeek.map((i) => (
      <View key={`${i} view`} style={styles.box}>
        <Text key={i} style={styles.text}>
          {i}
        </Text>
      </View>
    ));

    return (
      <GestureRecognizer
        style={styles.container}
        onSwipeLeft={this.onNextClick.bind(this)}
        onSwipeRight={this.onPreviousClick.bind(this)}
      >
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <View style={styles.row}>
              <View style={{ flex: 1, padding: 5 }}>
                <Button
                  disabled={disablePrev}
                  title="Previous"
                  onPress={this.onPreviousClick.bind(this)}
                ></Button>
              </View>
              <View style={{ flex: 1, padding: 5 }}>
                <Button
                  title="Next"
                  onPress={this.onNextClick.bind(this)}
                ></Button>
              </View>
              <View style={{ flex: 1, padding: 5 }}>
                <Button
                  title="Settings"
                  onPress={this.onSettingsClick.bind(this)}
                ></Button>
              </View>
            </View>
            <View style={styles.row}>
              <Text style={[styles.text, { flex: 1, padding: 5 }]}>
                {`${
                  monthNames[this.state.date.getMonth()]
                } ${this.state.date.getFullYear()}`}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.row}>{days}</View>
        {this.renderMonth(
          this.state.date.getFullYear(),
          this.state.date.getMonth()
        )}
      </GestureRecognizer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: "black",
    flex: 1,
  },
  row: {
    flex: 1,
    flexDirection: "row",
  },
  box: {
    flex: 1,
    borderColor: "white",
    borderStyle: "dotted",
    borderWidth: 1,
    borderRadius: 1,
  },
  text: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
  },
  shift: {
    paddingLeft: 5,
    paddingRight: 5,
  },
});
