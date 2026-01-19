// only to be used with lists rendered by the DataList component of handleFetchedData.tsx

import Header from './Header';
import { Dimensions, Keyboard, Platform, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const { height } = Dimensions.get('window');

export default function ListPageLayout({ headerTitle, children, defaultBack = true, flex1 = true, showHeader = true, scrollEnabled = true, contentContainerStyle, customBack = () => { }, bottomPadding = true }: { headerTitle: string, defaultBack?: boolean, flex1?: boolean, showHeader?: boolean, scrollEnabled?: boolean, bottomPadding?: boolean, customBack?: () => void, children: React.ReactNode, contentContainerStyle?: any }) {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ marginTop: top, flex: 1 }}>
        {showHeader && (
          <Header
            title={headerTitle}
            onBackPress={defaultBack ? () => {
              navigation.goBack()
            } : customBack}
          />

        )}
        <View
          style={[styles.content, contentContainerStyle]}
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
        </View>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  content: {
    marginTop: 57,
    backgroundColor: 'white',
    flex: 1,
  }
})
