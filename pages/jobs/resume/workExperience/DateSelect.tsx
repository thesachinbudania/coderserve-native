import { Image, Pressable, Text, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { WheelPicker } from 'react-native-infinite-wheel-picker';
import PopUp from '../../../../components/messsages/PopUp';
import React from 'react';
import BlueButton from '../../../../components/buttons/BlueButton';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => {
	return `${currentYear - i}`;
});



export default function DateSelect({ placeholder, selectedMonth, setSelectedMonth, selectedYear, setSelectedYear }: { placeholder: string, selectedMonth: string, selectedYear: string, setSelectedMonth: React.Dispatch<React.SetStateAction<string>>, setSelectedYear: React.Dispatch<React.SetStateAction<string>> }) {
	const [popUpVisible, setPopUpVisible] = React.useState(false);
	return (
		<>
			<Pressable onPress={() => {
				Haptics.selectionAsync();
				setPopUpVisible(true);
			}
			}>
				{({ pressed }) => (
					<View style={[styles.menuBox, pressed && { borderColor: '#006dff' }]}>
						<Text style={[styles.boxText, selectedMonth && selectedYear && { color: 'black' }]}>{selectedMonth && selectedYear ? selectedMonth + ' ' + selectedYear : placeholder}</Text>
						<Image source={pressed ? require('../../../../components/form/assets/downArrowBlue.png') : require('../../../../components/form/assets/downArrowBlack.png')} style={styles.downArrow} />
					</View>
				)}
			</Pressable>
			<PopUp
				visible={popUpVisible}
				setVisible={setPopUpVisible}
			>
				<View style={styles.popUpContainer}>
					<View style={{ flex: 1 / 2 }}>
						<WheelPicker
							initialSelectedIndex={selectedMonth ? months.indexOf(selectedMonth) : 0}
							data={months}
							restElements={1}
							elementHeight={45}
							infiniteScroll={false}
							selectedIndex={0}
							onChangeValue={(_, value) => {
								setSelectedMonth(value);
							}}
							containerStyle={datePickerStyles.containerStyle}
							selectedLayoutStyle={datePickerStyles.selectedLayoutStyle}
							elementTextStyle={datePickerStyles.elementTextStyle}

						/>
					</View>
					<View style={{ flex: 1 / 2 }}>
						<WheelPicker
							initialSelectedIndex={selectedYear ? years.indexOf(selectedYear) : 0}
							data={years}
							restElements={1}
							elementHeight={45}
							infiniteScroll={false}
							selectedIndex={0}
							onChangeValue={(_, value) => {
								setSelectedYear(value);
							}}
							containerStyle={datePickerStyles.containerStyle}
							selectedLayoutStyle={datePickerStyles.selectedLayoutStyle}
							elementTextStyle={datePickerStyles.elementTextStyle}

						/>
					</View>
				</View>
				<BlueButton
					title='Done'
					onPress={() => {
						setPopUpVisible(false);
					}}
				/>
			</PopUp>
		</>
	)
}

const datePickerStyles = StyleSheet.create({
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

})

const styles = StyleSheet.create({
	menuBox: {
		width: '100%',
		borderRadius: 8,
		backgroundColor: 'white',
		borderColor: 'black',
		borderWidth: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 45,
	},
	boxText: {
		fontSize: 15,
		color: '#cbe1ff',
		paddingLeft: 12,
	},
	downArrow: {
		height: 16,
		width: 16,
		marginRight: 12,
	},
	popUpContainer: {
		gap: 16,
		flexDirection: 'row',
		marginBottom: 48,
	}
})
