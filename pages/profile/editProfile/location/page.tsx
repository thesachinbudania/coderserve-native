import { StyleSheet, Text, View } from 'react-native'
import Layout from '../../controlCentre/accountCenter/PageLayout';
import LocationSelectMenu from '../../../../components/form/LocationSelectMenu';
import React from 'react';
import BlueButton from '../../../../components/buttons/BlueButton';
import { useSetLocationMutation } from '../../apiSlice';
import ErrorMessage from '../../../../components/messsages/Error';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../../../app/userSlice';
import { RootState } from '../../../../app/store';
import PopUpMessage from '../PopUpMessage';

export default function Location() {
	const currentCountry = useSelector((state: RootState) => state.user.country)
	const currentState = useSelector((state: RootState) => state.user.state)
	const currentCity = useSelector((state: RootState) => state.user.city)

	const [selectedCountry, setSelectedCountry] = React.useState<string | null>(currentCountry);
	const [selectedState, setSelectedState] = React.useState<string | null>(currentState);
	const [selectedCity, setSelectedCity] = React.useState<string | null>(currentCity);

	const dispatch = useDispatch();
	const navigation = useNavigation();

	const [error, setError] = React.useState('')
	const [popUpVisible, setPopUpVisible] = React.useState(false);

	const [setLocation, { isLoading }] = useSetLocationMutation();

	async function saveLocation() {
		try {
			await setLocation({ country: selectedCountry, state: selectedState, city: selectedCity }).unwrap()
			dispatch(setUser({ country: selectedCountry, state: selectedState, city: selectedCity }))
			setPopUpVisible(true)
		}
		catch (e) {
			console.log(e)
			setError('Something went wrong! Please try again later.')
		}
	}

	return (
		<Layout
			headerTitle='Location'
		>
			<PopUpMessage
				heading='Location Updated'
				text='Your new location has been saved. Enjoy content, events, and recommendations tailored to your area.'
				visible={popUpVisible}
				setVisible={setPopUpVisible}
				onPress={() => navigation.goBack()}
				isLoading={false}
				singleButton
			/>
			<Text style={styles.heading}>Personalize Your Local Experience</Text>
			<Text style={styles.content}>
				Sharing your location allows us to serve you regional content, local events, and community insights tailored to your area. This helps create a more meaningful and connected experience, ensuring you get the most relevant updates while keeping your data private.
			</Text>
			<Text style={[styles.content, { marginTop: 24 }]}>
				Kindly note, the location information you provide will be visible to everyone on and off Coder Serve unless your profile is set to private.
			</Text>
			<View style={{ marginTop: 32, marginBottom: 48 }}>
				<LocationSelectMenu
					selectedCountry={selectedCountry}
					setSelectedCountry={setSelectedCountry}
					selectedState={selectedState}
					setSelectedState={setSelectedState}
					selectedCity={selectedCity}
					setSelectedCity={setSelectedCity}
				/>
			</View>
			<View style={{ marginBottom: 8 }}>
				<BlueButton
					title='Update'
					onPress={saveLocation}
					loading={isLoading}
					disabled={currentCountry === selectedCountry && currentCity === selectedCity && currentState === selectedState}
				/>
			</View>
			<ErrorMessage message={error} />
		</Layout>
	)
}


export const styles = StyleSheet.create({
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
