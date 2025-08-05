import { Pressable, Image, StyleSheet } from 'react-native';

export default function FloatingButton({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && { backgroundColor: "#006dff" }]}
      onPress={onPress}
    >
      <Image source={require('@/assets/images/whitePlus.png')} style={{ height: 28, width: 28 }}></Image>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    bottom: 84,
    backgroundColor: '#202020',
    padding: 20,
    borderRadius: 12
  }
})
