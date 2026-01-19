import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Haptics from 'expo-haptics';

export default function VoteButton({ title, dangerButton = false, disabled = false, loading = false, onPress = () => { }, dangered = false, selected = false }: { title: string, dangerButton?: boolean, dangered?: boolean, disabled?: boolean, loading?: boolean, onPress?: () => void, selected?: boolean }) {
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
            colors={disabled ? ['#f4f4f4', '#f4f4f4'] : (pressed || loading ? ((dangered || selected) ? ['#202020', '#202020'] : dangerButton ? ['#ff5757', '#ff5757'] : ['#03c769', '#03c769']) : (dangered ? ['#ff5757', '#ff5757'] : selected ? ['#03c769', '#03c769'] : ['#f5f5f5', '#f5f5f5']))}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={styles.graident}
          >
            {
              loading ? <ActivityIndicator color='white' /> : (
                <Text style={[styles.text, (pressed || dangered || selected) && { color: 'white' }, disabled && { color: '#d9d9d9' }, (pressed || selected || dangered) && { fontWeight: 'bold' }]}>{title}</Text>
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
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
  },
  text: {
    fontSize: 13,
  }
})
