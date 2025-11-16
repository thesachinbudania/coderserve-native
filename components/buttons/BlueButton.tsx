import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Haptics from 'expo-haptics';

export default function BlueButton({ title, dangerButton = false, disabled = false, loading = false, onPress = () => { }, outlined = false, style }: { title: string, dangerButton?: boolean, disabled?: boolean, loading?: boolean, onPress?: () => void, outlined?: boolean, style?: object }) {
  return (
    <Pressable
      key={loading.toString()}
      onPress={() => {
        if (!disabled) {
          Haptics.selectionAsync();
          onPress();
        }

      }}
    >
      {
        ({ pressed }) => (
          <LinearGradient
            colors={disabled ? ['#f4f4f4', '#f4f4f4'] : (pressed || loading ? (dangerButton ? ['#ff5757', '#ff5757'] : ['#006dff', '#006dff']) : outlined ? ['#fff', '#fff'] : ['#202020', '#202020'])}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={[styles.graident, outlined && { borderColor: '#eee', borderWidth: 0.5 }, style]}
          >
            {
              loading ? <ActivityIndicator color='white' /> : (
                <Text style={[styles.text, outlined && { color: "#737373", fontWeight: 'normal' }, pressed && { color: 'white' }, disabled && { color: '#d9d9d9' }]}>{title}</Text>
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
    color: 'white',
  }
})
