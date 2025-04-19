import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack'
import AccountCenter from './AccountCenter';
import UpdateEmail from './updateEmail/page';
import ChangePassword from './changePassword/page';
import ForgotPassword from './changePassword/ForgotPassword';
import LoginHistory from './loginHistory/page';
import DevicePermissions from './devicePermissions/page';
import AccountStatus from './accountStatus/page';
import AdManagement from './adManagement/page';

export type AccountCenterStackParamList = {
	Home: {
		popUpVisible: boolean,
		title: string,
		body: string,
	};
	UpdateEmail: undefined;
	ChangePassword: undefined;
	ForgotPassword: undefined;
	LoginHistory: undefined;
	DevicePermissions: undefined;
	AccountStatus: undefined;
	AdManagement: undefined;
}

export type StackProps = NativeStackNavigationProp<AccountCenterStackParamList>;

const Stack = createNativeStackNavigator<AccountCenterStackParamList>();

export default function Navigation() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Home" component={AccountCenter} />
			<Stack.Screen name="UpdateEmail" component={UpdateEmail} />
			<Stack.Screen name="ChangePassword" component={ChangePassword} />
			<Stack.Screen name="ForgotPassword" component={ForgotPassword} />
			<Stack.Screen name="LoginHistory" component={LoginHistory} />
			<Stack.Screen name="DevicePermissions" component={DevicePermissions} />
			<Stack.Screen name="AccountStatus" component={AccountStatus} />
			<Stack.Screen name="AdManagement" component={AdManagement} />
		</Stack.Navigator>
	)
}


