import * as React from 'react';
import { Dimensions, Image, Pressable, ScrollView, View, Text, Share, StyleSheet, Platform, } from 'react-native';
import BlueButton from '../../../components/buttons/BlueButton';
import IconButton from '../components/IconButton';
import Tabs from './Tabs';
import { useNavigation } from '@react-navigation/native'
import type { NavigationProp } from '../Page';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import ImageLoader from '../../../components/ImageLoader';
import { PortalHost } from '@gorhom/portal';
import BackgroundMapping from '../assets/Background/backgroundMapping';
import BackgroundImageLoader from '../BackgroundImageLoader';


export function ProfileButton({ count, title }: { count: number, title: string }) {
	return (
		<Pressable
			style={({ pressed }) => [styles.countBox, pressed && { backgroundColor: '#f4f4f4' }]}
		>
			<Text style={styles.countText}>{count}</Text>
			<Text style={styles.countHeading}>{title}</Text>
		</Pressable>

	)
}


const width = Dimensions.get('window').width;
export default function ProfileHome() {
	const user = useSelector((state: RootState) => state.user);
	const navigation = useNavigation<NavigationProp>();
	const isScrolling = React.useState(false);

	async function shareProfileAsync() {
		try {
			await Share.share({
				message: 'https://coderserve.com/profile/' + user.username,
			});
		} catch (error) {
			console.error('Error sharing profile:', error);
		}
	}

	return (
		<ScrollView
			contentContainerStyle={{ backgroundColor: 'white' }}
			nestedScrollEnabled
			onScroll={(e) => {
				if (e.nativeEvent.contentOffset.y > 0) {
					isScrolling[1](true);
				} else {
					isScrolling[1](false);
				}
			}}
		>

			<View style={styles.header}>
				<IconButton>
					<Image source={require('./assets/notifications.png')} style={styles.menuIcon} />
				</IconButton>
				<IconButton onPress={() => navigation.navigate('Options')}>
					<Image source={require('./assets/menu.png')} style={styles.menuIcon} />
				</IconButton>
			</View>
			{
				user.backgroundType === 'default' ?
					// @ts-ignore
					<Image source={BackgroundMapping[user.backgroundCode]} style={styles.bgImage} /> :
					user.backgroundImage &&
					<BackgroundImageLoader size={164} uri={user.backgroundImage} />

			}
			<View style={styles.body}>
				<View style={styles.profileRow}>
					{user.profilePicture &&
						<ImageLoader
							size={96}
							uri={user.profilePicture}
						/>}
					<View style={styles.countRow}>
						<ProfileButton
							count={0}
							title="Posts"
						/>
						<ProfileButton
							count={0}
							title="Followers"
						/>
						<ProfileButton
							count={0}
							title="Following"
						/>
					</View>
				</View>
				<Text style={styles.name}>{user.firstName} {user.lastName}</Text>
				<Text style={styles.username}>@{user.username}</Text>
				<Text style={styles.userLocation}>{user.city}, {user.state}, {user.country}</Text>
				<View style={styles.buttonContainer}>
					<View style={{ width: (width - 32) * 0.5 - 8 }}>
						<BlueButton
							title="Edit Profile"
							onPress={() => navigation.navigate('EditProfile')}
						/>
					</View>
					<View style={{ width: (width - 32) * 0.5 - 8 }}>
						<BlueButton
							title="Share Profile"
							onPress={shareProfileAsync}
						/>
					</View>
				</View>
			</View>
			<View >
				<Tabs />
			</View>
			<PortalHost name='tabsContent' />
		</ScrollView>
	)
}


const styles = StyleSheet.create({
	header: {
		backgroundColor: 'white',
		top: 0,
		width: '100%',
		zIndex: 1,
		paddingHorizontal: 16,
		paddingVertical: 8,
		gap: 16,
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	menuIcon: {
		width: 24,
		height: 24,
	},
	bgImage: {
		width: '100%',
		height: 164,
	},
	body: {
		marginHorizontal: 16,
	},
	profileImg: {
		width: 96,
		height: 96,
		borderRadius: 50,
		borderWidth: 3,
		borderColor: '#f5f5f5',
	},
	profileRow: {
		flexDirection: 'row',
		position: 'relative',
		marginTop: -32
	},
	countRow: {
		flexDirection: 'row',
		width: '70%',
		marginLeft: 32,
		justifyContent: 'space-around',
		alignItems: 'flex-end',
		flex: 1,
	},
	countText: {
		fontSize: 13,
		fontWeight: 'bold',
	},
	countBox: {
		alignItems: 'center',
		flex: 1,
		paddingVertical: 8,
		gap: 6,
		borderRadius: 8,
	},
	countHeading: {
		fontSize: 11,
		color: '#737373',
	},
	name: {
		fontSize: 21,
		fontWeight: 'bold',
		marginTop: 16,
	},
	username: {
		marginTop: 8,
		fontSize: 13,
		color: '#737373',
	},
	userLocation: {
		marginTop: 8,
		fontSize: 13,
		color: '#737373',
	},
	buttonContainer: {
		marginTop: 32,
		flexDirection: 'row',
		gap: 16,
		marginBottom: 16,
	},
	headerContainer: {
		shadowColor: '#fff',
		borderBottomColor: '#eeeeee',
		borderBottomWidth: 1,
		paddingTop: 16,
	},
	topBarIndicator: {
		height: 3,
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8,
		backgroundColor: 'black',
	},
	indicatorContainer: {
		justifyContent: 'center', // Ensure the indicator is centered
		marginHorizontal: 16,
	},
	topBarLabel: {
		fontWeight: 'bold',
		paddingTop: 8,
		fontSize: 13,
	},

});
