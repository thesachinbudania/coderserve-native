import { Pressable, StyleSheet, Text, View } from 'react-native';
import Layout from '../ChangeSettingsLayout'
import BlueButton from '../../../components/buttons/BlueButton';
import { useUpdateResumeMutation } from '../apiSlice';
import React from 'react'
import { setEmploymentStatus } from '../../../app/jobsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import PopUpMessage from '../../profile/editProfile/PopUpMessage';

const options = {
	'Open to Work': 'Currently unemployed and seeking opportunities.',
	'Employed, but Exploring': 'Working, yet open to better career options.',
	'Fresher, Ready to Start': 'Just starting out and eager to begin.',
	'Not Looking Right Now': 'Satisfied with the current situation.'
}

function Button({ title, subTitle, selected, setSelected, index }: { index: number, title: string, subTitle: string, selected: boolean, setSelected: React.Dispatch<React.SetStateAction<number | null>> }) {
	return (
		<Pressable onPress={
			() => {
				Haptics.selectionAsync();
				setSelected(index);
			}
		}>
			{
				<View style={[buttonStyles.container, selected && { backgroundColor: '#202020' }]}>
					<View style={[buttonStyles.selectCircle, selected && { borderColor: 'white' }]}>
					</View>
					<View >
						<Text style={[buttonStyles.heading, selected && { color: 'white' }]}>{title}</Text>
						<Text style={buttonStyles.text}>{subTitle}</Text>
					</View>
				</View>
			}
		</Pressable>
	)
}

const buttonStyles = StyleSheet.create({
	container: {
		padding: 16,
		borderWidth: 1,
		borderColor: '#eeeeee',
		borderRadius: 12,
		flexDirection: 'row',
		gap: 16
	},
	selectCircle: {
		borderWidth: 3,
		borderColor: '#a6a6a6',
		borderRadius: 50,
		height: 16,
		width: 16
	},
	heading: {
		fontSize: 15,
		fontWeight: 'bold',
	},
	text: {
		fontSize: 13,
		color: '#a6a6a6',
		paddingRight: 16,
		marginTop: 4
	}
})

export default function() {
	const [popUpVisible, setPopUpVisible] = React.useState(false);
	const currentState = useSelector((state: RootState) => state.jobs.employmentStatus);
	const [updateEmploymentStatus, { isLoading }] = useUpdateResumeMutation();
	const [selected, setSelected] = React.useState<number | null>(currentState);
	const dispatch = useDispatch();
	const navigation = useNavigation();

	const updateStatus = async (status: number) => {
		try {
			await updateEmploymentStatus({
				employment_status: status
			}).unwrap();
			dispatch(setEmploymentStatus(status));
			setPopUpVisible(true);

		} catch (err) {
			console.log(err);
		}
	}

	return (
		<Layout
			headerTitle='Employment Status'
			heading='Set Your Employment Status'
			text="Your employment status helps us connect you with the right opportunities, whether you're actively job hunting, open to better career options, or just exploring. Choose the option that best reflects your current situation to get the most relevant job recommendations and networking connections."
		>
			<PopUpMessage
				heading='Employment Status Updated'
				text='Your employment status has been saved. You’ll now receive tailored recommendations and opportunities based on your current status.'
				visible={popUpVisible}
				setVisible={setPopUpVisible}
				isLoading={false}
				singleButton
				onPress={() => {
					setPopUpVisible(false);
					navigation.goBack();
				}}
			/>
			<View style={{ gap: 16, marginBottom: 48 }}>
				{
					Object.keys(options).map((key, index) => (
						<Button
							title={key}
							// @ts-ignore
							subTitle={options[key]}
							key={key}
							selected={selected === index}
							setSelected={setSelected}
							index={index}
						/>
					))
				}
			</View>
			<BlueButton
				title='Update'
				loading={isLoading}
				disabled={selected === null || selected === currentState}
				onPress={selected != null ? () => updateStatus(selected) : () => { }}
			/>
		</Layout>
	)
}
