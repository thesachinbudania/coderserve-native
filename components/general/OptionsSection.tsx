import { Pressable, Image, StyleSheet, Text, View, } from 'react-native';
import * as Haptics from 'expo-haptics';

function SectionLabel({ title }: { title: string }) {
	return (
		<Text style={sectionStyles.sectionLabel}>{title}</Text>
	)
}

export function Section({ children, title }: { children: React.ReactNode, title?: string }) {
	return (
		<View style={sectionStyles.headerSection}>
			{title && <SectionLabel title={title} />}
			<View style={sectionStyles.section}>
				{children}
			</View>
		</View>
	)
}


export function SectionOption({ title, subTitle, onPress = () => { }, optional }: { optional?: boolean; title: string, subTitle: string, onPress?: () => void }) {
	return (
		<Pressable onPress={() => {
			Haptics.selectionAsync();
			onPress();
		}}>
			{
				({ pressed }) => (
					<View style={[sectionStyles.option, pressed && { backgroundColor: '#202020' }]}>
						<View style={{ maxWidth: '90%' }}>
							<Text style={[sectionStyles.optionTitle, pressed && { color: 'white' }]}>{title}{optional && <Text style={{ color: "#a6a6a6" }}> (Optional)</Text>}</Text>
							<Text style={sectionStyles.optionSubTitle}>{subTitle}</Text>
						</View>
						<Image style={{ width: 18, height: 18, tintColor: pressed ? 'white' : '#202020' }} source={require('@/assets/images/arrows/right-arrow.png')} />
					</View>
				)
			}
		</Pressable>
	)
}

export function SectionContainer({ children }: { children: React.ReactNode }) {
	return (
		<View style={sectionStyles.sectionsContainer}>
			{children}
		</View>
	)
}

const sectionStyles = StyleSheet.create({
	option: {
		padding: 16,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	optionTitle: {
		fontSize: 14,
		fontWeight: 'bold',
	},
	optionSubTitle: {
		fontSize: 12,
		color: '#a6a6a6',
		marginTop: 8,
	},
	headerSection: {
		gap: 8,
	},
	sectionsContainer: {
		gap: 48,
	},
	sectionLabel: {
		fontSize: 11,
		color: '#a6a6a6',
	},
	section: {
		borderWidth: 1,
		borderColor: '#f5f5f5',
		borderRadius: 14,
		gap: 16,
		overflow: 'hidden',
	}
})
