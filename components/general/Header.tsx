import { Platform, Image, View, StyleSheet, Text } from 'react-native';
import IconButton from '../buttons/IconButton';
import { Portal } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';

export default function Header({ fixedHeader = false, onBackPress, title }: { fixedHeader?: boolean, onBackPress: () => void, title: string }) {
  const { top } = useSafeAreaInsets();
  const isFocused = useIsFocused();
  return (
    fixedHeader ?
      isFocused &&
      <Portal>
        <View style={[styles.header, Platform.OS === 'ios' && { marginTop: top }]}>
          <IconButton onPress={() => {
            onBackPress()
          }}>
            <Image style={styles.menuIcon} source={require('@/assets/images/Back.png')} />
          </IconButton>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
      </Portal> :
      <View style={styles.header}>
        <IconButton onPress={() => {
          onBackPress()
        }}>
          <Image style={styles.menuIcon} source={require('@/assets/images/Back.png')} />
        </IconButton>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
  )
}


const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    alignItems: 'center',
    gap: 8,
    position: 'absolute',
    top: 0,
    zIndex: 100,
    width: '100%'
  },
  menuIcon: {
    height: 32,
    width: 32
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },

})
