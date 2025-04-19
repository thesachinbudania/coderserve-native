import OtpPage from './OtpPage';
import ChooseUsernameScreen from './profileDetails/ChooseUsername';
import ProfileImageScreen from './profileDetails/ProfileImage';
import LocationSelectPage from './profileDetails/Location';
import SignUpScreen from './SignUpScreen';
import { Wizard } from 'react-use-wizard';
import React from 'react';


export default function Page({ navigate }: { navigate: (page: string) => void }) {
	return (
		<Wizard>
			<SignUpScreen
				navigate={navigate}
			/>
			<OtpPage />
			<ChooseUsernameScreen />
			<ProfileImageScreen />
			<LocationSelectPage />
		</Wizard>

	)
}
