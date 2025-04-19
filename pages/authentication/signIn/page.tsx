import AuthLayout from '../Layout';
import FieldHeading from "../components/form/FieldHeading";
import FormInput from "../../../components/form/FormInput";
import PasswordField from "../../../components/form/PasswordField";
import { View, StyleSheet, Text } from 'react-native';
import DefaultButton from '../../../components/buttons/DefaultButton';
import React from 'react';
import SmallTextButton from '../../../components/buttons/SmallTextButton';
import { useSignInMutation } from '../apiSlice';
import TimedError from '../../../components/messsages/TimedError';
import { useDispatch } from 'react-redux';
import { setToken } from '../../../app/slices';
import { setUser } from '../../../app/userSlice';
import DeviceInfo from 'react-native-device-info';


export default function SignIn({ navigate }: { navigate: (page: string) => void }) {
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [sendSignInRequest, { isLoading }] = useSignInMutation();
	const [error, setError] = React.useState('');
	const [errorKey, setErrorKey] = React.useState(0);
	const dispatch = useDispatch();
	const device = DeviceInfo.getBrand() + ' ' + DeviceInfo.getModel();

	async function signIn() {
		setError('');
		try {
			const response = await sendSignInRequest({ email_or_username: email, password, deviceName: device }).unwrap();
			const refreshToken = response.token.refresh;
			const accessToken = response.token.access;
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
			dispatch(setToken({ refreshToken, accessToken }));
			dispatch(setUser({ username, email: userEmail, firstName, lastName, profilePicture, backgroundCode, backgroundType, backgroundImage, country, city, state, dateJoined, device, gitHub, dobDate, dobMonth, dobYear, website, mobileCountryCode, mobileNumber, whatsappCountryCode, whatsappNumber }));
		} catch (e) {
			console.log(e)
			setErrorKey(errorKey + 1)
			setError('Invalid Credentials');
		}
	}

	return (
		<AuthLayout title="Welcome back" secondaryText="Sign in to your account">
			<View>
				<FieldHeading>Email/Username</FieldHeading>
				<FormInput
					placeholder="example@gmail.com"
					value={email}
					onChangeText={setEmail}
				/>
			</View>
			<View>
				<FieldHeading>Password</FieldHeading>
				<PasswordField
					value={password}
					onChangeText={setPassword}
				/>
				<View style={styles.forgotPasswordView}>
					<SmallTextButton title={'Forgot password?'} onPress={() => navigate('forgotPassword')} />
				</View>
			</View>
			<TimedError messageKey={errorKey} message={error} />
			<DefaultButton
				title={'Sign In'}
				disabled={!(email && password)}
				loading={isLoading}
				onPress={signIn}
			/>
			<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
				<Text style={{ fontSize: 13, color: '#737373' }}>Don't have an account? </Text>
				<SmallTextButton
					underline={true}
					title={'Sign Up'}
					onPress={() => navigate('signUp')}
				/>
			</View>
		</AuthLayout>
	)
}

const styles = StyleSheet.create({
	forgotPasswordView: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginTop: 8,
	}
})
