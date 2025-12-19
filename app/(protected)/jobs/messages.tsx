import Layout from '@/components/general/PageLayout';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import * as Haptics from 'expo-haptics';

const messages = [
	'Your chats with your followers will stay up here. Begin a conversation now!',
	'Apply to your dream job and be the first to hear back from recruiters right here.',
	'Your chats with your project team will show up here. Begin a conversation now!',
]


export default function Messages() {
	const [selectedOption, setSelectedOption] = React.useState(0);
	return (
		<View style={{ flex: 1, backgroundColor: 'white' }}>
			<Layout
				headerTitle='Messages'
			>
				<View style={styles.optionsContainer}>
					<OptionButton
						selected={selectedOption === 0}
						onPress={() => setSelectedOption(0)}
						title='Chat'
					/>
					<OptionButton
						selected={selectedOption === 1}
						onPress={() => setSelectedOption(1)}
						title='Jobs'
					/>
					<OptionButton
						selected={selectedOption === 2}
						onPress={() => setSelectedOption(2)}
						title='Projects'
					/>
				</View>
				<View style={{ height: 500, alignItems: 'center', justifyContent: 'center' }}>
					<Image source={require('@/assets/images/jobs/messages.png')} style={{ width: 128, height: 128, objectFit: 'contain', marginBottom: 32 }} />
					<Text style={styles.emptyText}>{messages[selectedOption]}</Text>
				</View>
			</Layout>
		</View>

	)
}

function OptionButton({ selected, title, onPress }: { selected: boolean, title: string, onPress: () => void }) {
	return (
		<Pressable
			onPress={() => {
				Haptics.selectionAsync();
				onPress();
			}}
			style={{ flex: 1 / 3 }}
		>
			{
				({ pressed }) => (
					<View style={[styles.optionContainer, pressed && { backgroundColor: "#d9d9d9" }, selected && { backgroundColor: 'black' }]}>
						<Text style={[{ fontSize: 13, fontWeight: 'bold' }, selected && { color: 'white' }]}>{title}</Text>
					</View>
				)
			}

		</Pressable>
	)
}

const styles = StyleSheet.create({
	optionsContainer: {
		borderRadius: 8,
		backgroundColor: '#f5f5f5',
		flexDirection: 'row',

	},
	optionContainer: {
		paddingVertical: 12,
		width: '100%',
		alignItems: 'center',
		flex: 1 / 3,
		borderRadius: 8,
	},
	emptyText: {
		fontSize: 11,
		color: '#a6a6a6',
		width: '50%',
		textAlign: 'center',
	}
})
