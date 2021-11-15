import React, { Component } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";

const zeroDays = {
  blue: new Date(2021, 10, 1).getTime(),
  green: new Date(2021, 8, 6).getTime(),
  red: new Date(2021, 9, 18).getTime(),
  purple: new Date(2021, 9, 4).getTime(),
  yellow: new Date(2021, 8, 20).getTime(),
};

const daysOfTheWeek = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];

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

export default class ShiftScreen extends Component {
  state = {
    date: new Date(),
    shifts: ["blue", "green", "red", "purple", "yellow"],
  };

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

  renderShifts(year, month, day) {
    const result = [];

    let shiftValues = [];

    for (const shift of this.state.shifts) {
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

  render() {
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
            <Button
              disabled={disablePrev}
              title="Previous"
              onPress={this.onPreviousClick.bind(this)}
            ></Button>
          </View>
          <Text style={[styles.text, { flex: 1 }]}>
            {`${
              monthNames[this.state.date.getMonth()]
            } ${this.state.date.getFullYear()}`}
          </Text>
          <View style={{ flex: 1 }}>
            <Button title="Next" onPress={this.onNextClick.bind(this)}></Button>
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
