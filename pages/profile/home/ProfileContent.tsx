import { View, Text, StyleSheet } from 'react-native';
import BottomText from './BottomName';
import React from 'react';


export function ProfileSection({ title, content, onPress = () => { } }: { title: string, content: string, onPress?: () => void }) {
	const [pressed, setPressed] = React.useState(false);
	return (<View>
		<Text style={styles.detailsHeading}>{title}</Text>
		<Text style={styles.detailsContent}>
			{content}{' '}
			<Text
				style={{ textDecorationLine: 'underline', color: pressed ? '#006dff' : 'black' }}
				onPress={onPress}
				suppressHighlighting={true}
				onPressIn={() => setPressed(true)}
				onPressOut={() => setPressed(false)}
			>
				add now
			</Text>
		</Text>
	</View>

	)
}


export default function ProfileContent() {
	return (
		<>
			<View style={styles.tabContent} >
				<ProfileSection
					title='About'
					content="You haven't introduced yourself yet. Let the world know about your  story!"
				/>
				<ProfileSection
					title='Experience'
					content='You haven’t added any experience yet. Share your journey and expertise!'
				/>
				<ProfileSection
					title='Education'
					content='You haven’t added any education yet. Highlight your academic achievements!'
				/>
				<View>
					<Text style={styles.detailsHeading}>Certifications</Text>
					<Text style={styles.detailsContent}>
						You haven't completed any certifications yet. Once you complete one, it'll be showcased here.
					</Text>

				</View>
				<ProfileSection
					title='Other Certifications'
					content='You haven’t added any certifications yet. Showcase your achievements and skills!'
				/>
				<View>
					<Text style={styles.detailsHeading}>Projects</Text>
					<Text style={styles.detailsContent}>
						You haven't completed any project yet. Once you do, they'll be showcased here.
					</Text>

				</View>
				<ProfileSection
					title='Skills'
					content='You haven’t added any skills yet. Showcase your expertise and stand out!'
				/>
			</View>
			<BottomText />
		</>
	)
}

const styles = StyleSheet.create({
	buttonContainer: {
	},
	detailsHeading: {
		fontWeight: 'bold',
		fontSize: 15,
	},
	detailsContent: {
		fontSize: 13,
		color: '#a6a6a6',
		textAlign: 'justify',
		marginTop: 8,
		verticalAlign: 'bottom',
	},
	tabContent: {
		flex: 1,
		flexGrow: 1,
		paddingTop: 32,
		gap: 48,
	},
})
