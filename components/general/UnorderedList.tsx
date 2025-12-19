import { View, Text, StyleSheet } from 'react-native';

const UnorderedList = ({ items, gap = 6, textStyle }: { items: string[], gap?: number, textStyle?: object }) => {
  return (
    <View>
      {items.map((item, index) =>
        item !== '' && (
          <View
            style={[styles.listItem, index !== items.length - 1 && { marginBottom: gap }]}
            key={index}
          >
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text style={[styles.detailText, textStyle]}>{item}</Text>
          </View>
        )
      )}
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
    fontSize: 16,
    lineHeight: 20, // matches detailText lineHeight
    color: '#737373',
  },
  detailText: {
    flexShrink: 1, // allows wrapping nicely
    fontSize: 14,
    lineHeight: 20, // ensures even spacing between wrapped and single-line items
    color: '#737373',
    textAlign: 'justify',
  },
});

export default UnorderedList;
