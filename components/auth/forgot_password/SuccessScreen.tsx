import { Text, View, StyleSheet } from 'react-native';
import BlueButton from '@/components/buttons/BlueButton';
import { useUserStore, useTokensStore } from '@/zustand/stores';
import { useStore } from '@/zustand/auth/stores';
import React from 'react';
import Error from '../../../components/messsages/Error';
import secureApi from '@/helpers/auth/axios';
import { useRouter } from 'expo-router';

export default function SuccessScreen() {
	const { access, refresh } = useStore(state => state);
	const [error, setError] = React.useState('');
	const setUser = useUserStore((state) => state.setUser);
	const setToken = useTokensStore((state) => state.setTokens);
	const router = useRouter();
	const [isLoading, setIsLoading] = React.useState(false)

	const setTokens = async () => {
		setIsLoading(true)
		await secureApi.get('/auth_token_validator/').then(
			response => {
				setUser({
					username: response.data.username,
					email: response.data.email,
					first_name: response.data.first_name,
					last_name: response.data.last_name,
					profile_image: response.data.profile_image,
					background_pattern_code: response.data.background_pattern_code,
					background_type: response.data.background_type,
					background_image: response.data.background_image,
					country: response.data.country,
					city: response.data.city,
					state: response.data.state,
					date_joined: response.data.date_joined,
					gitHub: response.data.gitHub,
					dobDate: response.data.dobDate,
					dobMonth: response.data.dobMonth,
					dobYear: response.data.dobYear,
					website: response.data.website,
					mobileCountryCode: response.data.mobileCountryCode,
					mobileNumber: response.data.mobileNumber,
					whatsappCountryCode: response.data.whatsappCountryCode,
					whatsappNumber: response.data.whatsappNumber
				})
				setToken({ access, refresh });
				router.replace('/')
			}
		).catch(() => {
			setIsLoading(false)
			setError('Something went wrong! Please try loggin in with you new password.')
		})


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
