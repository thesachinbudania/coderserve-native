import { Image, Linking, StyleSheet, ScrollView, Text, View } from 'react-native';
import IconButton from '../../profile/components/IconButton';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../page';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import TopSection from './TopSection';
import BottomName from '../../profile/home/BottomName';
import Menu, { MenuButton } from '../Menu';
import React from 'react';
import ReadMore from './ReadMore';


export default function Resume() {
	const navigation = useNavigation<NavigationProps>();
	const user = useSelector((state: RootState) => state.user);
	const jobs = useSelector((state: RootState) => state.jobs);
	const menuRef = React.useRef<any>(null);



	return (
		<ScrollView>
			<View style={styles.header}>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
					<IconButton onPress={() => navigation.goBack()}>
						<Image source={require('../../profile/controlCentre/assets/Back.png')} style={styles.menuIcon} />
					</IconButton>
					<Text style={styles.headerText}>Your Resume</Text>
				</View>
				<IconButton onPress={() => menuRef?.current.open()}>
					<Image source={require('../../profile/home/assets/menu.png')} style={styles.menuIcon} />
				</IconButton>
			</View>
			<TopSection />
			<View style={styles.body}>
				<View style={styles.container}>
					<View>
						<Text style={styles.heading}>About</Text>
						{jobs.about ? <ReadMore
							text={jobs.about}
						/>
							: (
								<Text style={styles.smallText}>The user hasn't shared their story yet.</Text>
							)
						}
					</View>
					<View>
						<Text style={styles.heading}>Experience</Text>
						<Text style={styles.smallText}>THe user hasn't shared their experience yet.</Text>
					</View>
					<View>
						<Text style={styles.heading}>Education</Text>
						<Text style={styles.smallText}>The user hasn't shared their education details yet.</Text>
					</View>
					<View>
						<Text style={styles.heading}>Certifications</Text>
						<Text style={styles.smallText}>The user hasn't completed any certifications yet.</Text>
					</View>
					<View>
						<Text style={styles.heading}>Other Certifications</Text>
						<Text style={styles.smallText}>The user hasn't shared any certifications yet.</Text>
					</View>
					<View>
						<Text style={styles.heading}>About</Text>
						<Text style={styles.smallText}>The user hasn't shared their story yet.</Text>
					</View>
					<View>
						<Text style={styles.heading}>Skills</Text>
						<Text style={styles.smallText}>The user hasn't shared their skills yet.</Text>
					</View>
					<View>
						<Text style={styles.heading}>Languages</Text>
						<Text style={styles.smallText}>The user hasn't shared any languages they know yet.</Text>
					</View>
					<View>
						<Text style={styles.heading}>Date of Birth</Text>
						<Text style={styles.smallText}>The user hasn't shared their date of birth yet.</Text>
					</View>
					<View>
						<Text style={styles.heading}>Get In Touch</Text>
						<View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
							{
								user.email && (
									<IconButton
										onPress={() => Linking.openURL(`mailto:${user.email}`)}
									>
										<Image source={require('./assets/Email.png')} style={styles.menuIcon} />
									</IconButton>
								)
							}
							{
								user.mobileCountryCode && user.mobileNumber && (
									<IconButton
										onPress={() => Linking.openURL(`tel:${user.mobileCountryCode + ' ' + user.mobileNumber}`)}
									>
										<Image source={require('./assets/Phone.png')} style={styles.menuIcon} />
									</IconButton>

								)
							}
							{
								user.whatsappNumber && user.whatsappCountryCode && (
									<IconButton
										onPress={() => Linking.openURL(`https://api.whatsapp.com/send?phone=${user.whatsappCountryCode}${user.whatsappNumber}`)}
									>
										<Image source={require('./assets/WhatsApp.png')} style={styles.menuIcon} />
									</IconButton>
								)
							}
							{
								user.gitHub && (
									<IconButton
										onPress={() => Linking.openURL(user.gitHub ? user.gitHub : 'https://github.com/')}
									>
										<Image source={require('./assets/GitHub.png')} style={styles.menuIcon} />
									</IconButton>
								)
							}
							{
								user.website && (
									<IconButton
										onPress={() => Linking.openURL(user.website ? user.website : 'https://www.example.com')}
									>
										<Image source={require('./assets/Website.png')} style={styles.menuIcon} />
									</IconButton>
								)
							}

						</View>
					</View>
					<BottomName />
				</View>
			</View>

			<Menu menuRef={menuRef}>
				<MenuButton
					heading='Employment Status'
					text="Show if you're currently job hunting."
					onPress={() => {
						menuRef?.current.close();
						navigation.navigate('EmploymentStatus')
					}}
				/>
				<MenuButton
					heading='Salary Expectation'
					text='Set expected salary for job matches.'
					onPress={() => {
						menuRef?.current.close();
						navigation.navigate('SalaryExpectations')
					}}
				/>
				<MenuButton
					heading='Update Resume'
					text='Add/remove resume details.'
					onPress={() => {
						menuRef?.current.close();
						navigation.navigate('UpdateResume')
					}}
				/>
				<MenuButton
					heading='Share Resume'
					text='Share your resume via link.'
				/>

			</Menu>

		</ScrollView>
	)
}


export const styles = StyleSheet.create({
	container: {
		marginTop: 48,
		gap: 48,
	},
	heading: {
		fontSize: 15,
		fontWeight: 'bold',
	},
	smallText: {
		marginTop: 4,
		fontSize: 13,
		color: '#737373',
		textAlign: 'justify'
	},
	readButton: {
		fontSize: 13,
		color: '#006dff',
		textDecorationLine: 'underline',
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
