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
import { useSetWebsiteMutation } from '../../apiSlice';
import { setUser } from '../../../../app/userSlice';
import ErrorMessage from '../../../../components/messsages/Error';

export default function GitHub() {
	const currentWebsite = useSelector((state: RootState) => state.user.website)
	const dispatch = useDispatch();
	const [newWebsite, setNewWebsite] = React.useState(currentWebsite || '');
	const [popUpVisible, setPopUpVisible] = React.useState(false);

	const [setWebsite, { isLoading }] = useSetWebsiteMutation();

	const navigation = useNavigation();
	const [error, setError] = React.useState('')

	async function updateGitHub() {
		try {
			await setWebsite({ website: newWebsite }).unwrap()
			dispatch(setUser({ website: newWebsite }))
			setPopUpVisible(true)
		} catch (e) {
			console.log(e)
			setError('Something went wrong! Please try again later.')
		}
	}

	return (
		<Layout
			headerTitle='Website'
		>			<PopUpMessage
				heading='Website Updated'
				text='Your website has been successfully added to your profile. Visitors can now explore more about you through your shared link.'
				visible={popUpVisible}
				setVisible={setPopUpVisible}
				onPress={() => navigation.goBack()}
				isLoading={false}
				singleButton
			/>

			<Text style={styles.heading}>Boost Your Professional Persence</Text>
			<Text style={styles.content}>
				Adding your website highlights your portfolio, projects, or personal brand, increasing your professional visibility and job opportunities. Your website is securely linked and used solely to enhance your hiring prospects.
			</Text>
			<Text style={[styles.content, { marginTop: 24 }]}>
				Kindly note, your website will not appear on your public profile - it will only be included in your resume and shared with recruiters when you apply for a job.
			</Text>
			<View style={{ marginTop: 32, marginBottom: 48 }}>
				<InputField
					value={newWebsite}
					onChangeText={setNewWebsite}
					placeholder='Website URL'
				/>
			</View>
			<View style={{ gap: 8 }}>
				<BlueButton
					title='Update'
					disabled={newWebsite === currentWebsite || newWebsite === ''}
					onPress={updateGitHub}
					loading={isLoading}
				/>
				<ErrorMessage message={error} />
			</View>
		</Layout>
	)
}
