import { Text, TextInput, View } from 'react-native';
import React from 'react';
import ErrorMessage from '@/components/messsages/Error';

export default function TextAreaInput({ placeholder, maxLength = 1000, text, setText, error = '' }: { error?: string, placeholder: string, maxLength?: number, text: string, setText: React.Dispatch<React.SetStateAction<string>> }) {
  const [focused, setFocused] = React.useState(false)
  React.useEffect(() => {
    if (text.length > maxLength) {
      setText(text.slice(0, maxLength));
    }
  }, [text])
  return (
    <View style={{ gap: 8 }}>
      <View style={{ position: 'relative' }}>
        <TextInput
          placeholder={placeholder}
          multiline={true}
          numberOfLines={100}
          style={[{
            height: 400,
            borderColor: 'black',
            borderWidth: 1,
            padding: 16,
            borderRadius: 12,
            backgroundColor: '#fff',
            color: '#000',
            fontSize: 15,
            textAlignVertical: 'top',
          }, focused && { borderColor: '#006dff' }]}
          placeholderTextColor={'#cbe1ff'}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          value={text}
          onChangeText={setText}
        />
        <Text style={{ position: 'absolute', bottom: 12, right: 12, color: '#a6a6a6', fontSize: 11 }}>{text.length}/{maxLength}</Text>
      </View>
      <ErrorMessage message={error} />
    </View>

  );
}
