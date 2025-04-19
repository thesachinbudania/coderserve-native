import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { WheelPicker } from 'react-native-infinite-wheel-picker';


const dates = Array.from({ length: 31 }, (_, i) => {
	if (i < 9) {
		return `0${i + 1}`;
	}
	else {
		return `${i + 1}`;
	}
});

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => {
	return `${currentYear - i}`;
});


const innerWidth = Dimensions.get('window').width - 88;

export default function InlineDatePicker({ date, month, year, setSelectedDate, setSelectedMonth, setSelectedYear }: { date: string, month: string, year: string, setSelectedDate: Function, setSelectedMonth: Function, setSelectedYear: Function }) {
	console.log(date, month, year)
	return (
		<View style={styles.container}>
			<View style={styles.dateContainer}>
				<WheelPicker
					initialSelectedIndex={dates.indexOf(date)}
					data={dates}
					restElements={1}
					elementHeight={45}
					infiniteScroll={false}
					onChangeValue={(_, value) => {
						setSelectedDate(value);
					}}
					selectedIndex={0}
					containerStyle={styles.containerStyle}
					selectedLayoutStyle={styles.selectedLayoutStyle}
					elementTextStyle={styles.elementTextStyle}
				/>
			</View>
			<View style={styles.monthContainer}>
				<WheelPicker
					initialSelectedIndex={months.indexOf(month)}
					data={months}
					restElements={1}
					elementHeight={45}
					infiniteScroll={false}
					onChangeValue={(_, value) => {
						setSelectedMonth(value);
					}}
					selectedIndex={0}
					containerStyle={styles.containerStyle}
					selectedLayoutStyle={styles.selectedLayoutStyle}
					elementTextStyle={styles.elementTextStyle}
				/>
			</View>
			<View style={styles.yearContainer}>
				<WheelPicker
					initialSelectedIndex={years.indexOf(year)}
					data={years}
					restElements={1}
					elementHeight={45}
					infiniteScroll={false}
					onChangeValue={(_, value) => {
						setSelectedYear(value);
					}}
					selectedIndex={0}
					containerStyle={styles.containerStyle}
					selectedLayoutStyle={styles.selectedLayoutStyle}
					elementTextStyle={styles.elementTextStyle}
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
