import Header from './Header';
import { Dimensions, Keyboard, Platform, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const { height } = Dimensions.get('window');

export default function Layout({ headerTitle, children, defaultBack = true, flex1 = true, showHeader = true, scrollEnabled = true, contentContainerStyle, customBack = () => { }, bottomPadding = true }: { headerTitle: string, defaultBack?: boolean, flex1?: boolean, showHeader?: boolean, scrollEnabled?: boolean, bottomPadding?: boolean, customBack?: () => void, children: React.ReactNode, contentContainerStyle?: any }) {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
    <View style={{ marginTop: top }}>
      {showHeader && (
        <Header
          title={headerTitle}
          onBackPress={defaultBack ? () => {
            navigation.goBack()
          } : customBack}
        />

      )}
      <ScrollView
        contentContainerStyle={[styles.content, bottomPadding ? { paddingBottom: Platform.OS === 'ios' ? 96 : 128, } : { paddingBottom: 60 }, contentContainerStyle]}
        scrollEnabled={scrollEnabled}
        keyboardShouldPersistTaps='handled'
      >
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
          {
            flex1 ? (
              <View style={{ flex: 1, backgroundColor: 'white' }}>
                {children}
              </View>
            ) : (
              <>
                {children}
              </>
            )
          }
    </TouchableWithoutFeedback>
      </ScrollView>
    </View>
    </View>
  )
}


const styles = StyleSheet.create({
  content: {
    marginTop: 57,
    paddingHorizontal: 16,
    paddingTop: 24,
    backgroundColor: 'white',
    minHeight: height - 57,
  }
})
