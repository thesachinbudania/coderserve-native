import { StyleSheet, Text, View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import BlueButton from '../../../../components/buttons/BlueButton';
import NoBgButton from '../../../../components/buttons/NoBgButton';
import React from 'react';
import { useValidateOtpMutation, useResendOtpMutation } from '../../apiSlice';
import ErrorMessage from '../../../../components/messsages/Error';



export default function OtpValidator({ email, otpFor, nextStep }: { email: string, otpFor: string, nextStep: ({ refresh, access }: { refresh: string, access: string }) => void | (() => void) }) {
	const [otp, setOtp] = React.useState('');

	// errors while verifying otp
	const [verificationError, setVerificationError] = React.useState<string | null>(null);
	const [didErrored, setDidErrored] = React.useState(false);


	// state to keep track of verify button blockage
	const [isButtonDisabled, setIsButtonDisabled] = React.useState(true);

	React.useEffect(() => {
		if (otp.length === 6) {
			setIsButtonDisabled(false);
		}
		else {
			setIsButtonDisabled(true);
		}
	}, [otp]);

	function clearErrors() {
		setVerificationError(null);
		setDidErrored(false);
	}

	const [otpValidator, { isLoading }] = useValidateOtpMutation();
	const [otpResender, { isLoading: isResending }] = useResendOtpMutation();


	async function validateOtp() {
		clearErrors();
		const data = {
			email: email,
			otp: otp,
			otp_for: otpFor,
		}
		try {
			const response = await otpValidator(data).unwrap();
			const access = response.token.access;
			const refresh = response.token.refresh;
			nextStep({ refresh, access });
		}
		catch (error: any) {
			console.log(error, 'this is otp error')
			if (error.data.code === '0' || error.data.code === '1') {
				setIsButtonDisabled(true);
			}
			if (error.data.message) {
				setVerificationError(error.data.message);
			}
			else {
				setDidErrored(true);
			}
		}
	}

	// resend code timer function
	const [resendTimer, setResendTimer] = React.useState(60);
	React.useEffect(() => {
		if (resendTimer > 0) {
			const interval = setInterval(() => {
				setResendTimer(prev => prev - 1);
			}, 1000);
			return () => clearInterval(interval);
		}
	}, [resendTimer]);

	async function resendOtp() {
		clearErrors();
		try {
			await otpResender({ email: email, otp_for: otpFor }).unwrap();
			setResendTimer(60);
		}
		catch (error: any) {
			if (error.data.message) {
				setVerificationError(error.data.message);
			}
			else {
				setDidErrored(true);
			}
		}
	}

	return (
		<View
			style={{ gap: 48 }}
		>
			<OtpInput
				focusColor='#006dff'
				theme={{
					pinCodeContainerStyle: styles.otpContainer,
					pinCodeTextStyle: styles.otpText,
				}}
				onTextChange={(text) => setOtp(text)}
			/>
			{
				verificationError && (
					<Text style={styles.errorText}>{verificationError}</Text>
				)
			}
			<View style={styles.buttonContainer}>
				<BlueButton
					title='Verify'
					disabled={isButtonDisabled}
					onPress={validateOtp}
					loading={isLoading}
				/>
				<NoBgButton
					title='Resend code'
					loading={isResending}
					onPress={resendOtp}
					disabled={resendTimer > 0}

				/>
				{
					resendTimer > 0 && (
						<Text style={{ fontSize: 15 }}>Resend code will be available in {resendTimer} seconds</Text>
					)
				}
				{
					didErrored && (
						<ErrorMessage message='Something went wrong! Please try again or contact support.' />
					)
				}
			</View>
		</View>
	)
}


const styles = StyleSheet.create({
	otpContainer: {
		width: 50,
		height: 50,
		borderRadius: 8,
		borderColor: 'back',
	},
	otpText: {
		fontWeight: 'bold',
		fontSize: 27,
	},
	buttonContainer: {
		gap: 16,
	},
	errorText: {
		fontSize: 13,
		color: '#ff4c4c',
		textAlign: 'center',
	}
})
