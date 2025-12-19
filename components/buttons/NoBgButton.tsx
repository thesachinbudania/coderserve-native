import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Haptics from 'expo-haptics';

export default function NoBgButton({ outlined = false, title, disabled = false, dangerButton = false, loading = false, onPress = () => { } }: { outlined?: boolean, title: string, disabled?: boolean, loading?: boolean, onPress?: () => void, dangerButton?: boolean }) {

  return (
    <Pressable
      key={loading.toString()}
      onPress={() => {
        if (!disabled) {
          Haptics.selectionAsync();
          onPress();
        }

      }}
      style={({ pressed }) => [{ borderRadius: 12, borderWidth: outlined ? 1 : 0, borderColor: disabled ? '#f5f5f5' : (dangerButton ? '#ff5757' : '#f5f5f5') }, pressed && { borderColor: disabled ? '#d9d9d9' : (dangerButton ? '#ff5757' : '#006dff') }]}
    >
      {
        ({ pressed }) => (
          <LinearGradient
            colors={disabled ? ['#f5f5f5', '#f5f5f5'] : (pressed || loading ? (dangerButton ? ['#ff5757', '#ff5757'] : ['#006dff', '#006dff']) : ['transparent', 'transparent'])}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={styles.graident}
          >
            {
              loading ? <ActivityIndicator color='white' /> : (
                <Text style={[styles.text, pressed && { color: 'white' }, disabled && { color: '#d9d9d9' }]}>{title}</Text>
              )
            }
          </LinearGradient>

        )
      }
    </Pressable>
  )
}


const styles = StyleSheet.create({
  graident: {
    width: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
  }
})
