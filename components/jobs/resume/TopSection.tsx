import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/appHelpers/store';
import BackgroundMapping from '@/assets/images/profile/Background/backgroundMapping';
import BackgroundImageLoader from '@/components/BackgroundImageLoader';
import ImageLoader from '@/components/ImageLoader';
import { Image, StyleSheet, Text, View } from 'react-native';


const employmentStatus = ['Open to Work', 'Employed, but Exploring', 'Fresher, Ready to Start', 'Not Looking Right Now'];

export default function TopSection() {
	const user = useSelector((state: RootState) => state.user);
	const status = useSelector((state: RootState) => state.jobs.employmentStatus);

	return (
		<>
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
				</View>
				<View style={{ marginTop: 8, gap: 4 }}>
					<Text style={styles.name}>{user.firstName} {user.lastName}</Text>
					{
						status != null && (
							<Text style={styles.status}>{employmentStatus[status]}</Text>
						)
					}
					<Text style={styles.smallText}>@{user.username}</Text>
					<Text style={styles.smallText}>{user.city}, {user.state}, {user.country}</Text>
				</View>
			</View>
		</>
	)
}

const styles = StyleSheet.create({
	container: {
		marginTop: 48,
		gap: 48,
	},
	heading: {
		fontSize: 15,
		fontWeight: 'bold',
	},
	smallText: {
		fontSize: 13,
		color: '#737373'
	},
	name: {
		marginTop: 8,
		fontSize: 20,
		fontWeight: 'bold'
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
	status: {
		color: '#004aad',
		fontSize: 13,
		fontWeight: 'bold',
	},
	profileRow: {
		flexDirection: 'row',
		position: 'relative',
		marginTop: -32
	},
	header: {
		backgroundColor: 'white',
		top: 0,
		width: '100%',
		zIndex: 1,
		paddingHorizontal: 16,
		paddingVertical: 8,
		gap: 16,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	menuIcon: {
		width: 24,
		height: 24,
	},
	bgImage: {
		width: '100%',
		height: 164,
	},
	headerText: {
		fontSize: 15,
		fontWeight: 'bold',
	}
})
