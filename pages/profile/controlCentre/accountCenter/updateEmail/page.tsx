import { BackHandler, Text, StyleSheet, View } from 'react-native';
import Layout from '../../../../authentication/Layout';
import React from 'react';
import FieldHeading from '../../../../authentication/components/form/FieldHeading';
import BlueButton from '../../../../../components/buttons/BlueButton';
import ErrorText from '../../../../../components/messsages/Error';
import { useSendOtpMutation } from '../../../apiSlice'
import VerifyCurrentEmail from './VerifyCurrentEmail';
import SetNewEmail from './NewEmail';
import { Wizard, useWizard } from 'react-use-wizard';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../app/store';
import NewEmailVerification from './NewEmailVerification';
import { useNavigation } from '@react-navigation/native';

function UpdateEmail() {
	const [sendOtpRequest, { isLoading }] = useSendOtpMutation();
	const [error, setError] = React.useState('');
	const { nextStep } = useWizard();
	const email = useSelector((state: RootState) => state.user.email);

	const handleContinue = async () => {
		try {
			setError('');
			await sendOtpRequest({ email, otp_for: 'change_email' }).unwrap();
			nextStep();
		}
		catch (error: any) {
			if (error.data.message) {
				setError(error.data.message);
			}
			else {
				console.log(error.data);
				setError('An error occurred. Please try again later.');
			}
		}
	}
	return (
		<View style={{ flex: 1, backgroundColor: '#0d0d0d' }}>
			<Layout
				title='Update Email'
				secondaryText='Your Current Email Address'
			>
				<View style={styles.fieldContainer}>
					<FieldHeading>Email</FieldHeading>
					<View style={styles.emailInput}>
						<Text>{email}</Text>
					</View>
					{error && <ErrorText message={error}></ErrorText>}
				</View>
				<View style={{ gap: 16 }}>
					<BlueButton
						title='Continue'
						onPress={handleContinue}
						loading={isLoading}
					/>
					<Text style={styles.infoText}>Once you click Continue, a verification code will be sent to your current email address to confirm your request to change your email. If you no longer have access to your registered email, please click here</Text>
				</View>
			</Layout>
		</View>
	)
}


const styles = StyleSheet.create({
	fieldContainer: {
		gap: 8,
	},
	emailInput: {
		height: 45,
		borderRadius: 8,
		backgroundColor: '#f4f4f4',
		justifyContent: 'center',
		paddingLeft: 16,
	},
	infoText: {
		fontSize: 13,
		color: '#737373',
		textAlign: 'justify',
	}
})


export default function EmailUpdateScreens() {
	const [newEmail, setNewEmail] = React.useState('');
	const navigation = useNavigation();
	const handleBackButtonPress = () => {
		navigation.goBack();
		return true;
	};
	React.useEffect(() => {
		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			handleBackButtonPress,
		);

		return () => backHandler.remove();
	}, []);
	return (
		<Wizard>
			<UpdateEmail />
			<VerifyCurrentEmail />
			<SetNewEmail setNewEmail={setNewEmail} />
			<NewEmailVerification newEmail={newEmail} />
		</Wizard>
	)
}
