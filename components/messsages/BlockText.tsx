import React, { useState, useCallback } from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	StyleSheet,
	TextStyle,
	ViewStyle,
	NativeSyntheticEvent,
	TextLayoutEventData,
} from 'react-native';

type ExpandableTextProps = {
	text: string;
	style?: TextStyle;
	containerStyle?: ViewStyle;
	numberOfLines?: number;
};

const ExpandableText: React.FC<ExpandableTextProps> = ({
	text,
	style,
	containerStyle,
	numberOfLines = 4,
}) => {
	const [isTextShown, setIsTextShown] = useState(false);
	const [showToggle, setShowToggle] = useState(false);
	const [isTextTruncated, setIsTextTruncated] = useState(false);

	const handleTextLayout = useCallback((e: NativeSyntheticEvent<TextLayoutEventData>) => {
		// Check if the text is truncated (has more lines than allowed)
		const truncated = e.nativeEvent.lines.length > numberOfLines;
		setIsTextTruncated(truncated);
		setShowToggle(truncated);
	}, [numberOfLines]);

	React.useEffect(() => {
		handleTextLayout()
	}, [])

	return (
		<View style={containerStyle}>
			<Text
				style={[styles.text, style]}
				numberOfLines={isTextShown ? undefined : numberOfLines}
				onTextLayout={handleTextLayout}
				ellipsizeMode="tail"
			>
				{text}
			</Text>

			{showToggle && (
				<TouchableOpacity onPress={() => setIsTextShown(!isTextShown)}>
					<Text style={styles.toggleText}>
						{isTextShown ? 'Read less' : 'Read more'}
					</Text>
				</TouchableOpacity>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	text: {
		fontSize: 16,
		color: '#333',
		lineHeight: 22,
	},
	toggleText: {
		color: 'blue',
		marginTop: 6,
		fontWeight: '500',
		alignSelf: 'flex-end',
	},
});

export default ExpandableText;
