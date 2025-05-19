import { Text, View } from 'react-native';
import AuthLayout from '../Layout';
import FieldHeading from '@/components/form/FieldHeading';
import FormInput from '@/components/form/FormInput';
import React from 'react';
import BlueButton from '../../../components/buttons/BlueButton';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { api } from '@/helpers/auth/axios';
import handleApiError from '@/helpers/apiErrorHandler';

const formSchema = zod.object({
	email: zod.string().email('Invalid email address').nonempty('Email is required'),
	otp_for: zod.string()
})

type FormData = zod.infer<typeof formSchema>;

export default function EmailScreen({ email, setEmail, setScreen }: { email: string, setEmail: React.Dispatch<React.SetStateAction<string>>, setScreen: React.Dispatch<React.SetStateAction<string>> }) {
	const { control, setError, handleSubmit, watch, formState: { isSubmitting, errors } } = useForm<FormData>({
		defaultValues: {
			email: '',
			otp_for: 'forgot_password'
		},
		resolver: zodResolver(formSchema),
	})
	const { email: emailValue } = watch();
	const handleEmailChange = (value: string) => {
		setEmail(value);
	}
	React.useEffect(() => {
		handleEmailChange(emailValue);
	}, [emailValue]);

	const sendOtp: SubmitHandler<FormData> = async (data) => {
		await api.put('/resend_otp/', data).then(
			(res) => {
				if (res.status === 200) {
					setScreen('otp');
				}
			}
		).catch((error) => {
			handleApiError(error, setError);
		});
	}

	return (
		<AuthLayout
			title='Forgot Password'
			secondaryText='Enter your registered email'
		>
			<Controller
				control={control}
				name='email'
				render={({ field: { onChange, value }, fieldState: { error } }) => (
					<>
						<View>
							<FieldHeading>Email</FieldHeading>
							<FormInput
								placeholder='example@gmail.com'
								value={value}
								onChangeText={onChange}
							/>
						</View>
						{error &&
							<Text style={{ color: '#ff4c4c', textAlign: 'center', fontSize: 13 }}>{error.message}</Text>
						}
					</>
				)}
			/>
			{errors.root?.message &&
				<Text style={{ color: '#ff4c4c', textAlign: 'center', fontSize: 13 }}>{errors.root.message}</Text>
			}
			<BlueButton
				title='Continue'
				disabled={!email}
				loading={isSubmitting}
				onPress={handleSubmit(sendOtp)}
			/>
		</AuthLayout>
	)
}
