import { Pressable, Text, StyleSheet } from 'react-native';

export default function ProfileButton({ count, title }: { count: number, title: string }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.countBox, pressed && { backgroundColor: '#f4f4f4' }]}
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
  },
  countBox: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
    gap: 6,
    borderRadius: 8,
  },
  countHeading: {
    fontSize: 11,
    color: '#737373',
  },

});
