import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import Layout from '../../profile/controlCentre/accountCenter/PageLayout';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import BlueButton from '../../../components/buttons/BlueButton';
import React from 'react';
import IconButton from '../../../components/buttons/IconButton';


function Detail({ heading, text }: { heading: string, text: string }) {
	return (
		<View style={{ gap: 4 }}>
			<Text style={styles.detailsHeading}>{heading}</Text>
			<Text style={styles.detailsText}>{text}</Text>
		</View>
	)
}

export default function JobsView() {
	const navigation = useNavigation();
	React.useEffect(() => {
		navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });

		return () => {
			navigation.getParent()?.setOptions({
				tabBarStyle: {
					display: 'flex',
					height: 54,
					marginBottom: 0,
					paddingBottom: 0,
				}
			});
		};
	}, [navigation]);
	return (
		<>
			<Layout
				headerTitle='Job Details'
			>
				<LinearGradient
					colors={['#ffffff', '#0070ad']}
					start={{ x: 0, y: 0 }}
					end={{ x: 0, y: 1 }}
					style={styles.graident}
				/>
				<View style={{ flexDirection: 'row', gap: 16 }}>
					<View style={styles.logoContainer}>
						<Image style={styles.logo} source={require('../assets/capGemini.png')} />
					</View>
					<View style={styles.companyContainer}>
						<Text style={styles.companyName}>Capgemini</Text>
						<Text style={styles.postedDate}>Posted 1 day ago</Text>
					</View>
				</View>
				<View style={styles.detailsContainer}>
					<Detail
						heading='Job Role'
						text='Senior Salesforce Developer'
					/>
					<Detail
						heading='Job Type'
						text='Full Time'
					/>
					<Detail
						heading='Work Mode'
						text='On-site'
					/>
					<Detail
						heading='Experience'
						text='Minimum 3 years'
					/>
					<Detail
						heading='Salary Range'
						text='400000 - 500000 INR'
					/>
					<Detail
						heading='Job Location'
						text='Bangalore, India'
					/>
				</View>
				<View style={{ paddingBottom: Platform.OS === 'ios' ? 112 : 176 }}>
					<View style={{ gap: 32 }}>
						<JobDetails
							heading='Job Description'
							text='As a Senior Salesforce Developer, you will be responsible for designing, implementing, and maintaining customized Salesforce solutions that align with business objectives. You will work closely with stakeholders, administrators, and other developers to enhance the platform’s capabilities, ensuring seamless integration and high performance.'
						/>
						<DetailsList
							heading='Key Responsibilities'
							content={['Design and develop customized Salesforce solutions using Apex, Visualforce, and Lightning components.',
								'Collaborate with cross-functional teams to gather requirements and translate them into technical specifications.',
								'Implement best practices for Salesforce development, including code reviews and unit testing.',
								'Integrate Salesforce with other systems using APIs and middleware tools.',
								'Provide technical guidance and mentorship to junior developers.',
								'Troubleshoot and resolve issues related to Salesforce applications and integrations.',
								'Stay updated with the latest Salesforce features and enhancements, and recommend improvements to existing solutions.',
								'Participate in Agile development processes, including sprint planning and retrospectives.',
								'Document technical specifications, design patterns, and development processes.',
								'Ensure compliance with Salesforce security and data privacy standards.',
								'Work closely with Salesforce administrators to optimize system performance and user experience.',
								'Assist in the deployment of Salesforce solutions to production environments.',
								'Conduct training sessions for end-users and stakeholders on new features and functionalities.',
							]}
						/>
						<DetailsList
							heading='Requirements'
							content={['Bachelor’s degree in Computer Science or related field.',
								'3+ years of experience in Salesforce development, including Apex, Visualforce, and Lightning.',
								'Strong understanding of Salesforce architecture and data model.',
								'Experience with Salesforce APIs and integration techniques.',
								'Excellent problem-solving skills and attention to detail.',
								'Ability to work independently and as part of a team.',
								'Salesforce certifications (e.g., Salesforce Certified Developer) are a plus.',
								'Strong communication skills, both verbal and written.',
								'Experience with Agile development methodologies.',
								'Knowledge of Salesforce best practices and design patterns.',
								'Experience with version control systems (e.g., Git) and CI/CD pipelines.',
								'Familiarity with front-end technologies (e.g., JavaScript, HTML, CSS) is a plus.',
							]}
						/>
					</View>
				</View>
			</Layout>
			<View style={styles.applyButtonContainer}>
				<IconButton
					square
					onPress={() => { }}
				>
					<Image source={require('../assets/share.png')} style={{ width: 24, height: 24, objectFit: 'contain' }} />
				</IconButton>
				<View style={{ flex: 1 }}>
					<BlueButton
						title='Apply Now'
					/>
				</View>
			</View>
		</>
	)
}


const DetailsList = ({ heading, content }: { heading: string, content: string[] }) => {
	return (
		<View>
			<Text style={styles.detailHeading}>{heading}</Text>
			<UnorderedList
				items={content}
			/>
		</View>
	)
}


const UnorderedList = ({ items }: { items: string[] }) => {
	return (
		<View style={styles.container}>
			{items.map((item, index) => (
				<View style={styles.listItem} key={index}>
					<Text style={styles.bullet}>{'\u2022'}</Text>
					<Text style={styles.detailText}>{item}</Text>
				</View>
			))}
		</View>
	);
};


function JobDetails({ heading, text }: { heading: string, text: string }) {
	return (<View>
		<Text style={styles.detailHeading}>{heading}</Text>
		<Text style={styles.detailText}>{text}</Text>
	</View>
	)
}

const styles = StyleSheet.create({
	shareButtonContainer: {
		height: 45,
		width: 45,
		backgroundColor: '#f5f5f5',
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	container: {
		marginLeft: 8,
		marginRight: 16,
	},
	listItem: {
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	bullet: {
		marginRight: 6,
		fontSize: 22,
		lineHeight: 22,
		color: '#737373'
	},
	applyButtonContainer: {
		position: 'absolute',
		bottom: 0,
		flexDirection: 'row',
		backgroundColor: 'white',
		padding: 16,
		borderTopWidth: 1,
		borderColor: '#eeeeee',
		gap: 16
	},
	detailsContainer: {
		borderWidth: 1,
		borderColor: '#eeeeee',
		padding: 16,
		gap: 24,
		borderRadius: 12,
		marginTop: 48,
		marginBottom: 32,
	},
	detailHeading: {
		fontSize: 15,
		fontWeight: 'bold',
		marginBottom: 8
	},
	detailText: {
		fontSize: 13,
		color: '#737373',
		textAlign: 'justify'
	},
	detailsHeading: {
		fontSize: 9,
		color: '#a6a6a6',
	},
	detailsText: {
		fontSize: 13,
	},
	graident: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 164,
		marginHorizontal: -16,
		marginTop: -24,
	},
	text: {
		fontSize: 15,
		fontWeight: 'bold',
		color: 'white',
	},
	logoContainer: {
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#f5f5f5',
		backgroundColor: 'white',
		marginTop: -24,
	},
	logo: {
		height: 56,
		width: 56,
		objectFit: 'contain'
	},
	companyContainer: {
		marginTop: 16,
	},
	companyName: {
		fontSize: 15,
		fontWeight: 'bold',
	},
	postedDate: {
		fontSize: 11,
		color: '#a6a6a6',
		marginTop: 8
	}
})
