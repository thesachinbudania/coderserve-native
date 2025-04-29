
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import Home from './home/page';
import ControlCentre from './controlCentre/page';
import EditProfile from './editProfile/page';
import EditProfileImage from './editProfile/profileImage/page';
import EditProfileUsername from './editProfile/username/page';
import EditProfileName from './editProfile/name/page';
import EditProfileLocation from './editProfile/location/page';
import EditProfileGithub from './editProfile/github/page';
import EditProfileWebsite from './editProfile/website/page';
import EditProfilePhone from './editProfile/phone/page';
import EditProfileWhatsapp from './editProfile/whatsapp/page';
import EditProfileBirthDate from './editProfile/birthDate/page';
import EditProfileGender from './editProfile/gender/page';
import EditProfileBackground from './editProfile/background/page';
import EditProfileUploadBackground from './editProfile/background/UploadBackground';
import AccountCenter from './controlCentre/accountCenter/page';
import About from '../jobs/resume/about/page';
import WorkExperience from '../jobs/resume/workExperience/page';
import Education from '../jobs/resume/education/page';
import OtherCertifications from '../jobs/resume/otherCertifications/page';
import Skills from '../jobs/resume/skills/page';
import Languages from '../jobs/resume/languages/page';
import type { AccountCenterStackParamList } from './controlCentre/accountCenter/page';

export type StackParamList = {
	Home: undefined;
	Options: undefined;
	AccountCenter: {
		screen: keyof AccountCenterStackParamList;
		params: AccountCenterStackParamList[keyof AccountCenterStackParamList];
	};
	EditProfile: undefined;
	EditProfileImage: undefined;
	EditProfileUsername: undefined;
	EditProfileName: undefined;
	EditProfileLocation: undefined;
	EditProfileGithub: undefined;
	EditProfileWebsite: undefined;
	EditProfilePhone: undefined;
	EditProfileWhatsapp: undefined;
	EditProfileBirthDate: undefined;
	EditProfileGender: undefined;
	EditProfileBackground: undefined;
	EditProfileUploadBackground: undefined;
	About: undefined;
	WorkExperience: {
		edit: boolean;
		id: number | null;
	};
	Education: {
		edit: boolean;
		id: number | null;
	};
	OtherCertifications: {
		edit: boolean;
		id: number | null;
	};
	Skills: undefined;
	Languages: {
		edit: boolean;
		id: number | null;
	};
};

export type NavigationProp = NativeStackNavigationProp<StackParamList>;

const Stack = createNativeStackNavigator<StackParamList>();

export default function StackNavigator() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Home" component={Home} />
			<Stack.Screen name="Options" component={ControlCentre} />
			<Stack.Screen name="AccountCenter" component={AccountCenter} />
			<Stack.Screen name="EditProfile" component={EditProfile} />
			<Stack.Screen name="EditProfileImage" component={EditProfileImage} />
			<Stack.Screen name="EditProfileUsername" component={EditProfileUsername} />
			<Stack.Screen name="EditProfileName" component={EditProfileName} />
			<Stack.Screen name="EditProfileLocation" component={EditProfileLocation} />
			<Stack.Screen name="EditProfileGithub" component={EditProfileGithub} />
			<Stack.Screen name="EditProfileWebsite" component={EditProfileWebsite} />
			<Stack.Screen name="EditProfilePhone" component={EditProfilePhone} />
			<Stack.Screen name="EditProfileWhatsapp" component={EditProfileWhatsapp} />
			<Stack.Screen name="EditProfileBirthDate" component={EditProfileBirthDate} />
			<Stack.Screen name="EditProfileGender" component={EditProfileGender} />
			<Stack.Screen name="EditProfileBackground" component={EditProfileBackground} />
			<Stack.Screen name="EditProfileUploadBackground" component={EditProfileUploadBackground} />
			<Stack.Screen name="About" component={About} />
			<Stack.Screen name="WorkExperience" component={WorkExperience} initialParams={{ edit: false, id: null }} />
			<Stack.Screen name="Education" component={Education} initialParams={{ edit: false, id: null }} />
			<Stack.Screen name="OtherCertifications" component={OtherCertifications} initialParams={{ edit: false, id: null }} />
			<Stack.Screen name="Skills" component={Skills} />
			<Stack.Screen name="Languages" component={Languages} initialParams={{ edit: false, id: null }} />
		</Stack.Navigator>
	);
}
