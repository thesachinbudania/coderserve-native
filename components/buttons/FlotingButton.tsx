import { Pressable, Image, StyleSheet } from 'react-native';

export default function FloatingButton({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && { backgroundColor: "#006dff" }]}
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
    borderRadius: 12,
    height: 64,
    width: 64,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
