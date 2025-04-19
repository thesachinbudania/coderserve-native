import AuthLayout from '../Layout';
import FieldHeading from '../components/form/FieldHeading';
import { BackHandler, View, Text, StyleSheet } from 'react-native';
import FormInput from '../../../components/form/FormInput';
import React from 'react';
import PasswordField from '../../../components/form/PasswordField';
import DefaultButton from '../../../components/buttons/DefaultButton';
import Checkbox from '../../../components/form/Checkbox';
import SmallTextButton from '../../../components/buttons/SmallTextButton';
import { useWizard } from 'react-use-wizard';
import { useSignUpMutation } from '../apiSlice';
import ErrorMessage from '../../../components/messsages/Error';
import { setEmailState } from './signUpSlice';
import { useDispatch } from 'react-redux';



export default function SignUpScreen({ navigate }: { navigate: (page: string) => void }) {
	const [firstName, setFirstName] = React.useState('');
	const [lastName, setLastName] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [email, setEmail] = React.useState('');
	const [termsAccepted, setTermsAccepted] = React.useState(true);
	const wizard = useWizard();
	const [signUp, { isLoading }] = useSignUpMutation();
	const dispatch = useDispatch();

	// states for taking care of errors in password
	const insufficientLength = password.length < 8;
	const casingError = !/[A-Z]/.test(password) || !/[a-z]/.test(password);
	const noNumber = !/[0-9]/.test(password);
	const hasSC = !/[^A-Za-z0-9]/.test(password);

	// error handling
	const [emailError, setEmailError] = React.useState('');
	const [error, setError] = React.useState('');

	React.useEffect(() => {
		const backAction = () => {
			navigate('signIn');
			return true;
		};

		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			backAction,
		);

		return () => backHandler.remove();
	})


	// function to clear all the errors
	function clearErrors() {
		setEmailError('');
		setError('');
	}
	// handling the submission of the form
	const handleSubmit = async () => {
		const userData = {
			first_name: firstName,
			last_name: lastName,
			email: email,
			password: password,
		}
		try {
			clearErrors();
			await signUp(userData).unwrap();
			dispatch(setEmailState({ email: email }));
			wizard.nextStep();
		} catch (error: any) {
			if (error.data.email[0]) {
				setEmailError(error.data.email[0])
			}
			else {
				setError('Something went wrong! Please try again later or contact support.')
			}
		}
	}

	// function to check if all the fields are filled and the checkbox is checked
	function isFormValid() {
		return firstName && lastName && email && password && termsAccepted && !insufficientLength && !casingError && !noNumber && !hasSC;
	}

	return (
		<AuthLayout title='Create account' secondaryText="Let's create an Account for you">
			<View>
				<FieldHeading>First Name</FieldHeading>
				<FormInput
					placeholder="John"
					value={firstName}
					onChangeText={setFirstName}
					autocomplete={'name'}
				/>
			</View>
			<View>
				<FieldHeading>Last Name</FieldHeading>
				<FormInput
					placeholder="Doe"
					value={lastName}
					onChangeText={setLastName}
					autocomplete={'name'}
				/>
			</View>
			<View>
				<FieldHeading>Email</FieldHeading>
				<FormInput
					placeholder="Email"
					value={email}
					onChangeText={setEmail}
					autocomplete={'email'}
				/>
				<View style={{ marginTop: 8 }}>
					<ErrorMessage message={emailError} />
				</View>
			</View>
			<View>
				<FieldHeading>Password</FieldHeading>
				<PasswordField
					value={password}
					onChangeText={setPassword}
				/>
				{
					password != '' && (<View style={{ marginTop: 8 }}>
						<ErrorMessage message='At least 8 characters' status={insufficientLength ? 'error' : 'success'} />
						<ErrorMessage message='Contains both uppercase and lowercase letters' status={casingError ? 'error' : 'success'} />
						<ErrorMessage message='Includes number' status={noNumber ? 'error' : 'success'} />
						<ErrorMessage message='Contains at least one special character (e.g., !, @, #)' status={hasSC ? 'error' : 'success'} />
					</View>

					)
				}
			</View>
			<View>
				<View style={{ marginBottom: 8 }}>
					<ErrorMessage message={error} />
				</View>
				<Checkbox
					state={termsAccepted}
					setState={setTermsAccepted}
				>
					<View style={{ maxWidth: '90%', flexDirection: 'row', flexWrap: 'wrap' }}>
						<Text style={styles.termsText}>By signing up, you agree to our </Text>
						<SmallTextButton
							underline={true}
							title={'Terms & Conditions'}
						/>
						<Text style={styles.termsText}> and </Text>
						<SmallTextButton
							underline={true}
							title={'Privacy Policy'}
						/>
					</View>
				</Checkbox>
			</View>
			<DefaultButton
				title='Sign Up'
				onPress={handleSubmit}
				loading={isLoading}
				disabled={!isFormValid()}
			/>
			<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
				<Text style={{ fontSize: 13, color: '#737373' }}>Already have an account? </Text>
				<SmallTextButton
					underline={true}
					title={'Sign In'}
					onPress={() => navigate('signIn')}
				/>
			</View>

		</AuthLayout>
	)
}

const styles = StyleSheet.create({
	termsText: {
		fontSize: 13,
		color: '#737373',
	}
})

