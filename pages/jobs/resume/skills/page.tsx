import { Text, View } from 'react-native';
import PageLayout from '../../../profile/controlCentre/accountCenter/PageLayout';
import { styles } from '../education/page';
import FormInput from '../../../../components/form/FormInput';
import React from 'react';
import BlueButton from '../../../../components/buttons/BlueButton';
import ErrorMessage from '../../../../components/messsages/Error';
import { useUpdateSkillsMutation } from '../../apiSlice';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { setSkills } from '../../../../app/jobsSlice';
import { RootState } from '../../../../app/store';


export default function() {
	const { skills } = useSelector((state: RootState) => state.jobs);
	let areSkills = false
	if (skills && skills.length > 0) {
		areSkills = true
	}
	const [skill1, setSkill1] = React.useState(areSkills && skills ? skills[0] : '');
	const [skill2, setSkill2] = React.useState(areSkills && skills ? skills[1] : '');
	const [skill3, setSkill3] = React.useState(areSkills && skills ? skills[2] : '');

	const [error, setError] = React.useState('');

	const [updateSkills, { isLoading }] = useUpdateSkillsMutation();
	const navigation = useNavigation();
	const dispatch = useDispatch();

	async function handleUpdateSkills() {
		const data = [skill1, skill2, skill3];
		try {
			await updateSkills({
				skills: data
			}).unwrap();
			dispatch(setSkills(data));
			navigation.goBack();
		} catch (e) {
			setError('Something went wrong! Please try again later.');
			console.log(e);
		}
	}

	return (
		<PageLayout
			headerTitle='Skills'
		>
			<View>
				<Text style={styles.label}>Showcase Your Skills</Text>
				<View style={{ gap: 16, marginBottom: 48 }}>
					<FormInput
						placeholder='ex: Problem Solving'
						value={skill1}
						onChangeText={setSkill1}
						topMargin={false}
					/>
					<FormInput
						placeholder='ex: Team Collaboration'
						value={skill2}
						onChangeText={setSkill2}
						topMargin={false}
					/>
					<FormInput
						placeholder='ex: Time Management'
						value={skill3}
						onChangeText={setSkill3}
						topMargin={false}
					/>
				</View>
				<BlueButton
					title='Save'
					loading={isLoading}
					onPress={handleUpdateSkills}
					disabled={(areSkills && skills) ? ((skill1 === skills[0] && skill2 === skills[1] && skill3 === skills[2]) || skill1 === '' || skill2 === '' || skill3 === '') : (skill1 === '' && skill2 === '' && skill3 === '')}
				/>
				{
					error && (
						<View style={{ marginTop: 8 }}>
							<ErrorMessage message={error} />
						</View>
					)
				}
			</View>
		</PageLayout>
	)
}
