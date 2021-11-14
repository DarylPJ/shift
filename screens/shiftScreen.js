import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";

export default class ShiftScreen extends Component {
  state = {};

  zero = new Date(2021, 9, 18).getTime();

  shiftValue(date) {
    const diff = date.getTime() - this.zero;

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

  renderMonth(year, month) {
    const days = new Date(year, month + 1, 0).getDate();

    const results = [];

    for (let index = 0; index < days; index++) {
      const value = this.shiftValue(new Date(year, month, index + 1));

      results.push(
        <Text key={index}>
          {index + 1}:{value}{" "}
        </Text>
      );
    }

    return results;
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>{this.renderMonth(2021, 10)}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    backgroundColor: "black",
    alignItems: "stretch",
    flex: 1,
  },
  titleText: {
    paddingTop: 30,
    fontSize: 50,
    fontWeight: "bold",
    color: "white",
  },
});
