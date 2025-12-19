import React, { useEffect, useState } from 'react';
import { Text, View, StyleProp, TextStyle } from 'react-native';

interface TypewriterProps {
	text: string | string[];
	speed?: number;
	pauseDuration?: number;
	textStyle?: StyleProp<TextStyle>;
}

const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 100, pauseDuration = 1500, textStyle }) => {
	const texts = Array.isArray(text) ? text : [text];

	const [displayedText, setDisplayedText] = useState<string>('');
	const [isDeleting, setIsDeleting] = useState<boolean>(false);
	const [textIndex, setTextIndex] = useState<number>(0);
	const [charIndex, setCharIndex] = useState<number>(0);
	const [pause, setPause] = useState<boolean>(false);

	useEffect(() => {
		if (pause) {
			const pauseTimeout = setTimeout(() => {
				setPause(false);
				setIsDeleting(true);
			}, pauseDuration);
			return () => clearTimeout(pauseTimeout);
		}

		const currentText = texts[textIndex];

		const timeout = setTimeout(() => {
			if (!isDeleting) {
				// Typing
				if (charIndex < currentText.length) {
					setDisplayedText(currentText.slice(0, charIndex + 1));
					setCharIndex((prev) => prev + 1);
				} else {
					// Finished typing, pause before deleting
					setPause(true);
				}
			} else {
				// Deleting
				if (charIndex > 0) {
					setDisplayedText(currentText.slice(0, charIndex - 1));
					setCharIndex((prev) => prev - 1);
				} else {
					// Finished deleting, move to next text
					setIsDeleting(false);
					setTextIndex((prev) => (prev + 1) % texts.length);
				}
			}
		}, speed);

		return () => clearTimeout(timeout);
	}, [texts, charIndex, isDeleting, speed, pause, pauseDuration, textIndex]);

	return (
		<View>
			<Text style={[{ fontSize: 24 }, textStyle]}>{displayedText}</Text>
		</View>
	);
};

export default Typewriter;
