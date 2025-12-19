import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { DatePicker, MonthPicker, YearPicker, dates } from "@/components/form/DatePicker";

const innerWidth = Dimensions.get('window').width - 88;
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => {
  return `${currentYear - i}`;
})

export default function InlineDatePicker({ date, month, year, setSelectedDate, setSelectedMonth, setSelectedYear, leastYears = 0 }: { date: string, month: string, leastYears?: number, year: string, setSelectedDate: Function, setSelectedMonth: Function, setSelectedYear: Function }) {
  const datesList = ['--', '--'].concat(dates);
  const monthsList = ['--', '--'].concat(months);
  const yearsList = ['--', '--', '--'].concat(years.slice(leastYears));
  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <DatePicker
          items={datesList.map((item) => ({ label: item, value: item }))}
          selectedValue={date}
          onValueChange={(item) => {
            setSelectedDate(item);
          }}
          width={innerWidth * (1 / 4)}
        />
      </View>
      <View style={styles.monthContainer}>
        <MonthPicker
          items={monthsList.map((item) => ({ label: item, value: item }))}
          selectedValue={month}
          onValueChange={(item) => {
            setSelectedMonth(item);
          }}
          width={innerWidth * (2 / 4)}
        />
      </View>
      <View style={styles.yearContainer}>
        <YearPicker
          items={yearsList.map((item) => ({ label: item, value: item }))}
          selectedValue={year}
          onValueChange={(item) => {
            setSelectedYear(item);
          }}
          width={innerWidth * (1 / 4)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#eeeeee',
    borderRadius: 8,
    gap: 12,
    paddingBottom: 72,

  },
  selectedLayoutStyle: {
    backgroundColor: 'white',
    borderColor: '#eeeeee',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  containerStyle: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  elementTextStyle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  dateContainer: {
    width: innerWidth * (1 / 4),
  },
  monthContainer: {
    width: innerWidth * (2 / 4),
  },
  yearContainer: {
    width: innerWidth * (1 / 4),
  },
});
