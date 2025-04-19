import { Text, View, StyleSheet } from 'react-native';
import BlueButton from '../../../components/buttons/BlueButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { setToken } from '../../../app/slices';
import { setUser } from '../../../app/userSlice';
import { useTokenValidatorMutation } from '../apiSlice';
import React from 'react';
import Error from '../../../components/messsages/Error';

export default function SuccessScreen() {
	const dispatch = useDispatch();
	const { access, refresh } = useSelector((state: RootState) => state.signUp.token);
	const [validateToken, { isLoading }] = useTokenValidatorMutation();
	const [error, setError] = React.useState('');

	async function setTokens() {
		try {
			const response = await validateToken({}).unwrap();
			const username = response.username;
			const userEmail = response.email;
			const firstName = response.first_name;
			const lastName = response.last_name;
			const profilePicture = response.profile_image;
			const backgroundCode = response.background_pattern_code;
			const backgroundType = response.background_type;
			const backgroundImage = response.background_image;
			const country = response.country;
			const city = response.city;
			const state = response.state;
			const dateJoined = response.date_joined;
			const gitHub = response.gitHub;
			const dobDate = response.dobDate;
			const dobMonth = response.dobMonth;
			const dobYear = response.dobYear;
			const website = response.website;
			const mobileCountryCode = response.mobileCountryCode;
			const mobileNumber = response.mobileNumber;
			const whatsappCountryCode = response.whatsappCountryCode;
			const whatsappNumber = response.whatsappNumber;
			dispatch(setUser({ username, email: userEmail, firstName, lastName, profilePicture, backgroundCode, backgroundType, backgroundImage, country, city, state, dateJoined, gitHub, dobDate, dobMonth, dobYear, website, mobileCountryCode, mobileNumber, whatsappCountryCode, whatsappNumber }));
			dispatch(setToken({ refreshToken: refresh, accessToken: access }));
		}
		catch {
			setError('Something went wrong! Try again later.')
		}
	}

	return (
		<View style={styles.container}>
			<Text style={styles.heading}>You're All Set!</Text>
			<Text style={styles.text}>Your password has been updated successfully. Remember to keep it safe and secure. If you encounter any issues, feel free to contact our support team.</Text>
			<View style={styles.buttonContainer}>
				<BlueButton
					title='Okay'
					onPress={setTokens}
					loading={isLoading}
				/>
			</View>
			<Error
				message={error}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 16,
		backgroundColor: 'white'
	},
	heading: {
		fontSize: 15,
		fontWeight: 'bold',
		marginBottom: 16,
	},
	text: {
		fontSize: 13,
		textAlign: 'center',
		color: '#737373'
	},
	buttonContainer: {
		width: '100%',
		marginTop: 48,
		marginBottom: 8
	}
})
