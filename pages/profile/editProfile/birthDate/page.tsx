import { Text, View } from 'react-native';
import Layout from '../../controlCentre/accountCenter/PageLayout';
import { styles } from '../location/page';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { SectionContainer, Section, SectionOption } from '../../controlCentre/OptionsSection';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import SelectDateScreen from './SelectDate';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';

function Page() {
	const navigation = useNavigation<NavigationProp>();
	const dobDate = useSelector((state: RootState) => state.user.dobDate);
	const dobMonth = useSelector((state: RootState) => state.user.dobMonth);
	const dobYear = useSelector((state: RootState) => state.user.dobYear);
	return (
		<Layout
			headerTitle='Birthday'
		>
			<Text style={styles.heading}>Celebrate Your Journey</Text>
			<Text style={styles.content}>
				Sharing your birthday helps us craft a personalized experience just for you - unlocking birthday surprises, exclusive offers, and content that celebrates your special day, all while keeping your information secure.
			</Text>
			<Text style={[styles.content, { marginTop: 24 }]}>
				Kindly note, the birthday information you provide will not appear on your public profile. It will only be included in your resume and seen by recruiters when you apply for a job.
			</Text>
			<View style={{ marginTop: 32 }}>
				<SectionContainer>
					<Section>
						<SectionOption
							title='Your Birthdate'
							subTitle={dobDate && dobMonth && dobYear ? `${dobDate} ${dobMonth} ${dobYear}` : '-'}
							onPress={() => navigation.navigate('SelectDate')}
						/>
					</Section>
				</SectionContainer>
			</View>
		</Layout>
	)
}


type StackParamList = {
	Home: undefined,
	SelectDate: undefined,
}

type NavigationProp = NativeStackNavigationProp<StackParamList>;

const Stack = createNativeStackNavigator<StackParamList>();

export default function Navigation() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Home" component={Page} />
			<Stack.Screen name="SelectDate" component={SelectDateScreen} />
		</Stack.Navigator>
	)
}

