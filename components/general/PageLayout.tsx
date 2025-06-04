import Header from './Header';
import { Dimensions, Keyboard, Platform, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const { height } = Dimensions.get('window');

export default function Layout({ headerTitle, children, defaultBack = true, flex1 = true, showHeader = true, scrollEnabled = true, customBack = () => { } }: { headerTitle: string, defaultBack?: boolean, flex1?: boolean, showHeader?: boolean, scrollEnabled?: boolean, customBack?: () => void, children: React.ReactNode }) {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  return (
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
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps='always'
        scrollEnabled={scrollEnabled}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
          style={{ flex: 1 }}
        >
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
  )
}


const styles = StyleSheet.create({
  content: {
    marginTop: 57,
    paddingHorizontal: 16,
    paddingTop: 24,
    backgroundColor: 'white',
    paddingBottom: Platform.OS === 'ios' ? 96 : 128,
    minHeight: height - 57,
  }
})
