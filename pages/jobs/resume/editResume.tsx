import TopSection from './TopSection';
import Header from '../../profile/controlCentre/Header';
import { useNavigation } from '@react-navigation/native';
import { Pressable, ScrollView, Text, View, StyleSheet } from 'react-native';
import { ProfileSection } from '../../profile/home/ProfileContent';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { Linking, Image } from 'react-native';
import IconButton from '../../profile/components/IconButton';
import BottomName from '../../profile/home/BottomName';
import { NavigationProps } from '../page';
import ReadMoreText from './ReadMore';

export default function() {
	const navigation = useNavigation<NavigationProps>();
	const user = useSelector((state: RootState) => state.user);
	const jobs = useSelector((state: RootState) => state.jobs);
	return (
		<ScrollView>
			<Header
				onBackPress={() => navigation.goBack()}
				title='Update Resume'
			/>
			<View style={styles.container}>
				<TopSection />
				<View style={styles.resumeContainer}>
					{jobs.about ? (
						<View>
							<Text style={styles.detailsHeading}>About</Text>
							<Pressable
								onPress={() => navigation.navigate('About')}
							>
								{
									({ pressed }) => (
										<View style={[styles.editDetailsContainer, pressed && { backgroundColor: '#f5f5f5' }]}>
											<ReadMoreText
												text={jobs.about || ''}
											/>
										</View>
									)
								}

							</Pressable>
						</View>
					) : (
						<ProfileSection
							title='About'
							content="You haven't introduced yourself yet. Let the world know about your  story!"
							onPress={() => navigation.navigate('About')}
						/>
					)}

					<ProfileSection
						title='Experience'
						content='You haven’t added any experience yet. Share your journey and expertise!'
						onPress={() => navigation.navigate('WorkExperience')}
					/>
					<ProfileSection
						title='Education'
						content='You haven’t added any education yet. Highlight your academic achievements!'
					/>
					<View>
						<Text style={styles.detailsHeading}>Certifications</Text>
						<Text style={styles.detailsContent}>
							You haven't completed any certifications yet. Once you complete one, it'll be showcased here.
						</Text>

					</View>
					<ProfileSection
						title='Other Certifications'
						content='You haven’t added any certifications yet. Showcase your achievements and skills!'
					/>
					<View>
						<Text style={styles.detailsHeading}>Projects</Text>
						<Text style={styles.detailsContent}>
							You haven't completed any project yet. Once you do, they'll be showcased here.
						</Text>

					</View>
					<ProfileSection
						title='Skills'
						content='You haven’t added any skills yet. Showcase your expertise and stand out!'
					/>
					<View>
						<Text style={styles.detailsHeading}>Date of Birth</Text>
						<Text style={styles.detailsContent}>
							{user.dobDate && user.dobMonth && user.dobYear ? `${user.dobDate} ${user.dobMonth} ${user.dobYear}` : 'You haven’t added your date of birth yet. Add it to showcase your age!'}
						</Text>

					</View>
					<View>
						<Text style={styles.detailsHeading}>Get In Touch</Text>
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
				</View>
			</View>
			<BottomName />
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	editDetailsContainer: {
		marginHorizontal: -16,
		paddingHorizontal: 16,
	},
	container: {
		marginTop: 57,
	},
	resumeContainer: {
		marginHorizontal: 16,
		marginTop: 32,
		gap: 48,
	},
	detailsHeading: {
		fontWeight: 'bold',
		fontSize: 15,
	},
	menuIcon: {
		height: 24,
		width: 24,
	},
	detailsContent: {
		fontSize: 13,
		color: '#a6a6a6',
		textAlign: 'justify',
		marginTop: 8,
		verticalAlign: 'bottom',
	},
})
