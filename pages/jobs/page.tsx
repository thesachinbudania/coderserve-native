import Jobs from "./Home";
import JobsView from "./jobView/page";
import Filters from "./filters/page";
import MessagesPage from "./messages/page";
import ResumeHome from "./resume/page";
import EmploymentStatus from "./employmentStatus/page";
import SalaryExpectations from "./salaryExpectations/page";
import UpdateResume from "./resume/editResume";
import About from "./resume/about/page";
import WorkExperience from "./resume/workExperience/page";
import Education from "./resume/education/page";
import OtherCertifications from "./resume/otherCertifications/page";
import Skills from "./resume/skills/page";
import Languages from "./resume/languages/page";
import EditProfileBirthDate from "../profile/editProfile/birthDate/page";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

type StackParamList = {
  Home: undefined;
  JobView: undefined;
  Filters: undefined;
  Messages: undefined;
  ResumeHome: undefined;
  EmploymentStatus: undefined;
  SalaryExpectations: undefined;
  UpdateResume: undefined;
  About: {
    addFooterOnUnmount: boolean;
  };
  WorkExperience: {
    edit: boolean;
    id: number | null;
    addFooterOnUnmount: boolean;
  };
  Education: {
    edit: boolean;
    id: number | null;
    addFooterOnUnmount: boolean;
  };
  OtherCertifications: {
    edit: boolean;
    id: number | null;
    addFooterOnUnmount: boolean;
  };
  Skills: {
    addFooterOnUnmount: boolean;
  };
  Languages: {
    edit: boolean;
    id: number | null;
    addFooterOnUnmount: boolean;
  };
  EditProfileBirthDate: undefined;
};

const Navigator = createNativeStackNavigator<StackParamList>();
export type NavigationProps = NativeStackNavigationProp<StackParamList>;

export default function JobsPage() {
  return (
    <Navigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Navigator.Screen name="Home" component={Jobs} />
      <Navigator.Screen name="JobView" component={JobsView} />
      <Navigator.Screen name="Filters" component={Filters} />
      <Navigator.Screen name="Messages" component={MessagesPage} />
      <Navigator.Screen name="ResumeHome" component={ResumeHome} />
      <Navigator.Screen name="EmploymentStatus" component={EmploymentStatus} />
      <Navigator.Screen
        name="SalaryExpectations"
        component={SalaryExpectations}
      />
      <Navigator.Screen name="UpdateResume" component={UpdateResume} />
      <Navigator.Screen
        name="About"
        component={About}
        initialParams={{ addFooterOnUnmount: false }}
      />
      <Navigator.Screen
        name="WorkExperience"
        component={WorkExperience}
        initialParams={{ edit: false, id: null, addFooterOnUnmount: false }}
      />
      <Navigator.Screen
        name="Education"
        component={Education}
        initialParams={{ edit: false, id: null, addFooterOnUnmount: false }}
      />
      <Navigator.Screen
        name="OtherCertifications"
        component={OtherCertifications}
        initialParams={{ edit: false, id: null, addFooterOnUnmount: false }}
      />
      <Navigator.Screen
        name="Skills"
        component={Skills}
        initialParams={{ addFooterOnUnmount: false }}
      />
      <Navigator.Screen
        name="Languages"
        component={Languages}
        initialParams={{ edit: false, id: null, addFooterOnUnmount: false }}
      />
      <Navigator.Screen
        name="EditProfileBirthDate"
        component={EditProfileBirthDate}
      />
    </Navigator.Navigator>
  );
}
