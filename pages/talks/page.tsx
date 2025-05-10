import Home from './Home';
import YourProfile from './yourProfile/page';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

type StackParamList = {
  Home: undefined;
  MyProfile: undefined;
}

const Navigator = createNativeStackNavigator<StackParamList>();
export type NavigationProps = NativeStackNavigationProp<StackParamList>;

export default function Talks() {
  return (
    <Navigator.Navigator
      screenOptions={{ headerShown: false }}
    >
      <Navigator.Screen name='Home' component={Home} />
      <Navigator.Screen name='MyProfile' component={YourProfile} />
    </Navigator.Navigator>
  )
}
