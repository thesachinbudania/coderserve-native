import { KeyboardAvoidingView, Pressable, StyleSheet, Text, View } from 'react-native';
import Layout from '../../controlCentre/accountCenter/PageLayout';
import { styles } from '../location/page';
import React from 'react';
import TextInput from '../../../../components/form/FormInput';
import { useSetGenderMutation } from '../../apiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import { setUser } from '../../../../app/userSlice';
import ErrorMessage from '../../../../components/messsages/Error';
import BlueButton from '../../../../components/buttons/BlueButton';
import PopUpMessage from '../PopUpMessage';
import { useNavigation } from '@react-navigation/native';

export function SelectionButton({ onPress = () => { }, selected = false, title }: { onPress?: () => void, selected?: boolean, title: string }) {
	return (
		<Pressable onPress={onPress}>
			<View style={[buttonStyles.buttonContainer, selected && { backgroundColor: '#202020' }]}>
				<View style={[buttonStyles.selectDot, selected && { backgroundColor: 'white' }]}></View>
				<Text style={[buttonStyles.buttonText, selected && { color: 'white' }]}>{title}</Text>
			</View>
			)
		</Pressable>
	)
}

const buttonStyles = StyleSheet.create({
	buttonContainer: {
		padding: 16,
		borderWidth: 1,
		borderRadius: 8,
		borderColor: '#eeeeee',
		flexDirection: 'row',
		gap: 8,
		alignItems: 'center',
	},
	buttonText: {
		fontSize: 15,
	},
	selectDot: {
		width: 15,
		height: 15,
		borderRadius: 8,
		backgroundColor: '#eeeeee',
	}
})

export default function Gender() {
	const currentGender = useSelector<RootState>((state) => state.user.gender);

	const [gender, setGender] = React.useState(!currentGender ? null : currentGender === 'Male' || currentGender === 'Female' ? currentGender : 'Other');
	const [otherGender, setOtherGender] = React.useState(gender === 'Other' ? currentGender : '');

	const [setNewGender, { isLoading }] = useSetGenderMutation();
	const dispatch = useDispatch();
	const navigation = useNavigation();

	const [popUpVisible, setPopUpVisible] = React.useState(false)

	const [error, setError] = React.useState('');

	async function updateGender() {
		try {
			await setNewGender({ gender: gender === 'Other' ? otherGender : gender }).unwrap();
			dispatch(setUser({ gender: gender === 'Other' ? otherGender : gender }));
			setPopUpVisible(true);
		}
		catch (e) {
			console.log(e);
			setError('Something went wrong! Please try again later.');
		}
	}
	function isButtonEnabled() {
		if (gender === 'Other') {
			return otherGender === '' || otherGender === currentGender;
		}
		else {
			return gender === currentGender;
		}
	}
	return (
		<Layout
			headerTitle='Gender'
		>
			<PopUpMessage
				heading='Gender Updated'
				text="Your gender selection is now save! Your identity shines through every detail. We're excited to support your unique journey."
				visible={popUpVisible}
				setVisible={setPopUpVisible}
				isLoading={false}
				singleButton
				onPress={() => {
					navigation.goBack();
				}}
			/>

			<Text style={styles.heading}>Customize Your Experience</Text>
			<Text style={styles.content}>
				Sharing your gender helps us tailor content, recommendations, and community connections to your unique needs. Your input not only enhances your personal experience but also contributes to creating a more inclusive platform for everyone.
			</Text>
			<Text style={[styles.content, { marginTop: 24 }]}>
				Kindly note, the gender information you provide will not appear on your public profile. It will only be included in your resume and seen by recruiters when you apply for a job.
			</Text>
			<KeyboardAvoidingView behavior='padding' style={{ marginTop: 32, gap: 16, flex: 1 }}>
				<SelectionButton
					title='Male'
					onPress={() => setGender('Male')}
					selected={gender === 'Male'}
				/>
				<SelectionButton
					title='Female'
					onPress={() => setGender('Female')}
					selected={gender === 'Female'}
				/>
				<Pressable onPress={() => setGender('Other')}>
					<View style={[buttonStyles.buttonContainer, gender === 'Other' && { backgroundColor: '#202020' }]}>
						<View style={[buttonStyles.selectDot, { alignSelf: 'flex-start' }, gender === 'Other' && { backgroundColor: 'white' }]}></View>
						<View style={{ flex: 1 }}>
							<Text style={[buttonStyles.buttonText, gender === 'Other' && { color: 'white' }]}>Other</Text>
							<TextInput
								placeholder='Specify here'
								value={typeof otherGender === 'string' ? otherGender : ''}
								onChangeText={setOtherGender}
								light={gender === 'Other'}
							/>
						</View>
					</View>
				</Pressable>
				<View style={{ gap: 8, marginTop: 48 }}>
					<BlueButton
						title='Update'
						onPress={updateGender}
						loading={isLoading}
						disabled={isButtonEnabled()}
					/>
					<ErrorMessage message={error} />
				</View>
			</KeyboardAvoidingView>
		</Layout>
	)
}



