import { Image, TextInput, StyleSheet, View } from 'react-native';
import React from 'react';


export default function SearchBar({ onChangeText, forSelectMenu = false }: { forSelectMenu?: boolean, onChangeText: React.Dispatch<React.SetStateAction<string>> }) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [text, setText] = React.useState('');

  React.useEffect(() => {
    onChangeText(text);
  }, [text]);

  return (
    <View
      style={styles.container}
    >
      <Image source={forSelectMenu ? require('@/assets/images/profile/searchIcon.png') : require('@/assets/images/searchIcon.png')} style={styles.searchIcon} />
      <TextInput
        style={[styles.input, isFocused && { borderColor: '#006dff' }]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={'Search'}
        value={text}
        onChangeText={setText}
        placeholderTextColor='#d9d9d9'
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
    paddingLeft: 39,
    fontSize: 14,
    flexDirection: 'row',
    gap: 8,
    lineHeight: 14,
  },
  searchIcon: {
    height: 15,
    width: 15,
    position: 'absolute',
    left: 16,
  },
  container: {
    justifyContent: 'center',
  }
})
