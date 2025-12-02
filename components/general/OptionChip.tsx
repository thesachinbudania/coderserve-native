import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

type OptionChipProps = {
  title: string;
  onPress?: () => void;
  selected?: boolean;
  unselectable?: boolean;
};

export default function OptionChip({
  title,
  onPress = () => { },
  selected = false,
  unselectable = false,
}: OptionChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) =>[
        optionChipStyles.container,
        !selected && { backgroundColor: "#f5f5f5" },
        !selected && pressed && {backgroundColor: "#d9d9d9"},
        selected && pressed && unselectable && {backgroundColor: "#006dff"},
      ]}
    >
      <Text style={[optionChipStyles.text, !selected && { color: "#737373", fontWeight: 'normal' }]}>
        {title}
      </Text>
    </Pressable>
  );
}

const optionChipStyles = StyleSheet.create({
  container: {
    height: 38,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 32,
    backgroundColor: "#202020",
  },
  text: {
    fontSize: 13,
    color: "white",
  },
});


