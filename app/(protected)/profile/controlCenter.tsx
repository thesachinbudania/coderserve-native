import { Animated, Text, BackHandler, Dimensions, Keyboard, View, SafeAreaView, TouchableWithoutFeedback, useAnimatedValue } from 'react-native';
import SearchBar from '@/components/profile/SearchBar';
import React from 'react';
import Header from '@/components/general/Header';
import { SectionContainer, SectionOption, Section } from '@/components/general/OptionsSection';
import { useRouter, useNavigation } from 'expo-router';
import DangerButton from '@/components/buttons/DangerButton';
import protectedApi from '@/helpers/axios';
import { useTokensStore } from '@/zustand/stores';
import BottomDrawer from '@/components/BottomDrawer';
import GreyBgButton from '@/components/buttons/GreyBgButton';
import BlueButton from '@/components/buttons/BlueButton';
import errorHandler from '@/helpers/general/errorHandler';
import BottomName from '@/components/profile/home/BottomName';

export default function ControlCentre() {
  const [search, setSearch] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);
  const contentOpacity = useAnimatedValue(1);
  const searchBarMarginTop = useAnimatedValue(57);
  const width = Dimensions.get('window').width;
  const contentWidth = useAnimatedValue(width - 32);
  const router = useRouter();
  const navigation = useNavigation();
  const { setTokens, refresh } = useTokensStore()
  const [isLoading, setIsLoading] = React.useState(false);
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);
  const logoutDrawerRef = React.useRef<any>(null);

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [])


  const logout = async () => {
    setIsLoading(true);
    await protectedApi.post('/accounts/logout/', { refresh }).then(() => {
      setTokens({ refresh: '', access: '' });
      setIsLoading(false);
    }).catch((err) => {
      errorHandler(err);
      console.log('Error logging out', err);
      setIsLoading(false);
    })
  }

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isFocused) {
        if (keyboardVisible) {
          Keyboard.dismiss();
          return true;
        }
        else {
          Keyboard.dismiss(); // Dismiss keyboard manually
          setIsFocused(false); // Hide search bar
          return true; // Prevent default back action
        }
      }
      router.back();
      return true;
    });

    return () => backHandler.remove();
  }, [isFocused]);
  React.useEffect(() => {
    if (isFocused) {
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      Animated.timing(searchBarMarginTop, {
        toValue: 4,
        duration: 200,
        useNativeDriver: true,
      }).start();
      Animated.timing(contentWidth, {
        toValue: width,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      Animated.timing(searchBarMarginTop, {
        toValue: 57,
        duration: 200,
        useNativeDriver: true,
      }).start();
      Animated.timing(contentWidth, {
        toValue: width - 32,
        duration: 200,
        useNativeDriver: false
      }).start();
    }
  }, [isFocused]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Animated.View style={{ opacity: contentOpacity }}>
          <Header onBackPress={() => navigation.goBack()} title='Your Control Centre' />
        </Animated.View>
        <Animated.ScrollView contentContainerStyle={{ alignItems: 'center' }} style={{ flex: 1, backgroundColor: isFocused ? '#f7f7f7' : 'white', transform: [{ translateY: searchBarMarginTop }], paddingTop: isFocused ? 0 : 24, marginBottom: isFocused ? -64 : 0 }}
          scrollEnabled={!isFocused}
        >
          <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss();
            setIsFocused(false)
          }} >
            <Animated.View style={{ width: contentWidth }}>
              <View style={{ marginBottom: !isFocused ? 48 : 0 }}>
                <SearchBar
                  onChangeText={setSearch}
                  setIsFocused={setIsFocused}
                  isFocused={isFocused}
                />
              </View>
              <Animated.View style={{ opacity: contentOpacity, marginBottom: 64 }}>
                <SectionContainer>
                  <Section title='Your Account'>
                    <SectionOption
                      title='Account Center'
                      subTitle='Manage email, password, pro membership, ad preferences, account status, device permissions, and login history.'
                      onPress={() => router.push('/profile/accountCenter')}
                    />
                  </Section>
                  <Section title='Privacy & Safety'>
                    <SectionOption
                      title='Account Visibility'
                      subTitle='Toggle profile between public and private.'
                      onPress={() => router.push('/(protected)/profile/accountVisibility')}
                    />
                    <SectionOption
                      title='Tag Permissions'
                      subTitle='Control who can tag you.'
                      onPress={() => router.push('/(protected)/profile/tagPermissions')}
                    />
                    <SectionOption
                      title='Comment Permissions'
                      subTitle='See who can comment on your posts.'
                      onPress={() => router.push('/(freeRoutes)/profile/commentPermissions')}
                    />
                  </Section>
                  <Section title='Interaction Controls'>
                    <SectionOption
                      title='Muted Profile'
                      subTitle='Hide posts from selected profiles.'
                      onPress={() => router.push('/(protected)/profile/mutedProfile')}
                    />
                    <SectionOption
                      title='Blocked Users'
                      subTitle='Prevent specific users from interacting with you.'
                      onPress={() => router.push('/(protected)/profile/blockedUsers')}
                    />
                  </Section>
                  <Section title='Content & Activity'>
                    <SectionOption
                      title='Saved Posts'
                      subTitle="View all posts you've bookmarked."
                      onPress={() => router.push('/profile/savedPosts')}
                    />
                    <SectionOption
                      title='Voted Posts'
                      subTitle="See posts you've upvoted or downvoted."
                      onPress={() => router.push('/profile/votedPosts')}
                    />
                    <SectionOption
                      title='Comment History'
                      subTitle='See all your comments in one place.'
                      onPress={() => router.push('/profile/commentHistory')}
                    />
                    <SectionOption
                      title='Tagged Content'
                      subTitle='See posts where you have been tagged.'
                      onPress={() => router.push('/profile/taggedContent')}
                    />
                  </Section>
                  <Section title='Support & Info'>
                    <SectionOption
                      title='Help Center'
                      subTitle='Get help and troubleshooting guides.'
                      onPress={() => router.push('/(protected)/profile/helpCentre')}
                    />
                    <SectionOption
                      title='About'
                      subTitle='Read our policies and terms.'
                    />
                  </Section>
                  <DangerButton
                    title='Logout'
                    dangerButton
                    onPress={() => logoutDrawerRef.current?.open()}
                    loading={isLoading}
                  />
                </SectionContainer>
                <BottomName />
              </Animated.View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.ScrollView>
      </View>
      <BottomDrawer sheetRef={logoutDrawerRef} draggableIconHeight={0}>
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>
            Logging out already?
          </Text>
          <Text style={{ fontSize: 13, color: "#737373", textAlign: 'center', marginTop: 12 }}>
            We'll miss you! Don't worry, your account will be right here waiting when you come back.
          </Text>
          <View style={{ flexDirection: 'row', gap: 16, width: '100%', marginTop: 24 }}>
            <View style={{ flex: 1 / 2 }}>
              <GreyBgButton
                title='Cancel'
                onPress={() => logoutDrawerRef.current?.close()}
              />
            </View>
            <View style={{ flex: 1 / 2 }}>
              <BlueButton
                title='Confirm'
                onPress={logout}
                loading={isLoading}
              />
            </View>
          </View>
        </View>
      </BottomDrawer>
    </SafeAreaView>
  )
}

