import Layout from '@/components/auth/sign_up/profileDetails/Layout';
import { View, StyleSheet } from 'react-native';
import InputField from '@/components/form/FormInput';
import BlueButton from '@/components/buttons/BlueButton';
import { useWizard } from 'react-use-wizard';
import React from 'react';
import ErrorMessage from '@/components/messsages/Error';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import secureApi from '@/helpers/auth/axios';
import handleApiError from '@/helpers/apiErrorHandler';

const formSchema = zod.object({
	username: zod.string().min(1, { message: 'Username is required' }),
})

type FormData = zod.infer<typeof formSchema>;


export default function ChooseUsernameScreen() {
	const wizard = useWizard();
	const { setError, handleSubmit, watch, control, formState: { isSubmitting } } = useForm<FormData>({
		defaultValues: {
			username: '',
		},
		resolver: zodResolver(formSchema),
	})

	const updateUsername: SubmitHandler<FormData> = async (data) => {
		await secureApi.put('/set_username/', data).then(() => {
			wizard.nextStep();
		}).catch(error => {
			handleApiError(error, setError)
		})

	}

	const timeoutRef = React.useRef<any>();
	const { username } = watch();
	const [message, setMessage] = React.useState('');
	const [didErrored, setDidErrored] = React.useState(false);


	async function verifyUsername() {
		await secureApi.put('/verify_username_taken/', { username }).then(() => {
			setDidErrored(false);
			setMessage("Congratulations! The username you've chosen is available and ready for you to claim.");
		}).catch(error => {
			setDidErrored(true);
			const errorMessage = error.response.data.username[0];
			if (errorMessage === 'custom user with this username already exists.') {
				setMessage("Oops, it looks like you're a bit late – that username is already taken.");
			}
			else if (errorMessage) {
				setMessage(errorMessage);
			}
			else {
				setMessage('Something went wrong!')
			}
		})
	}

	React.useEffect(() => {
		setDidErrored(true)
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
					<Controller
						control={control}
						name='username'
						render={({ field: { value, onChange } }) => (
							<InputField
								placeholder='john'
								value={value}
								onChangeText={onChange}
							/>
						)}
					/>
					<ErrorMessage message={message} status={didErrored ? 'error' : "success"} />
				</View>
				<BlueButton
					title='Next'
					onPress={handleSubmit(updateUsername)}
					disabled={username.length === 0 || didErrored}
					loading={isSubmitting}
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
