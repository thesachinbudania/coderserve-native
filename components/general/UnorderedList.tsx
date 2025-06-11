import { View, Text, StyleSheet } from 'react-native';

const UnorderedList = ({ items }: { items: string[] }) => {
  return (
    <View >
      {items.map((item, index) => item != '' && (
        <View style={styles.listItem} key={index}>
          <Text style={styles.bullet}>{'\u2022'}</Text>
          <Text style={styles.detailText}>{item}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    marginRight: 6,
    fontSize: 22,
    lineHeight: 22,
    color: '#737373'
  },
  detailText: {
    fontSize: 13,
    color: '#737373',
    textAlign: 'justify'
  },
})

export default UnorderedList;
