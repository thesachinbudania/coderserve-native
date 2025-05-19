import React, { useState, useRef } from 'react';
import {
	View,
	Text,
	NativeSyntheticEvent,
	StyleSheet,
	Pressable,
	LayoutAnimation,
	TextLayoutEventData,
} from 'react-native';

interface ReadMoreTextProps {
	text: string;
	numberOfLines?: number;
	textStyle?: object;
	readMoreStyle?: object;
}

const ReadMoreText: React.FC<ReadMoreTextProps> = ({
	text,
	numberOfLines = 4,
	textStyle = {},
	readMoreStyle = {},
}) => {
	const [lines, setLines] = React.useState<null | number>(null);
	const [expanded, setExpanded] = useState<boolean>(false);
	const textRef = useRef<Text>(null);

	const handleTextLayout = (event: NativeSyntheticEvent<TextLayoutEventData>) => {
		const { lines } = event.nativeEvent;
		setLines(lines.length);
	};

	const toggleExpanded = () => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setExpanded(!expanded);
	};

	return (
		<View
			style={styles.container}
		>
			<Text
				ref={textRef}
				numberOfLines={expanded ? undefined : numberOfLines}
				onTextLayout={handleTextLayout}
				style={[styles.text, textStyle]}
			>
				{text}
			</Text>

			{(lines && lines >= numberOfLines) && !expanded && (
				<View style={styles.readMoreContainer}>
					<Pressable onPress={toggleExpanded}>
						{({ pressed }) => (
							<>
								<Text style={[styles.readMoreText, readMoreStyle, pressed && { color: '#006dff' }]}>
									<Text style={[styles.text, { textDecorationLine: 'none' }]}>...</Text>
									Read more
								</Text>
							</>
						)}
					</Pressable>
				</View>
			)}

			{expanded && (
				<View style={styles.readMoreContainer}>
					<Pressable onPress={toggleExpanded}>
						{({ pressed }) => (
							<Text style={[styles.readMoreText, readMoreStyle, { marginTop: 0 }, pressed && { color: '#006dff' }]}>Read less</Text>
						)}
					</Pressable>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	text: {
		fontSize: 13,
		color: '#737373',
		lineHeight: 18,
		textAlign: 'justify',
	},
	readMoreContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		paddingBottom: 4,
		marginBottom: -4,
	},
	readMoreText: {
		color: '#000',
		fontSize: 13,
		fontWeight: 'bold',
		textDecorationLine: 'underline',
		marginTop: -18,
		backgroundColor: 'white',
	},
	showLessButton: {
		alignSelf: 'flex-end',
	},
});

export default ReadMoreText;
