import { Text, StyleSheet } from 'react-native';

export default function FieldHeading({ children }: { children: React.ReactNode }) {
  return (
    <Text style={styles.inputHeading}>{children}</Text>
  )
}


const styles = StyleSheet.create({
  inputHeading: {
    fontSize: 11,
    color: '#a6a6a6',
  }
});
