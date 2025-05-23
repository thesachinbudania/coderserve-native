import HomeIcon from "@/components/bottomBar/homeIcon";
import TalksIcon from "@/components/bottomBar/talksIcon";
import JobsIcon from "@/components/bottomBar/jobsIcon";
import ProjectsIcon from "@/components/bottomBar/projectsIcon";
import ProfileIcon from "@/components/bottomBar/profileIcon";
import * as SecureStore from "expo-secure-store";
import React from "react";
import DeviceInfo from "react-native-device-info";
import { ActivityIndicator, Pressable, View } from "react-native";
import { Redirect, Tabs, useSegments } from "expo-router";
import { Provider } from 'react-native-paper';
import hiddenSegments from '@/constants/hiddenFooterRoutes';
import { useUserStore, useTokensStore } from "@/zustand/stores";
import { useStore } from "@/zustand/auth/stores";
import protectedApi from "@/helpers/axios";

function LoadingScreen() {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: "white",
			}}
		>
			<ActivityIndicator size="large" color="#000" />
		</View>
	);
}

export default function AuthProvider() {
	const [areTokensFetched, setAreTokensFetched] = React.useState(false);
	const device = DeviceInfo.getBrand() + " " + DeviceInfo.getModel();
	const { refresh: refreshToken, access: accessToken } = useTokensStore(state => state)
	const user = useUserStore(state => state)
	const setToken = useTokensStore(state => state.setTokens);
	const setUser = useUserStore(state => state.setUser);
	const { setStore } = useStore(state => state);
	React.useEffect(() => {
		async function fetchTokens() {
			SecureStore.getItemAsync("refreshToken").then(async (refresh) => {
				SecureStore.getItemAsync("accessToken").then(async (access) => {
					if (refresh && access) {
						setToken({ refresh, access });
					}
					await protectedApi.get('/accounts/auth_token_validator/').then(
						response => {
							setUser({
								username: response.data.username,
								email: response.data.email,
								first_name: response.data.first_name,
								last_name: response.data.last_name,
								profile_image: response.data.profile_image,
								background_pattern_code: response.data.background_pattern_code,
								background_type: response.data.background_type,
								background_image: response.data.background_image,
								country: response.data.country,
								city: response.data.city,
								state: response.data.state,
								date_joined: response.data.date_joined,
								gitHub: response.data.gitHub,
								dobDate: response.data.dobDate,
								dobMonth: response.data.dobMonth,
								dobYear: response.data.dobYear,
								website: response.data.website,
								mobileCountryCode: response.data.mobileCountryCode,
								mobileNumber: response.data.mobileNumber,
								whatsappCountryCode: response.data.whatsappCountryCode,
								whatsappNumber: response.data.whatsappNumber
							})
							setToken({ access, refresh });
							setAreTokensFetched(true);
						}).catch(() => setAreTokensFetched(true))
				});
			});
		}
		fetchTokens();
		setUser({ device });
	}, []);

	const [signUpCompleted, setSignUpCompleted] = React.useState(true);
	const [signUpStep, setSignUpStep] = React.useState(0);

	const setAuthTokens = () => {
		setStore({ refresh: refreshToken, access: accessToken });
	}

	React.useEffect(() => {
		if (user.email && !user.username) {
			setAuthTokens();
			setSignUpCompleted(false);
			setSignUpStep(3);
		} else if (
			user.email &&
			user.username &&
			(!user.state || !user.country || !user.city)
		) {
			setAuthTokens();
			setSignUpCompleted(false);
			setSignUpStep(5);
		} else {
			setSignUpStep(0);
			setSignUpCompleted(true);
		}
	}, [user, refreshToken, accessToken]);
	return !areTokensFetched ? <LoadingScreen /> : refreshToken &&
		!signUpCompleted &&
		signUpStep != 0 ? (
		<Redirect href={`/(sign_up)/${signUpStep}`} />
	) : refreshToken ? (
		<AppTabs />
	) : (
		<Redirect href={'/login'} />
	);
}


function AppTabs() {
	const segment = useSegments();
	return (
		<Provider>
			<View style={{ flex: 1, backgroundColor: 'white' }}>
				<Tabs
					screenOptions={{
						animation: 'shift',
						tabBarLabelStyle: {
							fontSize: 11,
						},
						tabBarActiveTintColor: "#000",
						tabBarInactiveTintColor: '#d9d9d9',
						tabBarStyle: {
							display: hiddenSegments.includes(JSON.stringify(segment)) ? 'flex' : 'none',
						},
						tabBarButton: (props) => (
							<Pressable
								{...props}
								android_ripple={{ color: '#f0f0f0', borderless: true }}
							/>
						)

					}}
				>
					<Tabs.Screen
						name='index'
						options={{
							title: "Home",
							tabBarLabel: "Home",
							headerShown: false,
							tabBarIcon: ({ focused }) => <HomeIcon focused={focused} />,
						}}
					/>
					<Tabs.Screen
						name='talks'
						options={{
							title: "Talks",
							tabBarLabel: "Talks",
							headerShown: false,
							tabBarIcon: ({ focused }) => <TalksIcon focused={focused} />,
						}}
					/>
					<Tabs.Screen
						name='jobs'
						options={{
							title: "Jobs",
							tabBarLabel: "Jobs",
							headerShown: false,
							tabBarIcon: ({ focused }) => <JobsIcon focused={focused} />,
						}}
					/>
					<Tabs.Screen
						name='projects'
						options={{
							title: "Projects",
							tabBarLabel: "Projects",
							headerShown: false,
							tabBarIcon: ({ focused }) => <ProjectsIcon focused={focused} />,
						}}
					/>
					<Tabs.Screen
						name='profile'
						options={{
							title: "Profile",
							tabBarLabel: "Profile",
							headerShown: false,
							tabBarIcon: ({ focused }) => <ProfileIcon focused={focused} />,
						}}
					/>
				</Tabs>
			</View>
		</Provider>
	)
}
