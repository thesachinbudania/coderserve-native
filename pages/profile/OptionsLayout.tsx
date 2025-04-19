import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import React from 'react';
import Header from './controlCentre/Header';
import { useNavigation } from '@react-navigation/native';

export default function OptionsLayout({ children, title }: { children: React.ReactNode, title: string }) {
	const navigation = useNavigation();
	return (
		<>
			<Header
				title={title}
				onBackPress={() => navigation.goBack()}
			/>
			<ScrollView style={styles.container}>
				<View style={{ paddingBottom: Platform.OS === 'ios' ? 16 : 24 }}>
					{children}
				</View>
			</ScrollView>
		</>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16,
		marginTop: 57,
		paddingTop: 24,
	}
})
