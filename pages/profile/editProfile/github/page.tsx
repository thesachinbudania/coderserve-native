import { Text, View } from 'react-native';
import Layout from '../../controlCentre/accountCenter/PageLayout';
import { styles } from '../location/page';
import InputField from '../../../../components/form/FormInput';
import React from 'react';
import BlueButton from '../../../../components/buttons/BlueButton';
import PopUpMessage from '../PopUpMessage';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../app/store';
import { useSetGitHubMutation } from '../../apiSlice';
import { setUser } from '../../../../app/userSlice';
import ErrorMessage from '../../../../components/messsages/Error';

export default function GitHub() {
	const currentGithub = useSelector((state: RootState) => state.user.gitHub)
	const dispatch = useDispatch();
	const [newGithub, setNewGithub] = React.useState(currentGithub || '');
	const [popUpVisible, setPopUpVisible] = React.useState(false);

	const [setGitHub, { isLoading }] = useSetGitHubMutation();

	const navigation = useNavigation();
	const [error, setError] = React.useState('')

	async function updateGitHub() {
		try {
			await setGitHub({ gitHub: newGithub }).unwrap()
			dispatch(setUser({ gitHub: newGithub }))
			setPopUpVisible(true)
		} catch (e) {
			console.log(e)
			setError('Something went wrong! Please try again later.')
		}
	}

	return (
		<Layout
			headerTitle='GitHub'
		>			<PopUpMessage
				heading='GitHub Updated'
				text='Get ready to impress recruiters and unlock new opportunities with you coding prowess.'
				visible={popUpVisible}
				setVisible={setPopUpVisible}
				onPress={() => navigation.goBack()}
				isLoading={false}
				singleButton
			/>

			<Text style={styles.heading}>Enhance Your Hiring Prospects</Text>
			<Text style={styles.content}>
				Adding your GitHub profile showcases your coding projects and contributions, boosting your professional visibility and connecting you with job opportunities. Your profile is securely linked and used solely to improve your hiring prospects.</Text>
			<Text style={[styles.content, { marginTop: 24 }]}>
				Kindly note, your GitHub profile will not appear on your public profile. It will only be included in your resume and shared with recruiters when you apply for a job.
			</Text>
			<View style={{ marginTop: 32, marginBottom: 48 }}>
				<InputField
					value={newGithub}
					onChangeText={setNewGithub}
					placeholder='GitHub URL'
				/>
			</View>
			<View style={{ gap: 8 }}>
				<BlueButton
					title='Update'
					disabled={newGithub === currentGithub || newGithub === ''}
					onPress={updateGitHub}
					loading={isLoading}
				/>
				<ErrorMessage message={error} />
			</View>
		</Layout>
	)
}
