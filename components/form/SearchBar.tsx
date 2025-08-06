import { Image, TextInput, StyleSheet, View } from 'react-native';
import React from 'react';


export default function SearchBar({ onChangeText }: { onChangeText: React.Dispatch<React.SetStateAction<string>> }) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [text, setText] = React.useState('');

  React.useEffect(() => {
    onChangeText(text);
  }, [text]);

  return (
    <View
      style={styles.container}
    >
      <Image source={require('./assets/searchIcon.png')} style={styles.searchIcon} />
      <TextInput
        style={[styles.input, isFocused && { borderColor: '#006dff' }]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={'Search'}
        value={text}
        onChangeText={setText}
        placeholderTextColor='#cfdbe6'
      />
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    height: 45,
    paddingLeft: 38,
    fontSize: 15,
    flexDirection: 'row',
    gap: 8,
  },
  searchIcon: {
    height: 18,
    width: 18,
    position: 'absolute',
    left: 12,
  },
  container: {
    justifyContent: 'center',
  }
})
