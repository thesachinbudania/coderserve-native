import Jobs from './Home';
import JobsView from './jobView/page';
import Filters from './filters/page';
import MessagesPage from './messages/page';
import ResumeHome from './resume/page';
import EmploymentStatus from './employmentStatus/page';
import SalaryExpectations from './salaryExpectations/page';
import UpdateResume from './resume/editResume';
import About from './resume/about/page';
import WorkExperience from './resume/workExperience/page';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';




type StackParamList = {
	Home: undefined,
	JobView: undefined,
	Filters: undefined,
	Messages: undefined,
	ResumeHome: undefined,
	EmploymentStatus: undefined,
	SalaryExpectations: undefined,
	UpdateResume: undefined,
	About: undefined,
	WorkExperience: undefined,
}

const Navigator = createNativeStackNavigator<StackParamList>();
export type NavigationProps = NativeStackNavigationProp<StackParamList>

export default function JobsPage() {
	return (
		<Navigator.Navigator
			screenOptions={{
				headerShown: false
			}}
		>
			<Navigator.Screen name='Home' component={Jobs} />
			<Navigator.Screen name='JobView' component={JobsView} />
			<Navigator.Screen name='Filters' component={Filters} />
			<Navigator.Screen name='Messages' component={MessagesPage} />
			<Navigator.Screen name='ResumeHome' component={ResumeHome} />
			<Navigator.Screen name='EmploymentStatus' component={EmploymentStatus} />
			<Navigator.Screen name='SalaryExpectations' component={SalaryExpectations} />
			<Navigator.Screen name='UpdateResume' component={UpdateResume} />
			<Navigator.Screen name='About' component={About} />
			<Navigator.Screen name='WorkExperience' component={WorkExperience} />
		</Navigator.Navigator>
	)
}

