import { View, StyleSheet } from 'react-native';
import Layout from '../ChangeSettingsLayout';
import SelectMenu from '../../../components/form/SelectMenu';
import InputField from '../../../components/form/FormInput';
import React from 'react';
import targetCountries from '../../../constants/targetCountries';
import BlueButton from '../../../components/buttons/BlueButton';
import { useUpdateResumeMutation } from '../apiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import ErrorMessage from '../../../components/messsages/Error';
import { setSalary } from '../../../app/jobsSlice';
import PopUpMessage from '../../profile/editProfile/PopUpMessage';
import { useNavigation } from '@react-navigation/native';

const currencyOptions = targetCountries.map((country) => ([country.currencyName, country.currency]))

export default function() {
	const currentCurrency = useSelector((state: RootState) => state.jobs.salaryCurrency);
	const currentSalary = useSelector((state: RootState) => state.jobs.salary);
	const [currency, setCurrency] = React.useState<string | null>(currentCurrency);
	const [salary, setSalaryState] = React.useState(currentSalary ? String(currentSalary) : '');
	const [updateSalary, { isLoading }] = useUpdateResumeMutation();
	const [error, setError] = React.useState('');
	const dispatch = useDispatch();
	const [popupVisible, setPopupVisible] = React.useState(false);
	const navigation = useNavigation();

	async function handleUpdate() {
		try {
			if (currency && salary) {
				await updateSalary({ expected_salary_currency: currency, expected_salary: Number(salary) }).unwrap();
				dispatch(setSalary({ salary: Number(salary), currency }));
				setPopupVisible(true);
			}
		}
		catch (e) {
			console.log(e)
			setError('Something went wrong. Please try again later.');
		}


	}

	return (
		<Layout
			headerTitle='Salary Expectation'
			heading="Set Your Salary Expectation"
			text='Setting your salary expectations allows us to match you with opportunities that align with your skills and career goals, ensuring tailored job recommendations and smoother negotiations.'
			secondaryText="Kindly note, Your salary expectation remains confidential - it won't appear on your public profile, be included in your resume, or be shared with recruiters when you apply for a job. It is used solely to help you find the right job match."
		>
			<PopUpMessage
				heading='Salary Expectation Updated'
				text='Your salary expectation has been saved. You’ll now receive tailored recommendations and opportunities based on your expected salary.'
				visible={popupVisible}
				setVisible={setPopupVisible}
				isLoading={false}
				singleButton
				onPress={() => {
					navigation.goBack();
				}}
			/>
			<View style={styles.container}>
				<View style={{ flex: 2 / 5 }}>
					<SelectMenu
						options={currencyOptions}
						placeholder='Currency'
						selected={currency}
						onSelect={setCurrency}
					/>
				</View>
				<View style={{ flex: 3 / 5 }}>
					<InputField
						placeholder='Expected Salary'
						value={salary}
						onChangeText={setSalaryState}
						keyboardType='numeric'
						topMargin={false}
					/>
				</View>
			</View>
			<View style={{ gap: 4 }}>
				<BlueButton
					title='Update'
					onPress={handleUpdate}
					loading={isLoading}
					disabled={!currency || !salary}
				/>
				<ErrorMessage
					message={error}
				/>
			</View>
		</Layout >
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		width: '100%',
		gap: 16,
		marginBottom: 48,
	}
})
