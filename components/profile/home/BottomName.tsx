import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';


export default function BottomName({ contentContainerStyle }: { contentContainerStyle?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.container, contentContainerStyle]}>
      <Text style={styles.companyName}>Coder Serve</Text>
      <Text style={styles.text}>Built for Coders, Designed to Serve.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  companyName: {
    fontSize: 29,
    fontWeight: 'bold',
    color: '#d9d9d9',
  },
  text: {
    fontSize: 13,
    color: '#d9d9d9',
    marginTop: 8,
    lineHeight: 13
  },
  container: {
    marginTop: 64,
    marginBottom: 48,
    alignItems: 'center',
    justifyContent: 'center',
  }
})
