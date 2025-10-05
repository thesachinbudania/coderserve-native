import { View, Text, StyleSheet } from 'react-native';


export default function BottomName() {
  return (
    <View style={styles.container}>
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
  },
  container: {
    marginTop: 80,
    marginBottom: 64,
    alignItems: 'center',
    justifyContent: 'center',
  }
})
