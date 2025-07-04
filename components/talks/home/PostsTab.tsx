import { StyleSheet, Text, View } from 'react-native';

export default function() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>You haven't shared any talks yet.</Text>
      <Text style={styles.text}>Let your voice be heard and inspire others.</Text>
      <Text style={styles.link}>Create your first post</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 48,
  },
  text: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  link: {
    marginTop: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 13,

  }
})
