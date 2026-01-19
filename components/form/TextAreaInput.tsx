import { Text, TextInput, View } from 'react-native';
import React from 'react';
import ErrorMessage from '@/components/messsages/Error';

interface TextAreaInputProps {
  placeholder: string;
  numberOfLines?: number;
  maxLength?: number;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  error?: string;
  styles?: object;
  contentContainerStyle?: object;
}

export default function TextAreaInput({ placeholder, numberOfLines = 100, maxLength = 1000, text, setText, error = '', styles, contentContainerStyle }: TextAreaInputProps) {
  const [focused, setFocused] = React.useState(false)
  React.useEffect(() => {
    if (text.length > maxLength) {
      setText(text.slice(0, maxLength));
    }
  }, [text])
  return (
    <View style={[{ gap: 8 }, contentContainerStyle]}>
      <View style={{ position: 'relative' }}>
        <TextInput
          placeholder={placeholder}
          multiline={true}
          numberOfLines={numberOfLines}
          style={[{
            height: 280,
            borderColor: 'black',
            borderWidth: 1,
            padding: 16,
            borderRadius: 12,
            backgroundColor: '#fff',
            color: '#000',
            fontSize: 14,
            textAlignVertical: 'top',
          }, focused && { borderColor: '#006dff' }, styles]}
          placeholderTextColor={'#cfdbe6'}
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
