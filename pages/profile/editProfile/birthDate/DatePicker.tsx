import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { DatePicker, MonthPicker, YearPicker, dates, months, years } from "../../../../components/form/DatePicker";



const innerWidth = Dimensions.get('window').width - 88;

export default function InlineDatePicker({ date, month, year, setSelectedDate, setSelectedMonth, setSelectedYear }: { date: string, month: string, year: string, setSelectedDate: Function, setSelectedMonth: Function, setSelectedYear: Function }) {
	console.log(date, month, year)
	return (
		<View style={styles.container}>
			<View style={styles.dateContainer}>
				<DatePicker
					items={dates.map((item) => ({ label: item, value: item }))}
					selectedValue={date}
					onValueChange={(item) => {
						setSelectedDate(item);
					}}
					width={innerWidth * (1 / 4)}
				/>
			</View>
			<View style={styles.monthContainer}>
				<MonthPicker
					items={months.map((item) => ({ label: item, value: item }))}
					selectedValue={month}
					onValueChange={(item) => {
						setSelectedMonth(item);
					}}
					width={innerWidth * (2 / 4)}
				/>
			</View>
			<View style={styles.yearContainer}>
				<YearPicker
					items={years.map((item) => ({ label: item, value: item }))}
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
