import { Pressable, Text, View, ScrollView, Dimensions } from 'react-native';
import PageLayout from '@/components/general/PageLayout';
import React from 'react';
import ImageLoader from '@/components/ImageLoader';
import BlueButton from '@/components/buttons/BlueButton';

function Chip({ title, selected = false, onPress = () => { } }: { title: string, selected?: boolean, onPress?: () => void }) {
	return (
		<Pressable
			style={({ pressed }) => [{ paddingVertical: 16, paddingHorizontal: 24, backgroundColor: selected ? '#202020' : pressed ? '#d9d9d9' : '#f5f5f5', borderRadius: 32, }]}
			onPress={onPress}
		>
			<Text style={{ fontSize: 13, fontWeight: selected ? "bold" : "normal", color: selected ? "white" : '#737373' }}>{title}</Text>
		</Pressable>
	)
}

function FollowRequest() {
	return (
		<View style={{ paddingVertical: 16, flexDirection: 'row', gap: 16 }}>
			<ImageLoader size={64} uri='' />
			<View style={{ marginTop: 8 }}>
				<Text style={{ fontSize: 13, color: "#737373" }}><Text style={{ fontWeight: 'bold', color: 'black' }}>George</Text> has request to follow you</Text>
				<Text style={{ color: "#a6a6a6", marginTop: 8 }}>1 min ago</Text>
				<View style={{ marginTop: 8, flexDirection: 'row', gap: 16, width: 256 }}>
					<View style={{ flex: 1 / 2 }}>
						<BlueButton title='Decline' outlined dangerButton />
					</View>
					<View style={{ flex: 1 / 2 }}>
						<BlueButton title='Accept' />
					</View>
				</View>
			</View>

		</View>
	)
}

const { width } = Dimensions.get('window')
const tabs = ['Account', 'Your Journey', 'Job Alerts', 'Follow Requests', 'Upvotes', 'Downvotes']
export default function Notifications() {
	const [selectedTab, setSelectedTab] = React.useState(0)
	return (
		<>
			<PageLayout
				headerTitle='Notifications'
			>
				<View style={{ marginTop: 61 }}>
					<View style={{ height: 8, width: width, backgroundColor: '#f5f5f5', marginHorizontal: -16 }}></View>
					<FollowRequest />
				</View>
			</PageLayout>
			<ScrollView
				horizontal={true}
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ gap: 16, padding: 16 }}
				style={{ position: 'absolute', backgroundColor: 'white', top: 120, zIndex: 10, left: 0, flexDirection: 'row', width: '100%' }}
			>
				{
					tabs.map((tab, index) => (
						<Chip
							title={tab}
							selected={selectedTab == index}
							onPress={() => setSelectedTab(index)}
						/>
					))
				}
			</ScrollView>
		</>
	);
}
