import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';

export default function Layout() {
	return (
		<>
			<StatusBar backgroundColor={'#202020'} barStyle={'light-content'} />
			<Stack
				screenOptions={{ headerShown: false }}
			>
			</Stack>
		</>
	)
}
