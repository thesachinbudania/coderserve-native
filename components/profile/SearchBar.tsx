import React from 'react';
import { Image, TextInput, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Typewriter from '@/components/Typewriter';


type SearchBarProps = {
  text: string,
  onChangeText: React.Dispatch<React.SetStateAction<string>>,
  isFocused: boolean,
  setIsFocused: React.Dispatch<React.SetStateAction<boolean>>,
  placeholder?: string | null,
  placholderText?: string[],
  onSubmitEditing?: () => void
  unfocusOnBlur?: boolean
}

export default function SearchBar({ text = '', onChangeText, isFocused, setIsFocused, placeholder = null, placholderText = [], onSubmitEditing, unfocusOnBlur = true }: SearchBarProps) {
  const inputRef = React.useRef<TextInput>(null);

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  React.useEffect(() => {
    if (isFocused) {
      const timeout = setTimeout(() => handleFocus(), 100);
      return () => clearTimeout(timeout);
    }
  }, [isFocused])

  return (
    <TouchableWithoutFeedback onPress={() => setIsFocused(true)}>
      <View
        style={[styles.container,]}
      >
        {(!placeholder || isFocused) && (
          <Image source={require('@/assets/images/searchIcon.png')} style={styles.searchIcon} />
        )}
        <TextInput
          ref={inputRef}
          style={[styles.input, placeholder && !isFocused && { paddingLeft: 16 }, { borderColor: isFocused ? '#eeeeee' : 'black' }, isFocused && { borderWidth: 0, borderColor: '#eeeeee', borderBottomWidth: 1, borderRadius: 0, height: 62 }]}
          onFocus={() => setIsFocused(true)}
          onBlur={unfocusOnBlur ? () => setIsFocused(false) : undefined}
          placeholder={!isFocused && placeholder ? placeholder : (placholderText.length > 0 && !isFocused ? '' : 'Search')}
          value={text}
          onChangeText={onChangeText}
          onSubmitEditing={() => onSubmitEditing && onSubmitEditing()}
          placeholderTextColor={!isFocused && placeholder ? '#cfdbe6' : '#d9d9d9'}
        />
        {
          !isFocused && placholderText.length > 0 && (
            <View style={styles.placeholderText}>
              <Typewriter
                text={placholderText}
                speed={50}
                textStyle={{ fontSize: 15, color: '#d9d9d9' }}
              />
            </View>
          )
        }

      </View >
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    height: 45,
    paddingLeft: 39,
    fontSize: 14,
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'white'
  },
  searchIcon: {
    height: 15,
    width: 15,
    position: 'absolute',
    left: 16,
    zIndex: 1
  },
  container: {
    justifyContent: 'center',
  },
  placeholderText: {
    position: 'absolute',
    top: 12,
    left: 39,
  }
})
