import { BackHandler, StyleSheet, Text, View } from 'react-native';
import Layout from '@/components/general/PageLayout';
import React from 'react';
import BlueButton from '@/components/buttons/BlueButton';
import PopUpMessage from '@/components/general/PopUpMessage';
import { useNavigation } from '@react-navigation/native';
import DatePicker from './DatePicker';
import ErrorMessage from '@/components/messsages/Error';
import { useSetDobMutation } from '@/helpers/profile/apiSlice';
import { useUserStore } from '@/zustand/stores';


const currentYear = new Date().getFullYear();

export default function GitHub() {
	const [popUpVisible, setPopUpVisible] = React.useState(false);
	const [showDatePicker, setShowDatePicker] = React.useState(true);
	const dobDate = useUserStore((state) => state.dobDate);
	const dobMonth = useUserStore((state) => state.dobMonth);
	const dobYear = useUserStore((state) => state.dobYear);
	const setUser = useUserStore((state) => state.setUser);


	// states for storing new data
	const [newDate, setNewDate] = React.useState(dobDate || '1');
	const [newMonth, setNewMonth] = React.useState(dobMonth || 'January');
	const [newYear, setNewYear] = React.useState(dobYear || currentYear.toString());
	const [setDob, { isLoading }] = useSetDobMutation();

	const navigation = useNavigation();
	function goBack() {
		setShowDatePicker(false);
		setTimeout(() => {
			navigation.goBack();
		}, 10)
	}
	// setting show date picker false on back pres
	React.useEffect(() => {
		const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
			goBack();
			return true;
		})
		return () => backHandler.remove()
	}, [])

	const [error, setError] = React.useState('')

	async function updateDob() {
		try {
			await setDob({ dobDate: newDate.toString(), dobMonth: newMonth.toString(), dobYear: newYear.toString() }).unwrap();
			setUser({ dobDate: newDate.toString(), dobMonth: newMonth.toString(), dobYear: newYear.toString() });
			setPopUpVisible(true)
		} catch (e) {
			console.log(e)
			setError('Something went wrong! Please try again later.')
		}
	}

	return (
		<Layout
			headerTitle='Birthday'
			defaultBack={false}
			customBack={() => goBack()}
			flex1={false}
		>
			<PopUpMessage
				heading='Birthday Updated'
				text='Your birthday is now saved - get ready for personalized surprises and celebrations on your special day.'
				visible={popUpVisible}
				setVisible={setPopUpVisible}
				onPress={() => {
					goBack();
					goBack();
				}}
				isLoading={false}
				singleButton
			/>

			<Text style={styles.heading}>Celebrate Your Journey</Text>
			<Text style={styles.content}>
				Sharing your birthday helps us craft a personalized experience just for you - unlocking birthday surprises, exclusive offers, and content that celebrates your special day, all while keeping your information secure.
			</Text>
			<Text style={[styles.content, { marginTop: 24 }]}>
				Kindly note, the birthday information you provide will not appear on your public profile. It will only be included in your resume and seen by recruiters when you apply for a job.
			</Text>
			<View style={{ marginTop: 32 }}>

				<View>
					{showDatePicker ?
						<DatePicker
							date={dobDate || '01'}
							month={dobMonth || 'January'}
							year={dobYear || '2025'}
							setSelectedDate={setNewDate}
							setSelectedMonth={setNewMonth}
							setSelectedYear={setNewYear}
						/> :
						null

					}
					<View style={{ gap: 8, marginTop: 48 }}>
						<BlueButton
							title='Update'
							onPress={updateDob}
							loading={isLoading}
							disabled={dobDate === newDate && dobMonth === newMonth && dobYear === newYear}
						/>
						<ErrorMessage message={error} />
					</View>
				</View>
			</View>
		</Layout>
	)
}

const styles = StyleSheet.create({
	heading: {
		fontSize: 15,
		fontWeight: 'bold',
		marginBottom: 8,
	},
	content: {
		fontSize: 13,
		color: '#737373',
		textAlign: 'justify',
	}
})
