import { Wizard } from 'react-use-wizard';
import CurrentPasswordScreen from './CurrentPassword';
import NewPasswordScreen from './NewPassword';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { BackHandler } from 'react-native';


export default function ChangePasswordFlow() {
	const navigation = useNavigation();
	const handleBackButtonPress = () => {
		navigation.goBack();
		return true;
	};
	React.useEffect(() => {
		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			handleBackButtonPress,
		);

		return () => backHandler.remove();
	}, []);
	const [currentPassword, setCurrentPassword] = React.useState('');
	return (
		<Wizard>
			<CurrentPasswordScreen
				currentPassword={currentPassword}
				setCurrentPassword={setCurrentPassword}
			/>
			<NewPasswordScreen
				currentPassword={currentPassword}
			/>
		</Wizard>
	)
}
