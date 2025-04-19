
import React from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, View, Image, TouchableNativeFeedback, GestureResponderEvent } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import Profile from '../profile/Page';
import Jobs from '../jobs/page';
import ReadMore from '../jobs/resume/ReadMore';

const MyTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: 'white', // Ensure background is white
	},
};
// Define Tab Param List
type TabParamList = {
	Home: undefined;
	Talks: undefined;
	Jobs: undefined;
	Projects: undefined;
	Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

function Home() {
	return (
		<View style={styles.centeredView}>
			<Text style={styles.welcomeText}>Welcome! You are signed in</Text>
		</View>
	);
}

interface IconProps {
	focused: boolean;
}

const HomeIcon: React.FC<IconProps> = ({ focused }) => (
	<Image source={focused ? require('../assets/homeActive.png') : require('../assets/home.png')} style={styles.icon} />
);

const HomeLabel: React.FC<IconProps> = ({ focused }) => (
	<Text style={[styles.iconLabelStyle, { color: focused ? 'black' : '#d9d9d9' }]}>Home</Text>
);

const TalksIcon: React.FC<IconProps> = ({ focused }) => (
	<Image source={focused ? require('../assets/talksActive.png') : require('../assets/talks.png')} style={styles.icon} />
);

const TalksLabel: React.FC<IconProps> = ({ focused }) => (
	<Text style={[styles.iconLabelStyle, { color: focused ? 'black' : '#d9d9d9' }]}>Talks</Text>
);

const JobsIcon: React.FC<IconProps> = ({ focused }) => (
	<Image source={focused ? require('../assets/jobsActive.png') : require('../assets/jobs.png')} style={styles.icon} />
);

const JobsLabel: React.FC<IconProps> = ({ focused }) => (
	<Text style={[styles.iconLabelStyle, { color: focused ? 'black' : '#d9d9d9' }]}>Jobs</Text>
);

const ProjectsIcon: React.FC<IconProps> = ({ focused }) => (
	<Image source={focused ? require('../assets/projectsActive.png') : require('../assets/projects.png')} style={styles.icon} />
);

const ProjectsLabel: React.FC<IconProps> = ({ focused }) => (
	<Text style={[styles.iconLabelStyle, { color: focused ? 'black' : '#d9d9d9' }]}>Projects</Text>
);

const ProfileIcon: React.FC<IconProps> = ({ focused }) => (
	<Image source={focused ? require('../assets/profileActive.png') : require('../assets/profile.png')} style={styles.icon} />
);

const ProfileLabel: React.FC<IconProps> = ({ focused }) => (
	<Text style={[styles.iconLabelStyle, { color: focused ? 'black' : '#d9d9d9' }]}>Profile</Text>
);

interface TabButtonProps {
	onPress?: (event: GestureResponderEvent) => void;
	children: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ onPress, children }) => (
	<TouchableNativeFeedback onPress={onPress} background={TouchableNativeFeedback.Ripple('#f0f0f0', true)}>
		<View style={styles.tabButton}>{children}</View>
	</TouchableNativeFeedback>
);

export default function TabNav() {
	return (
		<NavigationContainer theme={MyTheme}>
			<SafeAreaView style={[styles.flexContainer, Platform.OS === 'ios' && styles.iosMargin]}>
				<Tab.Navigator
					screenOptions={{
						headerShown: false,
						tabBarStyle: styles.tabBar,
						tabBarShowLabel: true,
						tabBarButton: TabButton,
					}}
				>
					<Tab.Screen name="Home" component={Home} options={{ tabBarIcon: HomeIcon, tabBarLabel: HomeLabel }} />
					<Tab.Screen name="Talks" component={Home} options={{ tabBarIcon: TalksIcon, tabBarLabel: TalksLabel }} />
					<Tab.Screen name="Jobs" component={Jobs} options={{ tabBarIcon: JobsIcon, tabBarLabel: JobsLabel }} />
					<Tab.Screen name="Projects" component={Home} options={{ tabBarIcon: ProjectsIcon, tabBarLabel: ProjectsLabel }} />
					<Tab.Screen name="Profile" component={Profile} options={{ tabBarIcon: ProfileIcon, tabBarLabel: ProfileLabel }} />
				</Tab.Navigator>
			</SafeAreaView>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	icon: {
		width: 24,
		height: 24,
	},
	iconLabelStyle: {
		fontSize: 11,
	},
	tabButton: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	flexContainer: {
		flex: 1,
	},
	iosMargin: {
		marginTop: -16,
	},
	tabBar: {
		height: 54,
		marginBottom: 0,
		paddingBottom: 0,
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	welcomeText: {
		color: '#5d5d5d',
		fontSize: 38,
		fontWeight: 'bold',
		textAlign: 'center',
	},
});
