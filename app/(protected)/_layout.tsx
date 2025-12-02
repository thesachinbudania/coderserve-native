import HomeIcon from "@/components/bottomBar/homeIcon";
import TalksIcon from "@/components/bottomBar/talksIcon";
import JobsIcon from "@/components/bottomBar/jobsIcon";
import ProjectsIcon from "@/components/bottomBar/projectsIcon";
import ProfileIcon from "@/components/bottomBar/profileIcon";
import { useUserStore, useTokensStore } from '@/zustand/stores'
import { useStore } from '@/zustand/auth/stores'
import { useJobsState } from "@/zustand/jobsStore";
import protectedApi from '@/helpers/axios'
import { Redirect, Tabs, useSegments } from 'expo-router'
import hiddenSegments from '@/constants/hiddenFooterRoutes'
import * as SecureStore from 'expo-secure-store'
import DeviceInfo from 'react-native-device-info'
import React from 'react'
import { View, ActivityIndicator, StatusBar, Keyboard, TouchableWithoutFeedback, Pressable} from 'react-native';
import { notify } from '@alexsandersarmento/react-native-event-emitter'
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
      <ActivityIndicator size="large" />
    </View>
  );
}
const AppTabs = () => {
  const segment = useSegments()
  const {bottom} = useSafeAreaInsets();
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
      <>
      <StatusBar backgroundColor={'#202020'} barStyle={'default'} />
      <View style={{ flex: 1, backgroundColor: 'white', paddingBottom: 0}}>
        <Tabs
          screenListeners={() => ({
            tabPress: () => {
              notify(`tabPress:${segment[segment.length - 1]}`);
            }
          })}
          screenOptions={{
            animation: 'shift',
            tabBarLabelStyle: { fontSize: 11, fontWeight: '100' },
            tabBarActiveTintColor: "#000",
            tabBarInactiveTintColor: '#d9d9d9',
            tabBarStyle: {
              display: hiddenSegments.includes(JSON.stringify(segment)) ? 'flex' : 'none',
              height: 56,
              borderColor: "#f5f5f5",
            },
            headerShown: false,
            tabBarButton: (props) => (
             // @ts-ignore 
              <Pressable
                {...props}
                android_ripple={{ color: '#f5f5f5', borderless: true }}
              />
            )
          }}
        >
          <Tabs.Screen name='index' options={{ tabBarIcon: HomeIcon, tabBarLabel: "Home" }} />
          <Tabs.Screen name='talks' options={{ tabBarIcon: TalksIcon, tabBarLabel: "Talks" }} />
          <Tabs.Screen name='jobs' options={{ tabBarIcon: JobsIcon, tabBarLabel: "Jobs" }} />
          <Tabs.Screen name='profile' options={{ tabBarIcon: ProfileIcon, tabBarLabel: 'Profile' }} />
          <Tabs.Screen name='home' options={{ href: null }} />
        </Tabs>
      </View>
      </>
    </TouchableWithoutFeedback>
  )
}

export default function AuthProvider() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [signUpStep, setSignUpStep] = React.useState(0)
  const { setUser } = useUserStore()
  const { setJobsState } = useJobsState();
  const { refresh, access, setTokens } = useTokensStore()
  const { setStore } = useStore()

  const validateAuth = async () => {
    try {
      const [refreshToken, accessToken] = await Promise.all([
        SecureStore.getItemAsync('refreshToken'),
        SecureStore.getItemAsync('accessToken'),
      ])
      if (refreshToken && accessToken) {
        await setTokens({ refresh: refreshToken, access: accessToken })
        const response = await protectedApi.get('/accounts/auth_token_validator/')
        setUser(response.data)
        const resumeState = await protectedApi.get('/jobs/resume/update_resume/')
        setJobsState(resumeState.data)
      }
    } catch (error) {
      console.log('Auth validation error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const determineSignUpStep = () => {
    const { email, username, country, city, state } = useUserStore.getState()
    if (email && !username) return 3
    if (email && username && (!country || !city || !state)) return 5
    return 0
  }

  React.useEffect(() => {
    const device = `${DeviceInfo.getBrand()} ${DeviceInfo.getModel()}`
    setUser({ device })
    validateAuth()
  }, [])

  React.useEffect(() => {
    if (refresh && access) {
      setStore({ refresh, access })
      setSignUpStep(determineSignUpStep())
    }
  }, [refresh, access])

  if (isLoading) return <LoadingScreen />

  if (refresh) {
    if (signUpStep > 0) {
      return <Redirect href={`/(sign_up)/${signUpStep}`} />
    }
    return <AppTabs />
  }

  return <Redirect href="/login" />
}
