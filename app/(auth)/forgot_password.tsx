import EmailScreen from '@/components/auth/forgot_password/EmailScreen';
import { Wizard } from 'react-use-wizard';
import OtpScreen from '@/components/auth/forgot_password/OtpScreen';
import React from 'react';
import PasswordScreen from '@/components/auth/forgot_password/PassswordScreen';
import SuccessScreen from '@/components/auth/forgot_password/SuccessScreen';


export default function Page() {
	const [screen, setScreen] = React.useState('email')
	const [email, setEmail] = React.useState('')

	return (
		<Wizard>
			{
				screen === 'email' ?
					<EmailScreen
						email={email}
						setEmail={setEmail}
						setScreen={setScreen}
					/> :
					screen === 'otp' ?
						<OtpScreen
							setScreen={setScreen}
							email={email}
						/> :
						screen === 'password' ?
							<PasswordScreen
								email={email}
								setScreen={setScreen}
							/> :
							screen === 'success' &&
							<SuccessScreen />
			}
		</Wizard>
	)
}
