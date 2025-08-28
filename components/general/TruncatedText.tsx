import { Dimensions, Text } from 'react-native';

export default function TruncatedText({ children, numberOfLines = 1, negativeWidth = 0, style }: { children?: string, numberOfLines?: number, negativeWidth?: number, style?: any }) {
  const width = Dimensions.get('window').width;
  return (
    <Text
      numberOfLines={numberOfLines}
      ellipsizeMode='tail'
      style={[{ maxWidth: width - negativeWidth }, style]}
    >
      {children}
    </Text>
  )
}
