import EmailScreen from './EmailScreen';
import { Wizard } from 'react-use-wizard';
import { BackHandler } from 'react-native';
import OtpScreen from './OtpScreen';
import React from 'react';
import PasswordScreen from './PassswordScreen';
import SuccessScreen from './SuccessScreen';


export default function Page({ navigate }: { navigate: (page: string) => void }) {
	const [screen, setScreen] = React.useState('email')
	const [email, setEmail] = React.useState('')

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
