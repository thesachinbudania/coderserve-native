import { BackHandler, StyleSheet, ScrollView, Text, View } from 'react-native'
import Header from '../../Header';
import { useNavigation } from '@react-navigation/native';
import React from 'react'


function Status({ active, statusFor, secondaryContent }: { active: boolean, statusFor: string, secondaryContent: string }) {
	return (
		<View>
			<View style={styles.statusHeadingContainer}>
				<Text style={styles.statusHeading}>{statusFor}</Text>
				<Text style={active ? styles.activeText : styles.inactiveText}>{active ? 'Active' : 'Inactive'}</Text>
			</View>
			<Text style={styles.secondaryText}>{secondaryContent}</Text>
		</View>
	)
}

export default function AccountStatus() {
	const navigation = useNavigation();
	const handleBackButtonPress = () => {
		navigation.goBack();
		return true;
	};
	React.useEffect(() => {
		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			handleBackButtonPress,
		);

		return () => backHandler.remove();
	}, []);
	return (
		<>
			<Header
				title='Account Status'
				onBackPress={() => { navigation.goBack() }}
			/>
			<View style={styles.container}>
				<ScrollView >
					<View style={styles.statusContainer}>
						<Status
							active={true}
							statusFor='Learning Courses'
							secondaryContent='Please note that failure to adhere to community guidelines may result in revocation without notice.'
						/>
						<Status
							active={false}
							statusFor='Certifications'
							secondaryContent='Your profile is incomplete. Update your profile details to activate this feature.'
						/>
						<Status
							active={false}
							statusFor='Posting in Talks'
							secondaryContent='Your profile is incomplete. Update your profile details to activate this feature.'
						/>
						<Status
							active={false}
							statusFor='Commenting on Posts'
							secondaryContent='Your profile is incomplete. Update your profile details to activate this feature.'
						/>
						<Status
							active={false}
							statusFor='Applying to Jobs'
							secondaryContent='Your profile is incomplete. Update your profile details to activate this feature.'
						/>
						<Status
							active={false}
							statusFor='Offering Projects'
							secondaryContent='Your profile is incomplete. Update your profile details to activate this feature.'
						/>
						<Status
							active={false}
							statusFor='Applying to Projects'
							secondaryContent='Your profile is incomplete. Update your profile details to activate this feature.'
						/>
						<Status
							active={false}
							statusFor='Wallet'
							secondaryContent='Your profile is incomplete. Update your profile details to activate this feature.'
						/>
					</View>
				</ScrollView>
			</View>
		</>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		paddingTop: 40,
	},
	statusContainer: {
		gap: 48,
		marginTop: 57,
		paddingHorizontal: 16,
		paddingBottom: 64,
	},
	statusHeading: {
		fontSize: 15,
		fontWeight: 'bold',
	},
	statusHeadingContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	activeText: {
		fontSize: 13,
		color: '#00bf63',
		fontWeight: 'bold',
	},
	inactiveText: {
		fontSize: 13,
		color: '#ff5757',
		fontWeight: 'bold',
	},
	secondaryText: {
		fontSize: 13,
		color: '#a6a6a6',
		marginTop: 6,
		textAlign: 'justify',
	}
})
