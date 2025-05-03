import OtpPage from './OtpPage';
import ChooseUsernameScreen from './profileDetails/ChooseUsername';
import ProfileImageScreen from './profileDetails/ProfileImage';
import LocationSelectPage from './profileDetails/Location';
import SignUpScreen from './SignUpScreen';
import { Wizard, useWizard } from 'react-use-wizard';
import React from 'react';


export default function Page({ navigate, screen = 1 }: { navigate: (page: string) => void, screen?: number }) {
	return (
		<Wizard>
			<Controller step={screen} />
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

const Controller = ({ step }: { step: number }) => {
	const { goToStep } = useWizard();

	React.useEffect(() => {
		goToStep(step);
	}, [step]);

	return null; // invisible controller
};
