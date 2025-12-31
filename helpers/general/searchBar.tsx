import React from 'react';
import { Animated, BackHandler, Dimensions, Keyboard, useAnimatedValue } from 'react-native';
import { useRouter } from 'expo-router';

export default function useSearchBar({ isSearchFocused, setIsSearchFocused }: { isSearchFocused: boolean, setIsSearchFocused: (focused: boolean) => void }) {
  const { width } = Dimensions.get('window');
  // search bar animation values
  const searchBarMarginTop = useAnimatedValue(0);
  const contentWidth = useAnimatedValue(width - 32);
  const contentOpacity = useAnimatedValue(1);
  const scaleX = React.useRef(new Animated.Value(1)).current;
  const targetScale = width / (width - 32);
  const router = useRouter();

  const [keyboardVisible, setKeyboardVisible] = React.useState(false);
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
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isSearchFocused) {
        if (keyboardVisible) {
          Keyboard.dismiss();
          return true;
        }
        else {
          Keyboard.dismiss();
          setIsSearchFocused(false);
          return true;
        }
      }
      router.back();
      return true;
    });

    return () => backHandler.remove();
  }, [isSearchFocused]);


  React.useEffect(() => {
    if (isSearchFocused) {
      Animated.timing(searchBarMarginTop, {
        toValue: -88,
        duration: 200,
        useNativeDriver: true,
      }).start();
      Animated.timing(contentWidth, {
        toValue: width,
        duration: 200,
        useNativeDriver: false,
      }).start();
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      Animated.timing(scaleX, {
        toValue: targetScale,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(searchBarMarginTop, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      Animated.timing(contentWidth, {
        toValue: width - 32,
        duration: 200,
        useNativeDriver: false,
      }).start();
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      Animated.timing(scaleX, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isSearchFocused]);
  return { searchBarMarginTop, contentWidth, contentOpacity, scaleX }
}
