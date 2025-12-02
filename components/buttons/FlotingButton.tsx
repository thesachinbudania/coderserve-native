import { Pressable, Image, StyleSheet } from 'react-native';

export default function FloatingButton({ onPress, rounded='small' }: { onPress?: () => void, rounded?: 'full' | 'small' | 'medium' }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && { backgroundColor: "#006dff",}, { borderRadius: rounded === 'full' ? 32 : rounded === 'medium' ? 16 : 12 }]}
      onPress={onPress}
    >
      <Image source={require('@/assets/images/whitePlus.png')} style={{ height: 24, width: 24}}></Image>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    bottom: 84,
    backgroundColor: '#202020',
    padding: 18,
    height: 64,
    width: 64,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
