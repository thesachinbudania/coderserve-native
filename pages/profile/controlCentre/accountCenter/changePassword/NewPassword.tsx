import Layout from '../../../../authentication/Layout';
import FieldHeading from '../../../../authentication/components/form/FieldHeading';
import PasswordField from '../../../../../components/form/PasswordField';
import { StyleSheet, View } from 'react-native';
import React from 'react';
import BlueButton from '../../../../../components/buttons/BlueButton';
import ErrorMessage from '../../../../../components/messsages/Error';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../app/store';
import { useChangePasswordMutation } from '../../../apiSlice';
import { useDispatch } from 'react-redux';
import { setToken } from '../../../../../app/slices';
import { useNavigation, StackActions } from '@react-navigation/native';
import { NavigationProp } from '../../../Page';


export default function NewPasswordScreen({ currentPassword }: { currentPassword: string }) {
	const [password, setPassword] = React.useState('');
	const [confirmPass, setConfirmPass] = React.useState('');
	const email = useSelector((state: RootState) => state.user.email);
	const [changePassword, { isLoading }] = useChangePasswordMutation();
	// states for taking care of errors in password
	const insufficientLength = password.length < 8;
	const casingError = !/[A-Z]/.test(password) || !/[a-z]/.test(password);
	const noNumber = !/[0-9]/.test(password);
	const hasSC = !/[^A-Za-z0-9]/.test(password);
	const dispatch = useDispatch();
	const navigation = useNavigation<NavigationProp>();

	const [error, setError] = React.useState('');

	React.useEffect(() => {
		setError('');
	}, [password, confirmPass]);

	function isFormValid() {
		return !insufficientLength && !casingError && !noNumber && !hasSC && password === confirmPass;
	}

	async function savePassword() {
		try {
			const response = await changePassword({ email: email, current_password: currentPassword, new_password: password }).unwrap();
			const accessToken = response.access_token;
			const refreshToken = response.refresh_token;
			dispatch(setToken({ accessToken, refreshToken }));
			const navigateAction = StackActions.replace('AccountCenter', {
				screen: 'Home',
				params: {
					popUpVisible: true,
					title: "You're All Set!",
					body: "Your password has been updated successfully. Remember to keep it safe and secure. If you encounter any issues, feel free to contact our support team."
				}
			});
			navigation.dispatch(navigateAction)
		}
		catch (e: any) {
			if (e.data.non_field_errors) {
				console.log(e.data.non_field_errors[0]);
				setError(e.data.non_field_errors[0]);
			}
			else {
				setError('Something went wrong! Please try again.');
			}
		}
	}

	return (
		<Layout
			title='Reset Password'
			secondaryText='Time to set your new password'
		>
			<View>
				<FieldHeading>New Password</FieldHeading>
				<PasswordField
					value={password}
					onChangeText={setPassword}
				/>				{
					password != '' && error === '' && (<View style={{ marginTop: 8 }}>
						<ErrorMessage message='At least 8 characters' status={insufficientLength ? 'error' : 'success'} />
						<ErrorMessage message='Contains both uppercase and lowercase letters' status={casingError ? 'error' : 'success'} />
						<ErrorMessage message='Includes number' status={noNumber ? 'error' : 'success'} />
						<ErrorMessage message='Contains at least one special character (e.g., !, @, #)' status={hasSC ? 'error' : 'success'} />
					</View>

					)
				}
			</View>
			<View>
				<FieldHeading>Re-enter New Password</FieldHeading>
				<PasswordField
					value={confirmPass}
					onChangeText={setConfirmPass}
				/>
				{
					confirmPass != '' && error === '' && (
						<View style={{ marginTop: 8 }}>
							<ErrorMessage
								message={password != confirmPass ? "Your passwords don't match" : 'Great! Your passwords match'}
								status={password != confirmPass ? 'error' : 'success'}
							/>
						</View>
					)
				}
				{
					error != '' && (
						<View style={{ marginTop: 8 }}>
							<ErrorMessage message={error} />
						</View>
					)
				}

			</View>
			<BlueButton
				title='Save'
				disabled={!isFormValid()}
				loading={isLoading}
				onPress={savePassword}
			/>
		</Layout>
	)
}
