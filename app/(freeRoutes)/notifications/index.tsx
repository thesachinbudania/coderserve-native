import { Text, View, ScrollView } from 'react-native';
import PageLayout from '@/components/general/PageLayout';

function Chip() {
	return (
		<View>
			<Text>Chip Component</Text>
		</View>)
}

export default function Notifications() {
	return (
		<PageLayout
			headerTitle='Notifications'
		>
			<ScrollView
				style={{ flexDirection: 'row', gap: 16 }}
				horizontal
			>
				<Chip />
				<Chip />
				<Chip />
				<Chip />
				<Chip />
				<Chip />
				<Chip />
				<Chip />
			</ScrollView>
		</PageLayout>
	);
}
