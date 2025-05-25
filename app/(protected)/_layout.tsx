import HomeIcon from "@/components/bottomBar/homeIcon";
import TalksIcon from "@/components/bottomBar/talksIcon";
import JobsIcon from "@/components/bottomBar/jobsIcon";
import ProjectsIcon from "@/components/bottomBar/projectsIcon";
import ProfileIcon from "@/components/bottomBar/profileIcon";
import { useUserStore, useTokensStore } from '@/zustand/stores'
import { useStore } from '@/zustand/auth/stores'
import protectedApi from '@/helpers/axios'
import { Redirect, Tabs, useSegments } from 'expo-router'
import { Provider } from 'react-native-paper'
import hiddenSegments from '@/constants/hiddenFooterRoutes'
import * as SecureStore from 'expo-secure-store'
import DeviceInfo from 'react-native-device-info'
import React from 'react'
import { View, ActivityIndicator, Pressable } from 'react-native';

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

const AppTabs = () => {
  const segment = useSegments()

  return (
    <Provider>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Tabs
         screenOptions={{
            animation: 'shift',
            tabBarLabelStyle: { fontSize: 11 },
            tabBarActiveTintColor: "#000",
            tabBarInactiveTintColor: '#d9d9d9',
            tabBarStyle: {
              display: hiddenSegments.includes(JSON.stringify(segment)) ? 'flex' : 'none',
            },
            headerShown: false,
            tabBarButton: (props) => (
              <Pressable
                android_ripple={{ color: '#f0f0f0', borderless: true }}
                {...props}
              />
            )
          }}
        >
          <Tabs.Screen name='index' options={{ tabBarIcon: HomeIcon, tabBarLabel: "Home" }} />
          <Tabs.Screen name='talks' options={{ tabBarIcon: TalksIcon, tabBarLabel: "Talks" }} />
          <Tabs.Screen name='jobs' options={{ tabBarIcon: JobsIcon, tabBarLabel: "Jobs" }} />
          <Tabs.Screen name='projects' options={{ tabBarIcon: ProjectsIcon, tabBarLabel: 'Projects' }} />
          <Tabs.Screen name='profile' options={{ tabBarIcon: ProfileIcon, tabBarLabel: 'Profile' }} />
        </Tabs>
      </View>
    </Provider>
  )
}

export default function AuthProvider() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [signUpStep, setSignUpStep] = React.useState(0)
  const { setUser } = useUserStore()
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
