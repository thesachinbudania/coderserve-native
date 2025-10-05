import { StyleSheet, Text, View } from 'react-native'
import Layout from '@/components/general/PageLayout';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import PopUpMessage from '@/components/general/PopUpMessage';

export default function SettingsLayout({ headerTitle, heading, text, secondaryText, children }: { headerTitle: string, heading: string, text: string, secondaryText?: string, children?: React.ReactNode }) {
	const navigation = useNavigation();
	const [popUpVisible, setPopUpVisible] = React.useState(false);

	return (
		<Layout
			headerTitle={headerTitle}
		>
			<PopUpMessage
				heading='Location Updated'
				text='Your new location has been saved. Enjoy content, events, and recommendations tailored to your area.'
				visible={popUpVisible}
				setVisible={setPopUpVisible}
				onPress={() => navigation.goBack()}
				isLoading={false}
				singleButton
			/>
			<Text style={styles.heading}>{heading}</Text>
			<Text style={styles.content}>
				{text}
			</Text>
			{secondaryText && (
				<Text style={[styles.content, { marginTop: 24 }]}>
					{secondaryText}
				</Text>
			)}

			<View style={{ marginTop: 32 }}>
				{children}
			</View>
		</Layout>
	)
}


export const styles = StyleSheet.create({
	heading: {
		fontSize: 15,
		fontWeight: 'bold',
		marginBottom: 8,
	},
	content: {
		fontSize: 13,
		color: '#737373',
		textAlign: 'justify',
	}
})
