import { Text, StyleSheet, View } from 'react-native';
import Layout from '@/components/auth/Layout';
import FormInput from '@/components/form/FormInput';
import FieldHeading from '@/components/form/FieldHeading';
import BlueButton from '@/components/buttons/BlueButton';
import React from 'react';
import { useChangeEmailSendOtpMutation } from '@/helpers/profile/apiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/appHelpers/store';
import ErrorText from '@/components/messsages/Error';
import { useWizard } from 'react-use-wizard';

export default function NewEmail({ setNewEmail }: { setNewEmail: React.Dispatch<React.SetStateAction<string>> }) {
	const [email, setEmail] = React.useState('')
	const [sendOtpRequest, { isLoading }] = useChangeEmailSendOtpMutation();
	const currentEmail = useSelector((state: RootState) => state.user.email);
	const wizard = useWizard();
	const [error, setError] = React.useState('');

	async function handleContinue() {
		try {
			setError('');
			await sendOtpRequest({ email: currentEmail, temp_email: email }).unwrap();
			setNewEmail(email);
			wizard.nextStep();
		}
		catch (error: any) {
			if (error.data.non_field_errors) {
				setError(error.data.non_field_errors[0]);
			}
			else {
				console.log(error);
				setError('An error occurred. Please try again later.');
			}
		}
	}

	return (
		<Layout
			title='Update Email'
			secondaryText='Enter Your New Email Address'
		>
			<View>
				<FieldHeading>
					Email
				</FieldHeading>
				<FormInput
					placeholder='example@gmail.com'
					value={email}
					onChangeText={setEmail}
				/>
				{error && <View style={{ marginTop: 8 }}><ErrorText message={error}></ErrorText></View>}
			</View>
			<View style={{ gap: 16 }}>
				<BlueButton
					title='Continue'
					disabled={email === '' || !email.includes('@') || !email.includes('.')}
					onPress={handleContinue}
					loading={isLoading}
				/>
				<Text style={styles.infoText}>Once you click Continue, a verification code will be sent to your new email address to complete your request to change your email.</Text>
			</View>
		</Layout>
	)
}



const styles = StyleSheet.create({
	infoText: {
		fontSize: 13,
		color: '#737373',
		textAlign: 'justify'
	}
})
