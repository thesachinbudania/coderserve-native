import { Pressable, Text, StyleSheet } from 'react-native';

export default function ProfileButton({ count, title, onPress }: { count: number, title: string, onPress?: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.countBox, pressed && { backgroundColor: '#f4f4f4' }]}
      onPress={onPress}
    >
      <Text style={styles.countText}>{count}</Text>
      <Text style={styles.countHeading}>{title}</Text>
    </Pressable>

  )
}

const styles = StyleSheet.create({
  countText: {
    fontSize: 13,
    fontWeight: 'bold',
    lineHeight: 13,
  },
  countBox: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
    gap: 8,
    borderRadius: 8,
  },
  countHeading: {
    fontSize: 11,
    color: '#737373',
    lineHeight: 11,
  },

});
