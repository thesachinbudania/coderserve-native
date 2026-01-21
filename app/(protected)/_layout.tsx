import TalksIcon from "@/components/bottomBar/talksIcon";
import JobsIcon from "@/components/bottomBar/jobsIcon";
import ProfileIcon from "@/components/bottomBar/profileIcon";
import CollabIcon from "@/components/bottomBar/collabIcon";
import { useNotificationsUnreadStore, useUserStore, useTokensStore, useUnreadMessagesStore } from '@/zustand/stores'
import { useStore } from '@/zustand/auth/stores'
import { useJobsState } from "@/zustand/jobsStore";
import protectedApi from '@/helpers/axios'
import { Redirect, Tabs, useSegments, usePathname, router } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import DeviceInfo from 'react-native-device-info'
import React from 'react'
import { Image, View, ActivityIndicator, StatusBar, Keyboard, TouchableWithoutFeedback, Pressable, Text } from 'react-native';
import { notify } from '@alexsandersarmento/react-native-event-emitter'
import { websocketUrl } from "@/constants/env";
import BottomDrawer from "@/components/BottomDrawer";
import * as Notification from 'expo-notifications'
import BlueButton from "@/components/buttons/BlueButton";
import errorHandler from "@/helpers/general/errorHandler";

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
      <ActivityIndicator size="large" color={'#202020'} />
    </View>
  );
}
const AppTabs = () => {
  const segment = useSegments()
  const pathname = usePathname()
  const [showFooter, setShowFooter] = React.useState(true)
  const drawerRef = React.useRef<any>(null);
  const [permission, setPermission] = React.useState<Notification.PermissionResponse | null>(null)

  React.useEffect(() => {
    Notification.getPermissionsAsync().then((permission) => {
      setPermission(permission)
    })
  }, [])

  React.useEffect(() => {
    if (permission?.canAskAgain && !permission?.granted) {
      setTimeout(() => {
        drawerRef.current?.open()
      }, 10000)
    }
    else {
      drawerRef.current?.close()
    }
  }, [permission])


  // List of exact paths where footer should be visible
  const visiblePaths = [
    '/profile',
    '/talks',
    '/jobs',
    '/projects',
    '/home' // In case 'home' index maps to this
  ];
  React.useEffect(() => {
    const isVisible = visiblePaths.includes(pathname) || visiblePaths.includes(pathname.replace(/\/$/, ""));
    setShowFooter(isVisible);
  }, [pathname])

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
      <>
        <StatusBar backgroundColor={'#202020'} barStyle={'light-content'} />
        <View style={{ flex: 1, backgroundColor: 'white', paddingBottom: 0 }}>
          <Tabs
            screenListeners={() => ({
              tabPress: () => {
                notify(`tabPress:${segment[segment.length - 1]}`);
              }
            })}
            screenOptions={{
              animation: 'shift',
              tabBarLabelStyle: { fontSize: 11 },
              tabBarActiveTintColor: "#000",
              tabBarInactiveTintColor: '#d9d9d9',
              tabBarStyle: {
                display: showFooter ? 'flex' : 'none',
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
            <Tabs.Screen name='talks' options={{ tabBarIcon: TalksIcon, tabBarLabel: "Talks" }} />
            <Tabs.Screen name='home' options={{ tabBarIcon: CollabIcon, tabBarLabel: "Collab" }} />
            <Tabs.Screen name='jobs' options={{ tabBarIcon: JobsIcon, tabBarLabel: "Jobs" }} />
            <Tabs.Screen name='profile' options={{ tabBarIcon: ProfileIcon, tabBarLabel: 'Profile' }} />
            <Tabs.Screen name='index' options={{ href: null }} />
          </Tabs>
          <BottomDrawer
            sheetRef={drawerRef}
            draggableIconHeight={0}
          >
            <View style={{ marginHorizontal: 16 }}>
              <Image source={require('@/assets/images/home/allowNotifications.png')} style={{ height: 64, width: 64, marginHorizontal: 'auto' }} />
              <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginTop: 16, lineHeight: 15 }}>Stay in the Loop</Text>
              <Text style={{ fontSize: 13, textAlign: 'center', color: "#737373", marginTop: 12 }}>Don't miss out! Enable notifications so we can keep you updated with important alerts, messages, and new opportunities on CoderServe.</Text>
              <BlueButton
                title="Allow notifications"
                style={{ marginTop: 32 }}
                onPress={() => {
                  Notification.requestPermissionsAsync().then((permission) => {
                    setPermission(permission)
                    if (permission?.granted) {
                      drawerRef.current?.close()
                    }
                  })
                }}
              />
            </View>
          </BottomDrawer>
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
  const { setNotificationsUnread } = useNotificationsUnreadStore();
  const { setUnreadMessages } = useUnreadMessagesStore();
  const { setStore } = useStore()

  React.useEffect(() => {
    if (!refresh || !access) return;
    protectedApi.get('/home/notifications/unread_count/').then((res) => {
      setNotificationsUnread(res.data)
    })
  }, [refresh, access])

  // websocket logic for handling notifications
  const wsRef = React.useRef<WebSocket | null>(null)
  React.useEffect(() => {
    if (!refresh || !access) return;
    try {
      const ws = new WebSocket(`${websocketUrl}ws/notifications/?token=${encodeURIComponent(access)}`)
      wsRef.current = ws
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type === 'notify.user') {
          if (data.event === 'new_notification' || data.event === 'update_notification' || data.event === 'delete_notification') {
            setNotificationsUnread(data.unread_count)
          }
          else if (data.event === 'new_message' || data.event === 'message_read') {
            setUnreadMessages(data.unread_count)
          }
        }
      }
    }
    catch {
      errorHandler(new Error('WebSocket connection failed'), false)
    }
  }, [refresh, access])


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
      router.replace('/(auth)/login')
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
