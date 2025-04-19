import Layout from './Layout';
import { View, StyleSheet } from 'react-native';
import InputField from '../../../../components/form/FormInput';
import BlueButton from '../../../../components/buttons/BlueButton';
import { useWizard } from 'react-use-wizard';
import { useVerifyUsernameTakenMutation, useSetUsernameMutation } from '../../apiSlice';
import React from 'react';
import ErrorMessage from '../../../../components/messsages/Error';


export default function ChooseUsernameScreen() {
	const wizard = useWizard();
	const [verifyUsernameTaken] = useVerifyUsernameTakenMutation();
	const [setUsernameApi, { isLoading }] = useSetUsernameMutation();
	const timeoutRef = React.useRef<any>();
	const [username, setUsername] = React.useState('');
	const [message, setMessage] = React.useState('');
	const [didErrored, setDidErrored] = React.useState(false);


	async function verifyUsername() {
		try {
			await verifyUsernameTaken(username).unwrap();
			setDidErrored(false);
			setMessage("Congratulations! The username you've chosen is available and ready for you to claim.");
		}
		catch (error: any) {
			setDidErrored(true);
			const errorMessage = error.data.username[0];
			if (errorMessage === 'custom user with this username already exists.') {
				setMessage("Oops, it looks like you're a bit late – that username is already taken.");
			}
			else if (errorMessage) {
				setMessage(errorMessage);
			}
			else {
				setMessage('Something went wrong!')
			}
		}
	}


	async function updateUsername() {
		try {
			await setUsernameApi(username).unwrap();
			wizard.nextStep();
		}
		catch (error: any) {
			setMessage('Something went wrong! Please try again.');
			setDidErrored(true);

		}
	}


	React.useEffect(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		if (username.length > 0) {
			timeoutRef.current = setTimeout(() => {
				verifyUsername();
			}, 500);
		}
		else {
			setMessage('');
		}

	}, [username])


	return (
		<Layout
			step='Step 1 of 3'
			title='Username'
			subtitle='Create a unique username that represents your professional identity.'
		>
			<View style={styles.content}>
				<View style={{ gap: 8 }}>
					<InputField
						placeholder='john'
						value={username}
						onChangeText={setUsername}
					/>
					<ErrorMessage message={message} status={didErrored ? 'error' : "success"} />
				</View>
				<BlueButton
					title='Next'
					onPress={updateUsername}
					disabled={username.length === 0 || didErrored}
					loading={isLoading}
				/>
			</View>
		</Layout>
	)
}


const styles = StyleSheet.create({
	content: {
		marginTop: 40,
		gap: 48,
	}
})
