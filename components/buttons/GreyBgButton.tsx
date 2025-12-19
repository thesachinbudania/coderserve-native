import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Haptics from 'expo-haptics';

export default function GreyBgButton({ bold = true, color = 'light', title, disabled = false, style, onPress = () => { }, loading = false }: { bold?: boolean, style?: object, color?: 'dark' | 'light', title: string, disabled?: boolean, onPress?: () => void, loading?: boolean },) {
  return (
    <Pressable onPress={() => {
      if (!disabled) {
        Haptics.selectionAsync();
        onPress();
      }
    }} key={loading.toString()} pointerEvents={'auto'}>
      {
        ({ pressed }) => (
          <LinearGradient
            colors={disabled ? ['#f5f5f5', '#f5f5f5'] : (pressed ? (['#202020', '#202020']) : (color === 'dark' ? ['#eeeeee', '#eeeeee'] : ['#f5f5f5', '#f5f5f5']))}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={[styles.graident, style]}
          >
            {
              loading ? <ActivityIndicator color='white' /> : (
                <Text style={[styles.text, pressed && { color: 'white' }, disabled && { color: '#d9d9d9' }, bold ? { fontWeight: 'bold' } : { fontWeight: 'normal' }]}>{title}</Text>
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
    color: 'black',
    fontWeight: 'bold'
  }
})
