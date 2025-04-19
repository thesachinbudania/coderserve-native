import { Dimensions, Text, View } from 'react-native';
import Layout from '../../controlCentre/accountCenter/PageLayout';
import { styles } from '../location/page';
import InputField from '../../../../components/form/FormInput';
import React from 'react';
import BlueButton from '../../../../components/buttons/BlueButton';
import PopUpMessage from '../PopUpMessage';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../app/store';
import { useSetPhoneNumberMutation } from '../../apiSlice';
import { setUser } from '../../../../app/userSlice';
import ErrorMessage from '../../../../components/messsages/Error';
import SelectMenu from '../../../../components/form/SelectMenu';
import countryData from '../../../../constants/targetCountries';


const { width } = Dimensions.get('window')

export default function GitHub() {
	const currentPhoneNumber = useSelector((state: RootState) => state.user.mobileNumber)
	const currentCountryCode = useSelector((state: RootState) => state.user.mobileCountryCode)
	const dispatch = useDispatch();
	const [newPhone, setNewPhone] = React.useState(currentPhoneNumber || '');
	const [newCountryCode, setNewCountryCode] = React.useState<string | null>(currentCountryCode || '');

	const [popUpVisible, setPopUpVisible] = React.useState(false);

	const [setPhone, { isLoading }] = useSetPhoneNumberMutation();

	const navigation = useNavigation();
	const [error, setError] = React.useState('')

	const countryCodes = countryData.map((country) => (
		[country.name, country.code]
	))

	async function updatePhone() {
		try {
			await setPhone({ mobileCountryCode: newCountryCode, mobile: newPhone }).unwrap()
			dispatch(setUser({ mobileNumber: newPhone, mobileCountryCode: newCountryCode }))
			setPopUpVisible(true)
		} catch (e) {
			console.log(e)
			setError('Something went wrong! Please try again later.')
		}
	}

	return (
		<Layout
			headerTitle='Phone'
		>			<PopUpMessage
				heading='Phone Number Updated'
				text='Your phone number has been successfully updated and will help keep your account secure and notifications timely.'
				visible={popUpVisible}
				setVisible={setPopUpVisible}
				onPress={() => navigation.goBack()}
				isLoading={false}
				singleButton
			/>

			<Text style={styles.heading}>Stay Connected</Text>
			<Text style={styles.content}>
				Adding your phone number ensures you receive timely notifications, enhances account security, and simplifies recovery if needed. Your number is securely handled and used solely to improve your experience.
			</Text>
			<Text style={[styles.content, { marginTop: 24 }]}>
				Kindly note, the phone number you provide will not appear on your public profile. It will only be used for verification and recruiter communication when you apply for a job.
			</Text>
			<View style={{ marginTop: 32, marginBottom: 48, flexDirection: 'row', gap: 16 }}>
				<View style={{ width: (width - 48) * 3 / 7 }}>
					<SelectMenu
						options={countryCodes}
						onSelect={setNewCountryCode}
						selected={newCountryCode}
						placeholder='Country Code'
					/>
				</View>
				<View style={{ width: (width - 48) * 4 / 7 }}>
					<InputField
						value={newPhone}
						onChangeText={setNewPhone}
						placeholder='Mobile number'
						topMargin={false}
						autocomplete='tel'

					/>
				</View>
			</View>
			<View style={{ gap: 8 }}>
				<BlueButton
					title='Update'
					disabled={(newPhone === currentPhoneNumber && newCountryCode === currentCountryCode) || newPhone === ''}
					onPress={updatePhone}
					loading={isLoading}
				/>
				<ErrorMessage message={error} />
			</View>
		</Layout>
	)
}
