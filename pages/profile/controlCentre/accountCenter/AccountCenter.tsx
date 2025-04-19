import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../Header';
import { useNavigation } from '@react-navigation/native';
import { Section, SectionOption, SectionContainer } from '../OptionsSection';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import type { StackProps } from './page';
import React from 'react';
import PopUp from '../../../../components/messsages/PopUp';
import type { AccountCenterStackParamList } from './page';
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import BlueButton from '../../../../components/buttons/BlueButton';
import ImageLoader from '../../../../components/ImageLoader';


function PopUpMessage({ setVisible, title, body }: { body: string, title: string, setVisible: React.Dispatch<React.SetStateAction<boolean>> }) {
	return (
		<>
			<Text style={styles.popUpeading}>{title}</Text>
			<Text style={styles.popUpBody}>{body}</Text>
			<BlueButton
				title='Okay'
				onPress={() => setVisible(false)}
			/>
		</>

	)
}


export default function AccountCenter({ route }: NativeStackScreenProps<AccountCenterStackParamList, 'Home'>) {
	const navigation = useNavigation<StackProps>();
	const user = useSelector((state: RootState) => state.user);
	const { popUpVisible, title, body } = route.params;
	console.log(title, body)
	const dateJoined = user.dateJoined ? new Date(user.dateJoined).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : null;
	const [visible, setVisible] = React.useState(popUpVisible);
	return (
		<SafeAreaView style={[{ flex: 1 }, Platform.OS === 'ios' && { marginTop: -16, }]}>
			<View style={{ backgroundColor: 'white', flex: 1 }}>
				<Header
					title='Account Center'
					onBackPress={() => navigation.goBack()}
				/>
				<PopUp visible={visible} setVisible={setVisible} >
					<PopUpMessage title={title} body={body} setVisible={setVisible} />
				</PopUp>
				<ScrollView>
					<View style={styles.body}>
						<View style={styles.avatarContainer}>
							{user.profilePicture &&
								<ImageLoader
									size={128}
									uri={user.profilePicture}
								/>
							}
							<Text style={styles.userId}>A0000007521</Text>
							<Text style={styles.joinDate}>Member since {dateJoined}</Text>
						</View>
						<SectionContainer>
							<Section>
								<SectionOption
									title='Update Email'
									subTitle='Change email address associated with your account.'
									onPress={() => navigation.navigate('UpdateEmail')}
								/>
								<SectionOption
									title='Update Password'
									subTitle='Change your account password.'
									onPress={() => navigation.navigate('ChangePassword')}
								/>
								<SectionOption
									title='Go Pro'
									subTitle='Subsribe to or manage your pro membership.'
								/>
								<SectionOption
									title='Ad Management'
									subTitle='Customize the ads you see.'
									onPress={() => navigation.navigate('AdManagement')}
								/>
								<SectionOption
									title='Account Status'
									subTitle="Check your account's current status."
									onPress={() => navigation.navigate('AccountStatus')}
								/>
								<SectionOption
									title='Device Permissions'
									subTitle='Control app and device permissions'
									onPress={() => navigation.navigate('DevicePermissions')}
								/>
								<SectionOption
									title='Login Activity'
									subTitle='View your login history, devices and locations.'
									onPress={() => navigation.navigate('LoginHistory')}
								/>
							</Section>
						</SectionContainer>
					</View>
				</ScrollView>
			</View>
		</SafeAreaView>
	)
}


const styles = StyleSheet.create({
	body: {
		marginHorizontal: 16,
		marginTop: 57,
	},
	avatarContainer: {
		alignItems: 'center',
		paddingVertical: 48,
	},
	userId: {
		fontSize: 15,
		fontWeight: 'bold',
		marginTop: 16,
	},
	joinDate: {
		fontSize: 13,
		color: '#a6a6a6',
		marginTop: 8,
	},
	popUpeading: {
		fontSize: 15,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 16,
	},
	popUpBody: {
		fontSize: 13,
		textAlign: 'center',
		marginBottom: 32,
		color: '#737373',
	}
})
